package com.jvpars.repository;

import com.jvpars.domain.Bulletin;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BulletinRepositoryCustom {
    Page<Bulletin> findAll(GlobalSearch globalSearch, Pageable pageable);
}
