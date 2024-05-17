package com.jvpars.repository;

import com.jvpars.selection.LogType;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import com.jvpars.domain.SysUsersLog;

import java.util.List;

/**
 * Created by ali on 2/8/17.
 */

@Repository
public interface SysUsersLogRepository extends CrudRepository<SysUsersLog, Long>, SysUsersLogRepositoryCustom {

    List<SysUsersLog> findTop5ByLogTypeOrderByIdDesc(LogType type);
}
