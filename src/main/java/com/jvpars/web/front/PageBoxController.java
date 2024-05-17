package com.jvpars.web.front;


import com.jvpars.domain.Box;
import com.jvpars.domain.Menu;
import com.jvpars.service.api.BoxService;
import com.jvpars.service.api.CommentService;
import com.jvpars.service.api.ContentService;
import com.jvpars.service.api.MenuService;
import com.jvpars.utils.MyArgUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.logging.Logger;

@Controller
public class PageBoxController {


    private BoxService boxService;
    private MenuService menuService;

    @Autowired
    PageBoxController(MenuService menuService ,
                      BoxService boxService){
        this.menuService = menuService;
        this.boxService = boxService;

    }

    @RequestMapping(value = "/front/boxes",produces = MediaType.TEXT_HTML_VALUE)
    ResponseEntity getContents(@RequestParam Long menuId) {
        try {
        //    MyArgUtils.print("content");
            Menu menu = menuService.findOne(menuId);
            List<Box> boxes = boxService.findByMenu(menu);
       //     MyArgUtils.print("menu boxes : " + boxes.size());
            return new ResponseEntity(boxes, HttpStatus.OK);
        } catch (Exception ex) {
              return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }
}
