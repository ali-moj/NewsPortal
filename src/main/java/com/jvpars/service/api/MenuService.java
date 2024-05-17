package com.jvpars.service.api;

import com.jvpars.domain.Menu;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MenuService {

    public abstract Menu save(Menu entity);

    public abstract void delete(Long id);

    public abstract Iterable<Menu> findAll();

    public abstract Menu findOne(long id);

    public abstract long count();

    public abstract Page<Menu> findAll(GlobalSearch search, Pageable pageable);
    List<Menu> findAllByParentIsNull();

    public abstract List<Menu> findAllByMainPageIsTrue();
}
