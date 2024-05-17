package com.jvpars.service.impl;

import com.jvpars.domain.Menu;
import com.jvpars.repository.MenuRepository;
import com.jvpars.service.api.MenuService;
import com.jvpars.utils.GlobalSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MenuServiceImpl implements MenuService {
    private MenuRepository menuRepository;

    @Autowired
    public MenuServiceImpl(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @Transactional(readOnly = false)
    public Menu save(Menu entity) {
        return menuRepository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        menuRepository.deleteById(id);
    }

    public Iterable<Menu> findAll() {
        return menuRepository.findAll();
    }

    public Menu findOne(long id) {
        return menuRepository.findById(id).get();
    }

    public long count() {
        return menuRepository.count();
    }


    public Page<Menu> findAll(GlobalSearch search, Pageable pageable) {
        return menuRepository.findAll(search , pageable);
    }

    public List<Menu> findAllByParentIsNull() {
        return menuRepository.findAllByParentIsNullOrderByArrangmentAsc();
    }

    @Override
    public List<Menu> findAllByMainPageIsTrue() {
        return  menuRepository.findAllByMainPageIsTrue();
    }

}
