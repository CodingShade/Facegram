package com.facegram.controller;

import com.facegram.dto.PostDTO;
import com.facegram.security.UserPrincipal;
import com.facegram.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @PostMapping
    public ResponseEntity<PostDTO> createPost(
            @Valid @RequestBody PostDTO postDTO,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        PostDTO createdPost = postService.createPost(
            postDTO.getContent(),
            postDTO.getImageUrl(),
            userPrincipal.getId()
        );
        return ResponseEntity.ok(createdPost);
    }
    
    @GetMapping
    public ResponseEntity<Page<PostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Page<PostDTO> posts = postService.getAllPosts(page, size, userPrincipal.getId());
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        PostDTO post = postService.getPostById(id, userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        return ResponseEntity.ok(post);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostDTO>> getPostsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Page<PostDTO> posts = postService.getPostsByUserId(userId, page, size, userPrincipal.getId());
        return ResponseEntity.ok(posts);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostDTO postDTO,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        PostDTO updatedPost = postService.updatePost(
            id,
            postDTO.getContent(),
            postDTO.getImageUrl(),
            userPrincipal.getId()
        );
        return ResponseEntity.ok(updatedPost);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        postService.deletePost(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}