package com.jvpars.service.api;

import com.jvpars.domain.DocFolder;
import com.jvpars.utils.GlobalSearch;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by ali on 2/8/17.
 */


public interface DocFolderService {

    @Transactional(readOnly = false)
    public abstract DocFolder save(DocFolder entity);

    @Transactional(readOnly = false)
    public abstract void delete(Long id);

    public abstract Iterable<DocFolder> findAll();

    public abstract DocFolder findOne(Long id);

    public abstract long count();
    public abstract List<DocFolder> findAllByParentFolderIsNull();

    public abstract Page<DocFolder> findAll(GlobalSearch globalSearch, Pageable pageable);

    public abstract DocFolder createImageGalleryDirectoryIfNotExist();

/*
 custom nested Query With pagination

   public abstract Page<Certificate> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);

    public abstract Long countBySysUserId(Long id);*/

}
