package com.jvpars.service.impl;

import com.jvpars.domain.Compliant;
import com.jvpars.repository.CompliantRepository;
import com.jvpars.service.api.CompliantService;
import com.jvpars.utils.GlobalSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CompliantServiceImpl implements CompliantService {



    public CompliantRepository repository;

    @Autowired
    public CompliantServiceImpl(CompliantRepository repository) {
        this.repository=repository;
    }

    @Transactional(readOnly = false)
    public Compliant save(Compliant entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<Compliant> findAll() {
        return repository.findAll();
    }

    public Compliant findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<Compliant> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }



}
