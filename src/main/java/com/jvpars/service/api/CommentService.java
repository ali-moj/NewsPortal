package com.jvpars.service.api;

import com.jvpars.domain.Comment;
import com.jvpars.domain.Content;
import com.jvpars.utils.GlobalSearch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * Created by ali on 2/8/17.
 */


public interface CommentService {

    @Transactional(readOnly = false)
    Comment save(Comment entity);

    @Transactional(readOnly = false)
    void delete(Long id);

    Iterable<Comment> findAll();

    Comment findOne(Long id);

    long count();

    Page<Comment> findAll(GlobalSearch globalSearch, Pageable pageable);

    List<Comment> findAllByContentAndConfirmedIsTrue(Content content);

    List<Comment> findTop5ByConfirmedIsFalseOrderByIdDesc();

/*
 custom nested Query With pagination

   public abstract Page<Certificate> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);

    public abstract Long countBySysUserId(Long id);*/

}
