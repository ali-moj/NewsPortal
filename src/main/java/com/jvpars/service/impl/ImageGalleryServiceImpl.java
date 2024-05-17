package com.jvpars.service.impl;

import com.jvpars.repository.ImageGalleryRepository;
import com.jvpars.service.api.ImageGalleryService;

import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.ImageGallery;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by ali on 2/8/17.
 */

@Service
@Transactional(readOnly = true)
public class ImageGalleryServiceImpl implements ImageGalleryService {


    @Autowired
    public ImageGalleryRepository repository;

    @Transactional(readOnly = false)
    public ImageGallery save(ImageGallery entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<ImageGallery> findAll() {
        return repository.findAll();
    }

    public ImageGallery findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<ImageGallery> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

    @Override
    public List<ImageGallery> findTop7ByOrderByIdDesc() {
        return repository.findTop7ByOrderByIdDesc();
    }

    @Override
    public Page<ImageGallery> findByPage(Pageable pageable) {
        return repository.findAll(pageable);
    }

/*
public Long countBySysUserId(Long id) {
   return repository.countBySysUserId(id);
}

public Page<ImageGallery> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable) {
   return repository.findAllBySysUser(sysUserField, globalSearch, pageable);
}
*/

}
