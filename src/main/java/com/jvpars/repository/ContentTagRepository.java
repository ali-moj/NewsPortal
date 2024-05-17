package com.jvpars.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import com.jvpars.domain.ContentTag;

/**
 * Created by ali on 2/8/17.
 */

@Repository
public interface ContentTagRepository extends CrudRepository<ContentTag, Long>, ContentTagRepositoryCustom {

}
