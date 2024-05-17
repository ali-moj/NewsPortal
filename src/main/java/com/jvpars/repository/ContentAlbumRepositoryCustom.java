package com.jvpars.repository;

import com.jvpars.domain.ContentAlbum;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ContentAlbumRepositoryCustom {

    public abstract Page<ContentAlbum> findAll(GlobalSearch globalSearch, Pageable pageable);

    /*
    Sample Finder
    public abstract Page<ContentAlbum> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);
    */
}