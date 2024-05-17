package com.jvpars.service.impl;

import com.jvpars.domain.Slider;
import com.jvpars.repository.SliderRepository;
import com.jvpars.service.api.SliderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SliderServiceImpl implements SliderService {
    @Autowired
    SliderRepository repository;

    @Override
    public Slider save(Slider entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Iterable<Slider> findAll() {
        return repository.findAll();
    }

    @Override
    public Slider findOne(Long id) {
        return repository.findById(id).get();
    }

    @Override
    public long count() {
        return repository.count();
    }
}
