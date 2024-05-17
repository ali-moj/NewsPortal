package com.jvpars.service.api;

import com.jvpars.domain.Box;
import com.jvpars.domain.Menu;
import com.jvpars.utils.GlobalSearch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * Created by ali on 2/8/17.
 */


public interface BoxService {

    @Transactional(readOnly = false)
    Box save(Box entity);

    @Transactional(readOnly = false)
    void delete(Long id);

    Iterable<Box> findAll();

    Box findOne(Long id);

    long count();

    Page<Box> findAll(GlobalSearch globalSearch, Pageable pageable);


    List<Box> findByMenu(Menu menu);
}
