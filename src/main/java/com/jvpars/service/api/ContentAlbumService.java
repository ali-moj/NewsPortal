package com.jvpars.service.api;

import com.jvpars.domain.ContentAlbum;
import com.jvpars.utils.GlobalSearch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by ali on 2/8/17.
 */


public interface ContentAlbumService {

    @Transactional(readOnly = false)
    public abstract ContentAlbum save(ContentAlbum entity);

    @Transactional(readOnly = false)
    public abstract void delete(Long id);

    public abstract Iterable<ContentAlbum> findAll();

    public abstract ContentAlbum findOne(Long id);

    public abstract long count();

    public abstract Page<ContentAlbum> findAll(GlobalSearch globalSearch, Pageable pageable);

/*
 custom nested Query With pagination

   public abstract Page<Certificate> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);

    public abstract Long countBySysUserId(Long id);*/

}
