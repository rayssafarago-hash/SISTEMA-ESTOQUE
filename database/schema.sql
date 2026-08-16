DROP DATABASE IF EXISTS controle_estoque;
CREATE DATABASE controle_estoque
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE controle_estoque;


CREATE TABLE usuarios(
id INT AUTO_INCREMENT PRIMARY KEY,
nome 		VARCHAR(100) NOT NULL,
email 		VARCHAR(150) NOT NULL UNIQUE,
senha_hash	VARCHAR(255) NOT NULL,
criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;

CREATE TABLE categorias (
id 		INT AUTO_INCREMENT PRIMARY KEY, 
nome 		VARCHAR(80) NOT NULL UNIQUE,
descricao	VARCHAR(255) NULL,
criado_em 	DATATIME NOT NULL DEFAUT CURRENT_TIMESTAMP
)ENGINE=InnoDB;

CREATE TABLE produtos (
id 		INT AUTO_INCREMENT PRIMARY KEY,
nome 		VARCHAR(120) 		NOT NULL,
descricao 	VARCHAR(255) 		NULL,
preco 		DECIMAL (10, 2) 	NOT NULL DEFAULT 0.00,
quantidade 	INT 			NOT NULL DEFAULT 0, 
estoque_minimo  INT 			NOT NULL DEFAULT 0,
categoria_id  	INT 			NOT NULL,
criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_produto_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT
)ENGINE=InnoDB;

CREATE TABLE movimentacoes (
id	INT AUTO_INCREMENT PRIMARY KEY,
produto_id INT NOT NULL,
usuario_id INT NOT NULL,
tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
quantidade INT NOT NULL, 
observacao VARCHAR(255) NULL,
criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_mov_produto
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
CONSTRAINT fk_mov_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
	ON UPDATE CASCADE
	ON DELETE RESTRICT
)ENGINE=InnoDB;

CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_mov_produto ON movimentacoes(produto_id);
CREATE INDEX idx_mov_data ON movimentacoes(criado_em);