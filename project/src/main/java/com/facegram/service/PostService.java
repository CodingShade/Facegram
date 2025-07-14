package com.facegram.service;

import com.facegram.dto.PostDTO;
import com.facegram.dto.UserDTO;
import com.facegram.model.Post;
import com.facegram.model.User;
import com.facegram.repository.LikeRepository;
import com.facegram.repository.PostRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ModelMapper modelMapper;
    
    public PostDTO createPost(String content, String imageUrl, Long userId) {
        User user = userService.findUserEntityById(userId);
        
        Post post = new Post();
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setUser(user);
        
        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost, userId);
    }
    
    public Optional<PostDTO> getPostById(Long id, Long currentUserId) {
        return postRepository.findById(id)
                .map(post -> convertToDTO(post, currentUserId));
    }
    
    public Page<PostDTO> getAllPosts(int page, int size, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findAllOrderByCreatedAtDesc(pageable)
                .map(post -> convertToDTO(post, currentUserId));
    }
    
    public Page<PostDTO> getPostsByUserId(Long userId, int page, int size, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(post -> convertToDTO(post, currentUserId));
    }
    
    public PostDTO updatePost(Long id, String content, String imageUrl, Long userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Você não tem permissão para editar este post");
        }
        
        post.setContent(content);
        post.setImageUrl(imageUrl);
        
        Post updatedPost = postRepository.save(post);
        return convertToDTO(updatedPost, userId);
    }
    
    public void deletePost(Long id, Long userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Você não tem permissão para deletar este post");
        }
        
        postRepository.deleteById(id);
    }
    
    private PostDTO convertToDTO(Post post, Long currentUserId) {
        PostDTO postDTO = modelMapper.map(post, PostDTO.class);
        
        // Converter user para UserDTO
        UserDTO userDTO = modelMapper.map(post.getUser(), UserDTO.class);
        postDTO.setUser(userDTO);
        
        // Contar curtidas e comentários
        postDTO.setLikesCount(postRepository.countLikesByPostId(post.getId()));
        postDTO.setCommentsCount(postRepository.countCommentsByPostId(post.getId()));
        
        // Verificar se o usuário atual curtiu o post
        if (currentUserId != null) {
            postDTO.setLikedByCurrentUser(
                likeRepository.existsByUserIdAndPostId(currentUserId, post.getId())
            );
        }
        
        return postDTO;
    }
}