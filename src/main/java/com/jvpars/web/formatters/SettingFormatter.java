package com.jvpars.web.formatters;

import com.jvpars.domain.Setting;
import com.jvpars.service.api.SettingService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.util.Locale;


public class SettingFormatter implements Formatter<Setting> {

    @Autowired
    public SettingService settingService;


    public Setting parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return settingService.findOne(id);
    }

    public String print(Setting setting, Locale locale) {
        return setting.toString();

    }
}