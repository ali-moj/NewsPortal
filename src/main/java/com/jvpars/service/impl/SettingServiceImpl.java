package com.jvpars.service.impl;

import com.jvpars.domain.Setting;
import com.jvpars.repository.SettingRepository;
import com.jvpars.service.api.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class SettingServiceImpl implements SettingService {


    public SettingRepository repository;

    @Autowired
    public SettingServiceImpl(SettingRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = false)
    public Setting save(Setting entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<Setting> findAll() {
        return repository.findAll();
    }

    public Setting findOne(Long id) {
        return repository.getOne(id);
    }

    public long count() {
        return repository.count();
    }

    @Override
    public List<Setting> findTop1ByOrderByIdAsc() {
        return repository.findTop1ByOrderByIdAsc();
    }

    @Override
    public Setting getSetting() {
        return repository.findFirstByOrderByIdAsc();
    }


}

