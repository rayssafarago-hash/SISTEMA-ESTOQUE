require('dotenv').config();
const mysql = require('mysql2/promise');
 
const cfg = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};
 
console.log('\n--- Configuracao lida do arquivo .env ---');
console.log('DB_HOST    :', cfg.host);
console.log('DB_PORT    :', cfg.port);
console.log('DB_USER    :', cfg.user);
console.log('DB_PASSWORD:', cfg.password === undefined ? '(indefinido)' :
  (cfg.password === '' ? '(vazia)' : '******'));
console.log('DB_NAME    :', cfg.database);
console.log('------------------------------------------\n');
 
function dica(msg) { console.log('>> ' + msg); }
 
(async () => {
  // 1) Tenta conectar SEM escolher o banco (so no servidor MySQL)
  let conn;
  try {
    conn = await mysql.createConnection({
      host: cfg.host, port: cfg.port, user: cfg.user, password: cfg.password
    });
    console.log('[OK] Conectou no servidor MySQL (usuario e senha corretos).');
  } catch (e) {
    console.log('[ERRO] Nao conseguiu conectar no servidor MySQL.');
    console.log('       Codigo:', e.code, '-', e.message, '\n');
    if (e.code === 'ECONNREFUSED') {
      dica('O servidor MySQL parece DESLIGADO ou a porta esta errada.');
      dica('Windows: abra "Servicos" e verifique se o servico MySQL/MySQL80 esta "Em execucao".');
      dica('Confirme tambem se a porta no .env (DB_PORT) e a mesma do MySQL (geralmente 3306).');
    } else if (e.code === 'ER_ACCESS_DENIED_ERROR') {
      dica('Usuario ou senha invalidos. Ajuste DB_USER e DB_PASSWORD no arquivo .env.');
      dica('Se o root tem senha, coloque-a em DB_PASSWORD=; se nao tem, deixe DB_PASSWORD= vazio.');
    } else if (e.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
      dica('O MySQL 8 esta usando um metodo de senha que o driver rejeitou.');
      dica('No MySQL, rode: ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'\';');
      dica('(troque \'\' pela sua senha, se houver). Depois: FLUSH PRIVILEGES;');
    } else {
      dica('Verifique host, porta, usuario e senha no .env.');
    }
    process.exit(1);
  }
 
  // 2) Verifica se o banco existe
  try {
    const [rows] = await conn.query('SHOW DATABASES LIKE ?', [cfg.database]);
    if (rows.length === 0) {
      console.log(`[ERRO] O banco "${cfg.database}" NAO existe no servidor.\n`);
      dica('Voce ainda nao rodou os scripts de criacao do banco.');
      dica('Abra o MySQL Workbench e execute, nesta ordem:');
      dica('   1) database/schema.sql   (cria o banco e as tabelas)');
      dica('   2) database/seed.sql     (insere os dados de exemplo)');
      await conn.end();
      process.exit(1);
    }
    console.log(`[OK] O banco "${cfg.database}" existe.`);
  } catch (e) {
    console.log('[ERRO] Falha ao listar os bancos:', e.code, e.message);
    await conn.end();
    process.exit(1);
  }
 
  // 3) Conecta JA no banco e confere as tabelas
  await conn.end();
  try {
    const c2 = await mysql.createConnection(cfg);
    const [tabelas] = await c2.query('SHOW TABLES');
    const nomes = tabelas.map(t => Object.values(t)[0]);
    console.log('[OK] Tabelas encontradas:', nomes.length ? nomes.join(', ') : '(nenhuma)');
    const esperadas = ['usuarios', 'categorias', 'produtos', 'movimentacoes'];
    const faltando = esperadas.filter(t => !nomes.includes(t));
    if (faltando.length) {
      console.log('\n[ATENCAO] Faltam tabelas:', faltando.join(', '));
      dica('Rode novamente o database/schema.sql para criar as tabelas.');
    }
    const [[u]] = await c2.query('SELECT COUNT(*) AS n FROM usuarios').catch(() => [[{ n: '?' }]]);
    console.log('[INFO] Usuarios cadastrados:', u.n, '(se for 0, rode o database/seed.sql)');
    await c2.end();
    console.log('\n=== TUDO CERTO! A API deve conseguir conectar ao banco. ===\n');
  } catch (e) {
    console.log('[ERRO] Conectou no servidor, mas falhou ao usar o banco:', e.code, e.message);
    process.exit(1);
  }
})();

