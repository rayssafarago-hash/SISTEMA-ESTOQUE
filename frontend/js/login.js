if (pegarToken()) window.location.href = 'app.html';
 
const form = document.getElementById('form-login');
const msg = document.getElementById('mensagem');
 
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.className = 'mensagem';
 
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
 
  try {
    const resultado = await http.post('/auth/login', { email, senha });
    salvarToken(resultado.token);
    salvarUsuario(resultado.usuario);
    window.location.href = 'app.html';
  } catch (err) {
    msg.textContent = err.message;
    msg.className = 'mensagem erro';
  }
});
