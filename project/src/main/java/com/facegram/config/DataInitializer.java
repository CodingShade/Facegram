package com.facegram.config;

import com.facegram.model.Comment;
import com.facegram.model.Like;
import com.facegram.model.Post;
import com.facegram.model.User;
import com.facegram.repository.CommentRepository;
import com.facegram.repository.LikeRepository;
import com.facegram.repository.PostRepository;
import com.facegram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Criar usuários de exemplo
        User maria = new User();
        maria.setName("Maria Silva");
        maria.setEmail("maria@example.com");
        maria.setPassword(passwordEncoder.encode("123456"));
        maria.setBio("Apaixonada por fotografia e viagens ✈️📸");
        maria.setLocation("São Paulo, Brasil");
        maria.setAvatarUrl("https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400");
        maria.setCoverPhotoUrl("https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1200");
        maria = userRepository.save(maria);
        
        User joao = new User();
        joao.setName("João Santos");
        joao.setEmail("joao@example.com");
        joao.setPassword(passwordEncoder.encode("123456"));
        joao.setBio("Desenvolvedor apaixonado por tecnologia 💻");
        joao.setLocation("Rio de Janeiro, Brasil");
        joao.setAvatarUrl("https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400");
        joao = userRepository.save(joao);
        
        User ana = new User();
        ana.setName("Ana Costa");
        ana.setEmail("ana@example.com");
        ana.setPassword(passwordEncoder.encode("123456"));
        ana.setBio("Designer gráfica e artista 🎨");
        ana.setLocation("Belo Horizonte, Brasil");
        ana.setAvatarUrl("https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400");
        ana = userRepository.save(ana);
        
        // Criar posts de exemplo
        Post post1 = new Post();
        post1.setContent("Que dia lindo para uma caminhada no parque! 🌞 Aproveitando cada momento desta manhã perfeita.");
        post1.setImageUrl("https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600");
        post1.setUser(joao);
        post1 = postRepository.save(post1);
        
        Post post2 = new Post();
        post2.setContent("Finalmente terminei meu projeto de fotografia! Foram meses de trabalho, mas o resultado valeu a pena. Obrigada a todos que me apoiaram nessa jornada! 📸✨");
        post2.setUser(ana);
        post2 = postRepository.save(post2);
        
        Post post3 = new Post();
        post3.setContent("Explorando novos lugares e capturando momentos únicos! A fotografia me permite ver o mundo de uma forma completamente diferente. 📷✨");
        post3.setImageUrl("https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600");
        post3.setUser(maria);
        post3 = postRepository.save(post3);
        
        // Criar comentários de exemplo
        Comment comment1 = new Comment();
        comment1.setContent("Que foto incrível! Onde foi tirada?");
        comment1.setUser(ana);
        comment1.setPost(post1);
        commentRepository.save(comment1);
        
        Comment comment2 = new Comment();
        comment2.setContent("Parabéns pelo projeto! Ficou sensacional!");
        comment2.setUser(maria);
        comment2.setPost(post2);
        commentRepository.save(comment2);
        
        Comment comment3 = new Comment();
        comment3.setContent("Suas fotos sempre me inspiram!");
        comment3.setUser(joao);
        comment3.setPost(post3);
        commentRepository.save(comment3);
        
        // Criar curtidas de exemplo
        Like like1 = new Like(maria, post1);
        likeRepository.save(like1);
        
        Like like2 = new Like(ana, post1);
        likeRepository.save(like2);
        
        Like like3 = new Like(maria, post2);
        likeRepository.save(like3);
        
        Like like4 = new Like(joao, post2);
        likeRepository.save(like4);
        
        Like like5 = new Like(ana, post2);
        likeRepository.save(like5);
        
        Like like6 = new Like(joao, post3);
        likeRepository.save(like6);
        
        Like like7 = new Like(ana, post3);
        likeRepository.save(like7);
        
        System.out.println("✅ Dados de exemplo criados com sucesso!");
        System.out.println("👤 Usuários: maria@example.com, joao@example.com, ana@example.com");
        System.out.println("🔑 Senha para todos: 123456");
    }
}