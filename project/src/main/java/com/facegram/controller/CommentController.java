package com.facegram.controller;

import com.facegram.dto.CommentDTO;
import com.facegram.security.UserPrincipal;
import com.facegram.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    @PostMapping
    public ResponseEntity<CommentDTO> createComment(
            @Valid @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        CommentDTO createdComment = commentService.createComment(
            commentDTO.getContent(),
            commentDTO.getPostId(),
            userPrincipal.getId()
        );
        return ResponseEntity.ok(createdComment);
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByUserId(@PathVariable Long userId) {
        List<CommentDTO> comments = commentService.getCommentsByUserId(userId);
        return ResponseEntity.ok(comments);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        CommentDTO updatedComment = commentService.updateComment(
            id,
            commentDTO.getContent(),
            userPrincipal.getId()
        );
        return ResponseEntity.ok(updatedComment);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        commentService.deleteComment(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}