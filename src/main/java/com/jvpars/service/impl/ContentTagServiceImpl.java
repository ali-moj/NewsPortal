package com.jvpars.service.impl;

import com.jvpars.repository.ContentTagRepository;
import com.jvpars.service.api.ContentTagService;

import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.ContentTag;

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
public class ContentTagServiceImpl implements ContentTagService {


    @Autowired
    public ContentTagRepository repository;

    @Transactional(readOnly = false)
    public ContentTag save(ContentTag entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<ContentTag> findAll() {
        return repository.findAll();
    }

    public ContentTag findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<ContentTag> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

/*
public Long countBySysUserId(Long id) {
   return repository.countBySysUserId(id);
}

public Page<ContentTag> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable) {
   return repository.findAllBySysUser(sysUserField, globalSearch, pageable);
}
*/

}
