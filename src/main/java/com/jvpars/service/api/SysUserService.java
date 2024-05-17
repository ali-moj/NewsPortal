package com.jvpars.service.api;

import com.jvpars.domain.SysUser;
import com.jvpars.utils.GlobalSearch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by ali on 2/8/17.
 */


public interface SysUserService {

    @Transactional(readOnly = false)
    public abstract SysUser save(SysUser entity);

    @Transactional(readOnly = false)
    public abstract void delete(Long id);

    public abstract Iterable<SysUser> findAll();

    public abstract  SysUser  findOne(Long id);

    public abstract long count();

    public abstract Page<SysUser> findAll(GlobalSearch globalSearch, Pageable pageable);

    public abstract SysUser  findByEmail(String email);



}
