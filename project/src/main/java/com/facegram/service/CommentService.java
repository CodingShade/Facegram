package com.facegram.service;

import com.facegram.dto.CommentDTO;
import com.facegram.dto.UserDTO;
import com.facegram.model.Comment;
import com.facegram.model.Post;
import com.facegram.model.User;
import com.facegram.repository.CommentRepository;
import com.facegram.repository.PostRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ModelMapper modelMapper;
    
    public CommentDTO createComment(String content, Long postId, Long userId) {
        User user = userService.findUserEntityById(userId);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setUser(user);
        comment.setPost(post);
        
        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }
    
    public Optional<CommentDTO> getCommentById(Long id) {
        return commentRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<CommentDTO> getCommentsByUserId(Long userId) {
        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CommentDTO updateComment(Long id, String content, Long userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Você não tem permissão para editar este comentário");
        }
        
        comment.setContent(content);
        Comment updatedComment = commentRepository.save(comment);
        return convertToDTO(updatedComment);
    }
    
    public void deleteComment(Long id, Long userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Você não tem permissão para deletar este comentário");
        }
        
        commentRepository.deleteById(id);
    }
    
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO commentDTO = modelMapper.map(comment, CommentDTO.class);
        
        // Converter user para UserDTO
        UserDTO userDTO = modelMapper.map(comment.getUser(), UserDTO.class);
        commentDTO.setUser(userDTO);
        commentDTO.setPostId(comment.getPost().getId());
        
        return commentDTO;
    }
}