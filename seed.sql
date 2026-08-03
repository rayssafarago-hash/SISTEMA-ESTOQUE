USE controle_estoque;

INSERT INTO usuarios(nome, email, senha_hash) VALUES
('Administrador', ' admin@estoque.com', '$2a$10$Pzk56Ifp9RBmCo/YWXezOu13s92v50WGsoHeX/RUwBo7YKNOmvEQ.')

INSERT INTO categorias (nome, descricao) VALUES
('Bebidas', 'Refrigerantes, sucos e aguas'),
('Limpeza', 'Produtos de higiene e limpeza'),
('Papelaria', 'Material de escritorio');

INSERT INTO produtos(nome, descricao, preco, quantidade, estoque_minimo, categoria_id) VALUES
('Agua Mineral 500ml', 'Garrafa 500ml', 2.50, 120, 20, 1),
('Refrigerante Cola 2L', 'Garrafa 2 litros', 8.90, 40, 10, 1),
('Detergente Neutro', 'Frasco 500ml' 3.20, 60, 15,  2),
('Papel A4 500 folhas', 'Resma braca', 24.90, 15, 5, 3);

INSERT INTO movimentacoes (produtos_id, usuario_id, tipo, quantidade, observacao) VALUES 
(1, 1, 'ENTRADA', 100, 'Compra inicial'),
(1, 1, 'SAIDA', 10, 'Venda balcao'),
(2, 1, 'ENTRADA', 40, 'Reposicao'),
(4, 1, 'SAIDA', 3, 'Uso interno');
