package com.facegram.controller;

import com.facegram.security.UserPrincipal;
import com.facegram.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "*")
public class LikeController {
    
    @Autowired
    private LikeService likeService;
    
    @PostMapping("/toggle/{postId}")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        boolean isLiked = likeService.toggleLike(postId, userPrincipal.getId());
        
        return ResponseEntity.ok(Map.of(
            "isLiked", isLiked,
            "message", isLiked ? "Post curtido" : "Curtida removida"
        ));
    }
    
    @GetMapping("/check/{postId}")
    public ResponseEntity<Map<String, Boolean>> checkLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        boolean isLiked = likeService.isPostLikedByUser(postId, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("isLiked", isLiked));
    }
}