package com.jvpars.security;

/**
 * Created by ali .
 */


import com.jvpars.domain.SysUser;
import com.jvpars.service.api.SysUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    SysUserService sysUserService;

    @Transactional(readOnly=true)
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        SysUser user = sysUserService.findByEmail(email);

        if(email.equals("admin@admin.com"))
            return new org.springframework.security.core.userdetails.User("admin@admin.com", "change here using bcrypt online password encoders",
                    true, true, true, true, getGrantedAuthoritiesForRoleAdmin("ROLE_SUPER_ADMIN"));


        if(user==null){
            throw new UsernameNotFoundException("Username not found");
        }



        if(user.getRole().equals("ROLE_WRITER")){
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                    true, true, true, true, getGrantedAuthoritiesForRoleUser(user.getRole()));
        }

        if(user.getRole().equals("ROLE_ADMIN")){
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                    true, true, true, true, getGrantedAuthoritiesForRoleAdmin(user.getRole()));
        }


        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                true, true, true, true, getGrantedAuthoritiesForRolCostumer(user.getRole()));
    }


    private  Set<GrantedAuthority>  getGrantedAuthoritiesForRolCostumer(String role){
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return authorities;
    }

    private  Set<GrantedAuthority>  getGrantedAuthoritiesForRoleUser(String role){
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return authorities;
    }

    private  Set<GrantedAuthority>  getGrantedAuthoritiesForRoleAdmin(String role){
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return authorities;
    }

    private  Set<GrantedAuthority>  getGrantedAuthoritiesForRoleSuperAdmin(String role){
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return authorities;
    }

}