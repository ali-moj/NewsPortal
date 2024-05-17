package com.jvpars.repository;

import com.jvpars.domain.Compliant;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompliantRepository extends CrudRepository<Compliant, Long>, CompliantRepositoryCustom {


}