package com.jvpars.service.api;

import com.jvpars.domain.SysUsersLog;
import com.jvpars.selection.LogType;
import com.jvpars.utils.GlobalSearch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * Created by ali on 2/8/17.
 */


public interface LogService {

    @Transactional(readOnly = false)
    SysUsersLog save(SysUsersLog entity);

    @Transactional(readOnly = false)
    void delete(Long id);

    Iterable<SysUsersLog> findAll();

    SysUsersLog findOne(Long id);

    long count();

    Page<SysUsersLog> findAll(GlobalSearch globalSearch, Pageable pageable);

    List<SysUsersLog> Top5LogByType(LogType type);

}
