package com.jvpars.web.formatters;

import com.jvpars.domain.Menu;
import com.jvpars.service.api.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;

import java.util.Locale;


public class MenuFormatter implements Formatter<Menu> {

    @Autowired
    public MenuService menuService;


    public Menu parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return menuService.findOne(id);
    }

    public String print(Menu menu, Locale locale) {
        return menu.toString();

    }
}