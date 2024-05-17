package com.jvpars.service.impl;

import com.jvpars.repository.SysUsersLogRepository;
import com.jvpars.selection.LogType;
import com.jvpars.service.api.LogService;

import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.SysUsersLog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * Created by ali on 2/8/17.
 */

@Service
@Transactional(readOnly = true)
public class LogServiceImpl implements LogService {


    @Autowired
    public SysUsersLogRepository repository;

    @Transactional(readOnly = false)
    public SysUsersLog save(SysUsersLog entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<SysUsersLog> findAll() {
        return repository.findAll();
    }

    public SysUsersLog findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<SysUsersLog> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

    @Override
    public List<SysUsersLog> Top5LogByType(LogType type) {
        return repository.findTop5ByLogTypeOrderByIdDesc(type);
    }

/*
public Long countBySysUserId(Long id) {
   return repository.countBySysUserId(id);
}

public Page<SysUsersLog> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable) {
   return repository.findAllBySysUser(sysUserField, globalSearch, pageable);
}
*/

}
