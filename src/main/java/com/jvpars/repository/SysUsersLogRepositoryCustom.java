package com.jvpars.repository;

import com.jvpars.domain.SysUsersLog;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface SysUsersLogRepositoryCustom {

    public abstract Page<SysUsersLog> findAll(GlobalSearch globalSearch, Pageable pageable);

    /*
    Sample Finder
    public abstract Page<SysUsersLog> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);
    */
}