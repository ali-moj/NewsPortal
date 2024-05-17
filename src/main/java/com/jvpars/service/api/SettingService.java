package com.jvpars.service.api;

import com.jvpars.domain.Setting;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SettingService {

    @Transactional(readOnly = false)
    Setting save(Setting entity);

    @Transactional(readOnly = false)
    void delete(Long id);

    Iterable<Setting> findAll();

    Setting findOne(Long id);

    long count();
    List<Setting> findTop1ByOrderByIdAsc();

    Setting getSetting();
}
