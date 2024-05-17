package com.jvpars.service.api;

import com.jvpars.domain.ImageGallery;
import com.jvpars.utils.GlobalSearch;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;



/**
 * Created by ali on 2/8/17.
 */


public interface ImageGalleryService {

    @Transactional(readOnly = false)
    ImageGallery save(ImageGallery entity);

    @Transactional(readOnly = false)
    void delete(Long id);

    Iterable<ImageGallery> findAll();

    ImageGallery findOne(Long id);

    long count();

    Page<ImageGallery> findAll(GlobalSearch globalSearch, Pageable pageable);


    List<ImageGallery> findTop7ByOrderByIdDesc();

    Page<ImageGallery> findByPage(Pageable pageable);
/*
 custom nested Query With pagination

   public abstract Page<Certificate> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);

    public abstract Long countBySysUserId(Long id);*/

}
