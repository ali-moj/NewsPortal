package com.jvpars.web.front;


import com.jvpars.domain.Menu;
import com.jvpars.dto.MenuDto;
import com.jvpars.service.api.DocFolderService;
import com.jvpars.service.api.MenuService;
import com.jvpars.utils.MyArgUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;



@Controller
public class PageMenuController {

    private final Logger log = LoggerFactory.getLogger(PageMenuController.class);


    @Autowired
    MenuService menuService;
    @Autowired
    DocFolderService docFolderService;

    @RequestMapping(value = "/front/menus", produces = MediaType.TEXT_HTML_VALUE)
    ResponseEntity getMenus() {
        try {
            List<Menu> parents = menuService.findAllByParentIsNull();
            List<MenuDto> list=menuMapper(parents);
            return new ResponseEntity(list, HttpStatus.OK);
        } catch (Exception ex) {
            log.error("error " + ex.getMessage());
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }



    }

    private List<MenuDto> menuMapper(List<Menu> menus){

        List<MenuDto> list = new ArrayList<>();
        for(Menu menu:menus) {
            MenuDto dto = new MenuDto(menu.getId(),menu.getTitle(),menu.getArrangment(),menuMapper(menu.getChildren()));
         //   MyArgUtils.print(dto.toString());
            list.add(dto);
        }

        return list ;
    }



}
