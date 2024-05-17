package com.jvpars.security;

import com.jvpars.domain.SysUser;
import com.jvpars.domain.SysUsersLog;
import com.jvpars.selection.LogType;
import com.jvpars.service.api.SysUserService;
import com.jvpars.service.api.LogService;
import com.jvpars.web.errors.JvparsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Created by ali on 8/24/16.
 */
@Component
public  class LoggedIn {

    @Autowired
    SysUserService userService;

    @Autowired
    LogService logService;

     public SysUser getUser(){
         SysUser sys = userService.findByEmail(getEmail());
         if(sys ==null){
             if(!getEmail().equals("support@jvpars.com")) {
                 throw new JvparsException("user not found for email ! " + getEmail());
             }
             else{
                 return null;
             }
         }
         else return sys;

    }

    public void saveLog(LogType type, String message) {
        Long epoch = System.currentTimeMillis();
        SysUsersLog userLog = new SysUsersLog();
        userLog.setSysUser(userService.findByEmail(getEmail()));
        userLog.setLogType(type);
        userLog.setLogDate(epoch);
        userLog.setMessage(message);
        logService.save(userLog);
    }

    public  String getEmail(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth!=null) {
            return auth.getName();
        }//get logged in username
        else return "notExist";
    }

    public String getRole(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().toString();
    }
}
