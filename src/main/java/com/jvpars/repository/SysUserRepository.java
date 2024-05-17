package com.jvpars.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jvpars.domain.SysUser;

/**
 * Created by ali on 2/8/17.
 */


public interface SysUserRepository extends JpaRepository<SysUser, Long>, SysUserRepositoryCustom {

    SysUser findByEmail(String email);

}
