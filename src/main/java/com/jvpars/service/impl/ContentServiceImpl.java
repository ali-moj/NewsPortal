package com.jvpars.service.impl;

import com.jvpars.domain.Box;
import com.jvpars.domain.Menu;
import com.jvpars.domain.SysUser;
import com.jvpars.repository.ContentRepository;
import com.jvpars.security.LoggedIn;
import com.jvpars.selection.LogType;
import com.jvpars.service.api.ContentService;

import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.Content;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * Created by ali on 2/8/17.
 */

@Service
@Transactional(readOnly = true)
public class ContentServiceImpl implements ContentService {


    @Autowired
    public ContentRepository repository;

    @Autowired
    LoggedIn loggedIn;

    @Transactional(readOnly = false)
    public Content save(Content entity) {
        loggedIn.saveLog(LogType.CREATE_CONTENT, "");
        return repository.save(entity);
    }

    @Override
    public Content update(Content entity) {
        loggedIn.saveLog(LogType.UPDATE_CONTENT, "");
        return repository.save(entity);
    }

    @Override
    public Content publish(Content entity) {
        loggedIn.saveLog(LogType.PUBLISH_CONTENT, "");
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        loggedIn.saveLog(LogType.CREATE_CONTENT, "");
        repository.deleteById(id);
    }

    public Iterable<Content> findAll() {
        return repository.findAll();
    }

    public Content findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<Content> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

    @Override
    public Page<Content> findAllByUser(GlobalSearch globalSearch, Pageable pageable, SysUser user) {
        return repository.findAllByUser(globalSearch , pageable , user);
    }

    @Override
    public Page<Content> findAllUnpublished(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAllUnpublished(globalSearch, pageable);
    }


    @Override
    public List<Content> findTop1ByBoxOrderByIdDesc(Box box) {
        return repository.findTop1ByBoxAndPublishedOrderByIdDesc(box , true);
    }

    @Override
    public List<Content> findTop10ByBoxOrderByIdDesc(Box box) {
        return repository.findTop10ByBoxAndPublishedOrderByIdDesc(box, true);
    }

    @Override
    public List<Content> findTop3ByBoxOrderByIdDesc(Box box) {
        return repository.findTop3ByBoxAndPublishedOrderByIdDesc(box, true);
    }

    @Override
    public List<Content> CustomQueryByMenu(Menu menu ) {
        //PageRequest x = new PageRequest(0, 3);
        return repository.CustomQueryByMenu(menu ,PageRequest.of(0 ,3) );
    }

    @Override
    public List<Content> findALLByBox(Box box) {
        return repository.findALLByBoxAndPublished(box, true);
    }

    @Override
    public Page<Content> findByMeta(String tag , Pageable pageable ) {
        return repository.findAllByMetaContainsAndPublished(tag, true ,  pageable);
    }

    @Override
    public List<Content> getAllByUserRole(SysUser user) {
        return repository.getAllBySysUser(user);
    }

    @Override
    public Page<Content> findAllByBox(Pageable pageable, Box box) {
        return repository.findAllByBoxAndPublished(pageable,box, true) ;
    }

    @Override
    public List<Content> Top5UnPublished() {
        return repository.findTop5ByPublishedOrderByIdDesc(false);
    }

    @Override
    public Content findByTime(Long time) {
        return repository.findFirstByCreatedDateL(time);
    }

    @Override
    public List<Content> findAllByPublishedIsTrue() {
        return repository.findAllByPublishedIsTrue();
    }

    @Override
    public Page<Content> findAllBySysUser(SysUser user , Pageable pageable ) {
        return repository.findAllBySysUser(user , pageable);
    }

    @Override
    public List<Content> findTop10ByPublishedIsTrueOrderByIdDesc() {
        return  repository.findTop10ByPublishedIsTrueOrderByIdDesc();
    }


}
