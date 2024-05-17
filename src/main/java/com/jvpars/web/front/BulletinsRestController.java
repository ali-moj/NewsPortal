package com.jvpars.web.front;

import com.jvpars.domain.Bulletin;
import com.jvpars.service.api.BulletinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class BulletinsRestController {
    @Autowired
    BulletinService service;

    @RequestMapping(value = "/Bulletins-list",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity getAllBulletins() {
        try {
            return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
        } catch (Exception ex) {
            return  new ResponseEntity(new Bulletin(),HttpStatus.INTERNAL_SERVER_ERROR);
            // return new ResponseEntity<>(null,null,HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}
