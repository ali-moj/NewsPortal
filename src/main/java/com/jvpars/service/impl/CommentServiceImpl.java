package com.jvpars.service.impl;

import com.jvpars.domain.Content;
import com.jvpars.repository.CommentRepository;
import com.jvpars.security.LoggedIn;
import com.jvpars.service.api.CommentService;

import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.Comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * Created by ali on 2/8/17.
 */

@Service
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {


    @Autowired
    public CommentRepository repository;

    @Transactional(readOnly = false)
    public Comment save(Comment entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<Comment> findAll() {
        return repository.findAll();
    }

    public Comment findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<Comment> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

    @Override
    public List<Comment> findAllByContentAndConfirmedIsTrue(Content content) {
        return repository.findAllByContentAndConfirmedIsTrue(content);
    }

    @Override
    public List<Comment> findTop5ByConfirmedIsFalseOrderByIdDesc() {
        return repository.findTop5ByConfirmedIsFalseOrderByIdDesc();
    }

/*
public Long countBySysUserId(Long id) {
   return repository.countBySysUserId(id);
}

public Page<Comment> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable) {
   return repository.findAllBySysUser(sysUserField, globalSearch, pageable);
}
*/

}
