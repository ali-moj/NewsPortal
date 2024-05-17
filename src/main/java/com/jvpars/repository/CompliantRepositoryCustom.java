package com.jvpars.repository;

import com.jvpars.domain.Compliant;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompliantRepositoryCustom {

    public abstract Page<Compliant> findAll(GlobalSearch globalSearch, Pageable pageable);
}
