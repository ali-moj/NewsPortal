package com.jvpars.web.formatters;

import com.jvpars.domain.SysUser;
import com.jvpars.service.api.SysUserService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.util.Locale;


public class SysUserFormatter implements Formatter<SysUser> {

    @Autowired
    public SysUserService sysuserService;


    public SysUser parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return sysuserService.findOne(id);
    }

    public String print(SysUser sysuser, Locale locale) {
        return sysuser.toString();

    }
}