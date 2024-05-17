package com.jvpars.repository;

import com.jvpars.domain.Bulletin;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BulletinRepository extends CrudRepository<Bulletin, Long>, BulletinRepositoryCustom {
    List<Bulletin> findTop10ByOrderByIdDesc();
}
