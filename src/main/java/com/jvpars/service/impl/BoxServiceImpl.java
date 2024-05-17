package com.jvpars.service.impl;

import com.jvpars.domain.Menu;
import com.jvpars.repository.BoxRepository;
import com.jvpars.service.api.BoxService;

import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.Box;

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
public class BoxServiceImpl implements BoxService {


    @Autowired
    public BoxRepository repository;

    @Transactional(readOnly = false)
    public Box save(Box entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<Box> findAll() {
        return repository.findAll();
    }

    public Box findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<Box> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

    @Override
    public List<Box> findByMenu(Menu menu) {
        return repository.findByMenu(menu);
    }




}
