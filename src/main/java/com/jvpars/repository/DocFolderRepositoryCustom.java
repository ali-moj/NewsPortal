package com.jvpars.repository;

import com.jvpars.domain.DocFolder;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface DocFolderRepositoryCustom {

    public abstract Page<DocFolder> findAll(GlobalSearch globalSearch, Pageable pageable);

    /*
    Sample Finder
    public abstract Page<DocFolder> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);
    */
}