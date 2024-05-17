package com.jvpars.repository;

import com.jvpars.domain.Menu;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MenuRepositoryCustom {
    public abstract Page<Menu> findAll(GlobalSearch globalSearch, Pageable pageable);
}
