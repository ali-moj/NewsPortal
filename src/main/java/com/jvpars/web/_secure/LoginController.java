package com.jvpars.web._secure;

import com.jvpars.domain.SysUser;
import com.jvpars.security.LoggedIn;
import com.jvpars.selection.LogType;
import com.jvpars.service.api.LogService;
import com.jvpars.utils.MyArgUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;


@Controller
public class LoginController {

    @Autowired
    private LoggedIn loggedIn;

    @Autowired
    private LogService service;

    private final Logger log = LoggerFactory.getLogger(LoginController.class);


    @Autowired
    @Qualifier("sessionRegistry")
    private SessionRegistry sessionRegistry;


    @RequestMapping(value = "_secure/", method = RequestMethod.GET, produces = "text/html")
    public String home() {
        return "redirect:/_secure/admin";
    }


    @RequestMapping(value = "/_secure/admin", method = RequestMethod.GET, produces = "text/html")
    public String admin(Model uiModel, Principal principal, HttpServletRequest request) {
        log.info("admin step 1 callback");

//        Enumeration<String> li = request.getSession().getAttributeNames();
//        while (li.hasMoreElements()) {
//            MyArgUtils.print(li.nextElement());
//        }

        log.info("admin step 2 callback");
        List<Object> principals = sessionRegistry.getAllPrincipals();
        List<String> usersNamesList = new ArrayList<String>();

        for (Object p : principals) {
            if (p instanceof User) {
                //   MyArgUtils.print(((User) p).getUsername()); all logged users in  session
                usersNamesList.add(((User) p).getUsername());
            }
        }
        log.info("admin step 3 callback");


        SysUser user = loggedIn.getUser();
        if (user == null)
            return "redirect:/_secure/settings";

        log.info("admin step 4 callback");
//        request.getSession().setAttribute("userEmail",  loggedIn.getUser().getEmail());
//        request.getSession().setAttribute("userName",  loggedIn.getUser().getFullName());
//        request.getSession().setAttribute("user",loggedIn.getUser());

        long epoch = System.currentTimeMillis();
        String message = String.format("کاربر %s در تاریخ %s وارد شد", user.getFullName(), MyArgUtils.convertEpochToPersian(epoch));
        loggedIn.saveLog(LogType.LOGIN, message);

        if(user.getRole().contains("ROLE_ADMIN")) {
            return "redirect:/_secure/dashboard";
        }

        return "redirect:/_secure/contents/user-contents";
    }

    @RequestMapping(value = "/_secure/login", method = RequestMethod.GET, produces = "text/html")
    public String login(Model uiModel) {
        log.info("callback");
        return "/_secure/login";
    }


}