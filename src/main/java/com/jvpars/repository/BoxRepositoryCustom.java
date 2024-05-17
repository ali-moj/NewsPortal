package com.jvpars.repository;

import com.jvpars.domain.Box;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface BoxRepositoryCustom {

    Page<Box> findAll(GlobalSearch globalSearch, Pageable pageable);


}