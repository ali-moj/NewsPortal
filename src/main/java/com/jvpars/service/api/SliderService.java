package com.jvpars.service.api;

import com.jvpars.domain.Slider;
import org.springframework.transaction.annotation.Transactional;

public interface SliderService {
    @Transactional(readOnly = false)
    public abstract Slider save(Slider entity);

    @Transactional(readOnly = false)
    public abstract void delete(Long id);

    public abstract Iterable<Slider> findAll();

    public abstract Slider findOne(Long id);

    public abstract long count();
}
