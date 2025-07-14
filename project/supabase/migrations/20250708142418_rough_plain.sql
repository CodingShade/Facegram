-- Inserir usuários de exemplo
INSERT INTO users (name, email, password, bio, location, avatar_url, cover_photo_url, created_at, updated_at) VALUES
('Maria Silva', 'maria@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Apaixonada por fotografia e viagens ✈️📸', 'São Paulo, Brasil', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1200', NOW(), NOW()),
('João Santos', 'joao@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Desenvolvedor apaixonado por tecnologia 💻', 'Rio de Janeiro, Brasil', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, NOW(), NOW()),
('Ana Costa', 'ana@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Designer gráfica e artista 🎨', 'Belo Horizonte, Brasil', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400', NULL, NOW(), NOW());

-- Inserir posts de exemplo
INSERT INTO posts (content, image_url, user_id, created_at, updated_at) VALUES
('Que dia lindo para uma caminhada no parque! 🌞 Aproveitando cada momento desta manhã perfeita.', 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600', 2, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('Finalmente terminei meu projeto de fotografia! Foram meses de trabalho, mas o resultado valeu a pena. Obrigada a todos que me apoiaram nessa jornada! 📸✨', NULL, 3, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
('Explorando novos lugares e capturando momentos únicos! A fotografia me permite ver o mundo de uma forma completamente diferente. 📷✨', 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600', 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Inserir comentários de exemplo
INSERT INTO comments (content, user_id, post_id, created_at, updated_at) VALUES
('Que foto incrível! Onde foi tirada?', 3, 1, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('Parabéns pelo projeto! Ficou sensacional!', 1, 2, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
('Suas fotos sempre me inspiram!', 2, 3, NOW() - INTERVAL '20 hours', NOW() - INTERVAL '20 hours');

-- Inserir curtidas de exemplo
INSERT INTO likes (user_id, post_id, created_at) VALUES
(1, 1, NOW() - INTERVAL '1 hour'),
(3, 1, NOW() - INTERVAL '30 minutes'),
(1, 2, NOW() - INTERVAL '3 hours'),
(2, 2, NOW() - INTERVAL '2 hours'),
(3, 2, NOW() - INTERVAL '1 hour'),
(2, 3, NOW() - INTERVAL '18 hours'),
(3, 3, NOW() - INTERVAL '15 hours');