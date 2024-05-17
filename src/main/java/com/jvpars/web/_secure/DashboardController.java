package com.jvpars.web._secure;

import com.jvpars.domain.Comment;
import com.jvpars.domain.Content;
import com.jvpars.domain.Setting;
import com.jvpars.domain.SysUsersLog;
import com.jvpars.repository.ContentRepository;
import com.jvpars.selection.LogType;
import com.jvpars.service.api.CommentService;
import com.jvpars.service.api.LogService;
import com.jvpars.service.api.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequestMapping("/_secure/dashboard")
@Controller
public class DashboardController {

    @Autowired
    LogService logService;

    @Autowired
    ContentRepository contentRepository;

    @Autowired
    SettingService settingService;

    @Autowired
    CommentService commentService;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String show(Model model) {
        return "_secure/dashboard/dashboard";
    }

    @RequestMapping(value = "/last-user-login", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity lastUserLogin() {
        List<SysUsersLog> logs = logService.Top5LogByType(LogType.LOGIN);
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }

    @RequestMapping(value = "/un-published", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity lastUnPublished() {
        List<Content> contents = contentRepository.findTop5ByPublishedOrderByIdDesc(false);
        return new ResponseEntity<>(contents, HttpStatus.OK);
    }


    @RequestMapping(value = "/menu-count", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity menuContentList() {
        List<?> contents = contentRepository.findContentCountByMenu();
        return new ResponseEntity<>(contents, HttpStatus.OK);
    }

    @RequestMapping(value = "/last-7-day-content", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity ContentInLast7Day() {
        List<?> contents = contentRepository.findContentAddInLastSevenDay();
        return new ResponseEntity<>(contents, HttpStatus.OK);
    }

    @RequestMapping(value = "/daily-visit", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity dailyVisit() {
        List<?> contents = contentRepository.newsVisit();
        return new ResponseEntity<>(contents, HttpStatus.OK);
    }

    @RequestMapping(value = "/news-comments", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity newsComments() {
        List<?> contents = contentRepository.newsComments();
        return new ResponseEntity<>(contents, HttpStatus.OK);
    }

    @RequestMapping(value = "/last-days-comment", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity lastDaysComments() {
        List<?> contents = contentRepository.lastDaysComments();
        return new ResponseEntity<>(contents, HttpStatus.OK);
    }

    @RequestMapping(value = "/news-in-days", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity newsInDays() {
        List<?> contents = contentRepository.newsInDays();
        return new ResponseEntity<>(contents, HttpStatus.OK);
    }

    @RequestMapping(value = "/support", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity supportData() {
        Setting setting = settingService.getSetting();
        return new ResponseEntity<>(setting, HttpStatus.OK);
    }

    @RequestMapping(value = "/un-confirm-comments", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity lastComments() {
        List<Comment> comments = commentService.findTop5ByConfirmedIsFalseOrderByIdDesc();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }




}
