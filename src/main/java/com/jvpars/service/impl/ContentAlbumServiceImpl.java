package com.jvpars.service.impl;

import com.jvpars.repository.ContentAlbumRepository;
import com.jvpars.service.api.ContentAlbumService;

import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.ContentAlbum;

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
public class ContentAlbumServiceImpl implements ContentAlbumService {


    @Autowired
    public ContentAlbumRepository repository;

    @Transactional(readOnly = false)
    public ContentAlbum save(ContentAlbum entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<ContentAlbum> findAll() {
        return repository.findAll();
    }

    public ContentAlbum findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<ContentAlbum> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

/*
public Long countBySysUserId(Long id) {
   return repository.countBySysUserId(id);
}

public Page<ContentAlbum> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable) {
   return repository.findAllBySysUser(sysUserField, globalSearch, pageable);
}
*/

}
