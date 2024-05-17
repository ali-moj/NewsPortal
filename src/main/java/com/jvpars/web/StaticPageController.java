package com.jvpars.web;


import com.jvpars.domain.DocFile;
import com.jvpars.domain.DocFolder;
import com.jvpars.domain.ImageGallery;
import com.jvpars.service.api.DocFileService;
import com.jvpars.service.api.DocFolderService;
import com.jvpars.service.api.ImageGalleryService;
import com.jvpars.utils.MyArgUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.logging.Logger;

@Controller
public class StaticPageController {
    static Logger log = Logger.getLogger(StaticPageController.class.getName());


    @RequestMapping(value = {"/error", "/_secure/error", "/_secure/errorpage", "/errorpage", "/_secure/error", "/_secure/errorpage", "/error/500", "/error/500", "/500"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String error(Model model) {
        log.info("error");
         return "/error";
    }







}
