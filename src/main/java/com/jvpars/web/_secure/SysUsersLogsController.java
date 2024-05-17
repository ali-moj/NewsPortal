package com.jvpars.web._secure;

import com.jvpars.utils.DatatablesData;
import com.jvpars.utils.DatatablesPageable;
import com.jvpars.utils.HtmlBuilder;
import com.jvpars.utils.MapWrapper;

import com.jvpars.domain.SysUsersLog;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.service.api.LogService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


import javax.validation.Valid;

@RequestMapping("/_secure/sysuserslogs")
@Controller
@Secured("ROLE_ADMIN")
public class SysUsersLogsController {


    @Autowired
    public LogService sysuserslogService;

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(SysUsersLog.class).drop("id").drop("version").html().build();
        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "_secure/sysuserslogs/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<SysUsersLog> list(GlobalSearch search, Pageable pageable) {
        Page<SysUsersLog> sysuserslog = sysuserslogService.findAll(search, pageable);
        return sysuserslog;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<SysUsersLog> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<SysUsersLog> sysuserslog = list(search, pageable);
        long allAvailableSysUsersLog = sysuserslogService.count();
        return new DatatablesData<SysUsersLog>(sysuserslog, allAvailableSysUsersLog, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new SysUsersLog());
        return "_secure/sysuserslogs/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute SysUsersLog sysuserslog, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new SysUsersLog());
            return "_secure/sysuserslogs/create";
        }
        SysUsersLog newSysUsersLog = sysuserslogService.save(sysuserslog);
        redirectAttrs.addAttribute("id", newSysUsersLog.getId());
        return "redirect:/_secure/sysuserslogs/{id}";
    }


    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, sysuserslogService.findOne(id));
        return "_secure/sysuserslogs/edit";
    }


    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute SysUsersLog sysuserslog, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, sysuserslog);
            return "_secure/sysuserslogs/edit";
        }
        SysUsersLog savedSysUsersLog = sysuserslogService.save(sysuserslog);
        redirectAttrs.addAttribute("id", savedSysUsersLog.getId());
        return "redirect:/_secure/sysuserslogs/{id}";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        sysuserslogService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/sysuserslogs";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("sysuserslog", sysuserslogService.findOne(id));
        return "_secure/sysuserslogs/show";
    }


    void populateForm(Model uiModel, SysUsersLog sysuserslog) {
        uiModel.addAttribute("sysuserslog", sysuserslog);
    }
}