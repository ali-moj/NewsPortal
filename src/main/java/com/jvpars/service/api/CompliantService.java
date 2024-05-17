package com.jvpars.service.api;

import com.jvpars.domain.Compliant;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface CompliantService {

    @Transactional(readOnly = false)
    public abstract Compliant save(Compliant entity);

    @Transactional(readOnly = false)
    public abstract void delete(Long id);

    public abstract Iterable<Compliant> findAll();

    public abstract Compliant findOne(Long id);

    public abstract long count();

    public abstract Page<Compliant> findAll(GlobalSearch globalSearch, Pageable pageable);


}
