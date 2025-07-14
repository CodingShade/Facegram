package com.facegram.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CommentDTO {
    
    private Long id;
    
    @NotBlank(message = "Conteúdo do comentário é obrigatório")
    @Size(max = 500, message = "Comentário deve ter no máximo 500 caracteres")
    private String content;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDTO user;
    private Long postId;
    
    // Construtores
    public CommentDTO() {}
    
    public CommentDTO(Long id, String content, UserDTO user) {
        this.id = id;
        this.content = content;
        this.user = user;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
    
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
}