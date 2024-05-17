package com.jvpars.service.api;

import com.jvpars.domain.DocFile;
import com.jvpars.domain.DocFolder;
import com.jvpars.utils.GlobalSearch;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by ali on 2/8/17.
 */


public interface DocFileService {

    @Transactional(readOnly = false)
    public abstract DocFile save(DocFile entity);

    @Transactional(readOnly = false)
    public abstract void delete(Long id);

    public abstract Iterable<DocFile> findAll();

    public abstract DocFile findOne(Long id);

    public abstract long count();

    public abstract Page<DocFile> findAll(GlobalSearch globalSearch, Pageable pageable);

    public abstract List<DocFile> findByDocFolderOrderByIdDesc(DocFolder docFolder);



/*
 custom nested Query With pagination

   public abstract Page<Certificate> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);

    public abstract Long countBySysUserId(Long id);*/

}
