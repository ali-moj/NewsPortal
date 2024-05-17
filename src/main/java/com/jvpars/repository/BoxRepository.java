package com.jvpars.repository;

import com.jvpars.domain.Menu;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import com.jvpars.domain.Box;

import java.util.List;

/**
 * Created by ali on 2/8/17.
 */

@Repository
public interface BoxRepository extends CrudRepository<Box, Long>, BoxRepositoryCustom {
    List<Box> findByMenu(Menu menu);

    List<Box> findAllByMenuIn(List<Menu> menus);

}
