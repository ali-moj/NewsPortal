package com.jvpars.web.front;

import com.jvpars.domain.Bulletin;
import com.jvpars.domain.Comment;
import com.jvpars.domain.Content;
import com.jvpars.service.api.BulletinService;
import com.jvpars.service.api.CommentService;
import com.jvpars.service.api.ContentService;
import com.jvpars.utils.MyArgUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@Controller
public class BulletinsController {

    @Autowired
    BulletinService service;

    @RequestMapping(value = "bulletins/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        populateForm(model, service.findOne(id));
        return "front/contents/bulletinsShow";
    }

    void populateForm(Model uiModel, Bulletin bulletin) {
        uiModel.addAttribute("bulletin", bulletin);
    }


}
