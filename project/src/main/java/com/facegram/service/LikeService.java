package com.facegram.service;

import com.facegram.model.Like;
import com.facegram.model.Post;
import com.facegram.model.User;
import com.facegram.repository.LikeRepository;
import com.facegram.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LikeService {
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    public boolean toggleLike(Long postId, Long userId) {
        User user = userService.findUserEntityById(userId);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        
        if (likeRepository.existsByUserIdAndPostId(userId, postId)) {
            // Se já curtiu, remove a curtida
            likeRepository.deleteByUserIdAndPostId(userId, postId);
            return false; // Descurtiu
        } else {
            // Se não curtiu, adiciona a curtida
            Like like = new Like(user, post);
            likeRepository.save(like);
            return true; // Curtiu
        }
    }
    
    public boolean isPostLikedByUser(Long postId, Long userId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }
}