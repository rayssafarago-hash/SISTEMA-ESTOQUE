const express = require('express');
const cors = require('cors');
 
const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const movimentacaoRoutes = require('./routes/movimentacaoRoutes');
const errorHandler = require('./middlewares/errorHandler');
 
const app = express();
 
app.use(cors());            
app.use(express.json());    
 
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Controle de Estoque no ar!' });
});
 
app.use('/auth', authRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);
 
app.use((req, res) => {
  res.status(404).json({ erro: 'Recurso nao encontrado.' });
});

app.use(errorHandler);
 
module.exports = app;
