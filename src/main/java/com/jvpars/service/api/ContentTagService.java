package com.jvpars.service.api;

import com.jvpars.domain.ContentTag;
import com.jvpars.utils.GlobalSearch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by ali on 2/8/17.
 */


public interface ContentTagService {

    @Transactional(readOnly = false)
    public abstract ContentTag save(ContentTag entity);

    @Transactional(readOnly = false)
    public abstract void delete(Long id);

    public abstract Iterable<ContentTag> findAll();

    public abstract ContentTag findOne(Long id);

    public abstract long count();

    public abstract Page<ContentTag> findAll(GlobalSearch globalSearch, Pageable pageable);

/*
 custom nested Query With pagination

   public abstract Page<Certificate> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);

    public abstract Long countBySysUserId(Long id);*/

}
