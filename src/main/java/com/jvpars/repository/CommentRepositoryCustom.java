package com.jvpars.repository;

import com.jvpars.domain.Comment;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface CommentRepositoryCustom {

    public abstract Page<Comment> findAll(GlobalSearch globalSearch, Pageable pageable);

    /*
    Sample Finder
    public abstract Page<Comment> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);
    */
}