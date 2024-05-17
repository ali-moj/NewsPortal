package com.jvpars.repository;

import com.jvpars.domain.Box;
import com.jvpars.domain.Menu;
import com.jvpars.domain.SysUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import com.jvpars.domain.Content;

import java.util.List;

/**
 * Created by ali on 2/8/17.
 */

@Repository
public interface ContentRepository extends JpaRepository<Content, Long>, ContentRepositoryCustom {

    List<Content> findTop1ByBoxAndPublishedOrderByIdDesc(Box box, boolean published);

    List<Content> findTop10ByBoxAndPublishedOrderByIdDesc(Box box, boolean published);

    List<Content> findTop3ByBoxAndPublishedOrderByIdDesc(Box box, boolean published);

    Content findFirstByCreatedDateL(Long date);

    @Query("Select c from  Content c  left join Menu m on m.id = c.box.menu.id where c.published = true  order by c.id desc")
    List<Content> CustomQueryByMenu(Menu menu, Pageable pageable);

    List<Content> findAllByPublishedIsTrue();

    List<Content> findALLByBoxAndPublished(Box box, boolean published);

    Page<Content> findAllByMetaContainsAndPublished(String meta, boolean published , Pageable pageable);

    List<Content> getAllBySysUser(SysUser user);

    Page<Content> findAllByBoxAndPublished(Pageable pageable, Box box, boolean published);

    List<Content> findTop5ByPublishedOrderByIdDesc(Boolean published);

    @Query(value = "SELECT count(c.id) , m.id , m.title FROM  content c inner join box b on  c.box_id = b.id inner join menu m on  b.menu_id = m.id group by m.id , m.title having count(c.id) > 1", nativeQuery = true)
    List<?> findContentCountByMenu();

    @Query(value = "select  count(id) as dayCount , created_date   from content group by created_date LIMIT 7;", nativeQuery = true)
    List<?> findContentAddInLastSevenDay();

    @Query(value = "select  view_count , title from content  where view_count > 0 order by id desc LIMIT 30 ;", nativeQuery = true)
    List<?> newsVisit();

    @Query(value = "select count(m.id)  , c.title  from comment m inner join content c on c.id = m .content_id group by c.title", nativeQuery = true)
    List<?> newsComments();

    @Query(value = "select Count(id) , c.created_date from comment c group by c.created_date order by c.created_date desc limit 7", nativeQuery = true)
    List<?> lastDaysComments();

    @Query(value = "select count(c.id)  , c.created_date from content c group by c.created_date order by c.created_date desc limit 7", nativeQuery = true)
    List<?> newsInDays();


    Page<Content> findAllBySysUser(SysUser user , Pageable pageable);

    List<Content> findTop10ByPublishedIsTrueOrderByIdDesc();
}
