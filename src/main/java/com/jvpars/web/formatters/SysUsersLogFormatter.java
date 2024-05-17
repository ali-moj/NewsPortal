package com.jvpars.web.formatters;

import com.jvpars.domain.SysUsersLog;
import com.jvpars.service.api.LogService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Locale;


public class SysUsersLogFormatter implements Formatter<SysUsersLog> {

    @Autowired
    public LogService sysuserslogService;


    public SysUsersLog parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return sysuserslogService.findOne(id);
    }

    public String print(SysUsersLog sysuserslog, Locale locale) {
        return sysuserslog.toString();

    }
}