package com.jvpars.repository;

import com.jvpars.domain.Setting;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface SettingRepositoryCustom {

    public abstract Page<Setting> findAll(GlobalSearch globalSearch, Pageable pageable);

    /*
    Sample Finder
    public abstract Page<Setting> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable);
    */
}