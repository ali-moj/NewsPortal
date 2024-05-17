package com.jvpars.service.impl;

import com.jvpars.domain.DocFolder;
import com.jvpars.repository.DocFileRepository;
import com.jvpars.service.api.DocFileService;

import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.DocFile;

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
public class DocFileServiceImpl implements DocFileService {


    @Autowired
    public DocFileRepository repository;

    @Transactional(readOnly = false)
    public DocFile save(DocFile entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<DocFile> findAll() {
        return repository.findAll();
    }

    public DocFile findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<DocFile> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }


    public List<DocFile> findByDocFolderOrderByIdDesc(DocFolder docFolder) {
        return repository.findByDocFolderOrderByIdDesc(docFolder);
    }

/*
public Long countBySysUserId(Long id) {
   return repository.countBySysUserId(id);
}

public Page<DocFile> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable) {
   return repository.findAllBySysUser(sysUserField, globalSearch, pageable);
}
*/

}
