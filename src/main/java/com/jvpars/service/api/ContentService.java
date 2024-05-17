package com.jvpars.service.api;

import com.jvpars.domain.Box;
import com.jvpars.domain.Content;
import com.jvpars.domain.Menu;
import com.jvpars.domain.SysUser;
import com.jvpars.utils.GlobalSearch;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by ali on 2/8/17.
 */


public interface ContentService {

    @Transactional(readOnly = false)
    Content save(Content entity);

    @Transactional(readOnly = false)
    Content update(Content entity);


    @Transactional(readOnly = false)
    Content publish(Content entity);

    @Transactional(readOnly = false)
    void delete(Long id);

    Iterable<Content> findAll();

    Content findOne(Long id);

    long count();

    Page<Content> findAll(GlobalSearch globalSearch, Pageable pageable);
    Page<Content> findAllByUser(GlobalSearch globalSearch, Pageable pageable , SysUser user);
    Page<Content> findAllUnpublished(GlobalSearch globalSearch, Pageable pageable);

    List<Content> findTop1ByBoxOrderByIdDesc(Box box);

    List<Content> findTop10ByBoxOrderByIdDesc(Box box);

    List<Content> findTop3ByBoxOrderByIdDesc(Box box);

    List<Content> CustomQueryByMenu(Menu menu);

    List<Content> findALLByBox(Box box);

    Page<Content> findByMeta(String tag , Pageable pageable);

    List<Content> getAllByUserRole(SysUser user);


    Page<Content>  findAllByBox(Pageable pageable, Box box);

    List<Content> Top5UnPublished();

    Content findByTime(Long time);

    List<Content> findAllByPublishedIsTrue();

    Page<Content> findAllBySysUser(SysUser user  , Pageable pageable);

    List<Content> findTop10ByPublishedIsTrueOrderByIdDesc();
}
