package com.jvpars.repository;

import com.jvpars.domain.ImageGallery;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ImageGalleryRepositoryCustom {

    public abstract Page<ImageGallery> findAll(GlobalSearch globalSearch, Pageable pageable);

    /*
    Sample Finder
    public abstract Page<ImageGallery> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);
    */
}