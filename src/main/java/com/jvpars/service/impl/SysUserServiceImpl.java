package com.jvpars.service.impl;

import com.jvpars.repository.SysUserRepository;
import com.jvpars.service.api.SysUserService;

import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.SysUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by ali on 2/8/17.
 */

@Service
@Transactional(readOnly = true)
public class SysUserServiceImpl implements SysUserService {

    public SysUserRepository repository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @Autowired
    public SysUserServiceImpl(SysUserRepository repository,BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.repository = repository;
        this.bCryptPasswordEncoder=bCryptPasswordEncoder;

    }

    @Transactional(readOnly = false)
    public SysUser save(SysUser entity) {
        entity.setPassword(bCryptPasswordEncoder.encode(entity.getPassword()));
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<SysUser> findAll() {
        return repository.findAll();
    }

    public  SysUser findOne(Long id) {
        return repository.getOne(id);
    }

    public long count() {
        return repository.count();
    }


    public Page<SysUser> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

    public  SysUser findByEmail(String email) {
        return repository.findByEmail(email);
    }



}
