package com.jvpars.repository;

import com.jvpars.domain.Content;
import com.jvpars.domain.SysUser;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ContentRepositoryCustom {

    Page<Content> findAll(GlobalSearch globalSearch, Pageable pageable);
    Page<Content> findAllByUser(GlobalSearch globalSearch, Pageable pageable, SysUser user);
    Page<Content> findAllUnpublished(GlobalSearch globalSearch, Pageable pageable);
    /*
    Sample Finder
    public abstract Page<Content> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);
    */
}