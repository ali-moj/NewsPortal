package com.jvpars.repository;

import com.jvpars.domain.Menu;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MenuRepository extends CrudRepository<Menu , Long> , MenuRepositoryCustom {
    List<Menu> findAllByParentIsNullOrderByArrangmentAsc();
    List<Menu> findAllByMainPageIsTrue();
    List<Menu> findAllByAclIn(List<String> roles);

}
