package com.jvpars.service.api;


import com.jvpars.domain.Bulletin;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BulletinService {

    @Transactional(readOnly = false)
    Bulletin save(Bulletin entity);

    @Transactional(readOnly = false)
    void delete(Long id);

    Iterable<Bulletin> findAll();

    Bulletin findOne(Long id);

    long count();

    Page<Bulletin> findAll(GlobalSearch globalSearch, Pageable pageable);

    List<Bulletin> findTop10ByOrderByIdDesc();
}
