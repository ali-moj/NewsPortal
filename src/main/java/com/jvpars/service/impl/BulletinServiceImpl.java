package com.jvpars.service.impl;

import com.jvpars.domain.Bulletin;
import com.jvpars.repository.BulletinRepository;
import com.jvpars.service.api.BulletinService;
import com.jvpars.utils.GlobalSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BulletinServiceImpl implements BulletinService {

    @Autowired
    BulletinRepository repository;

    @Override
    public Bulletin save(Bulletin entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Iterable<Bulletin> findAll() {
        return repository.findAll();
    }

    @Override
    public Bulletin findOne(Long id) {
        return  repository.findById(id).get();
    }

    @Override
    public long count() {
        return repository.count();
    }

    @Override
    public Page<Bulletin> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch , pageable);
    }

    @Override
    public List<Bulletin> findTop10ByOrderByIdDesc() {
        return repository.findTop10ByOrderByIdDesc();
    }
}
