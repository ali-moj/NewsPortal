package com.jvpars.web._secure;

import com.jvpars.utils.*;

import com.jvpars.domain.SysUser;
import com.jvpars.service.api.SysUserService;


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

@RequestMapping("/_secure/sysusers")
@Controller
@Secured({"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
public class SysUsersController {


    @Autowired
    public SysUserService sysuserService;

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(SysUser.class).drop("id").drop("version").drop("createdDate")
                .drop("createdDateL").drop("tempPass").html().build();
        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "_secure/sysusers/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<SysUser> list(GlobalSearch search, Pageable pageable) {
        Page<SysUser> sysuser = sysuserService.findAll(search, pageable);
        return sysuser;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<SysUser> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<SysUser> sysuser = list(search, pageable);
        long allAvailableSysUser = sysuserService.count();
        return new DatatablesData<SysUser>(sysuser, allAvailableSysUser, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new SysUser());
        return "/_secure/sysusers/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute SysUser sysuser, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new SysUser());
            return "_secure/sysusers/create";
        }
     //   MyArgUtils.print(sysuser + "");
        SysUser newSysUser = sysuserService.save(sysuser);
        redirectAttrs.addAttribute("id", newSysUser.getId());
        return "redirect:/_secure/sysusers/{id}";
    }


    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, sysuserService.findOne(id));
        return "/_secure/sysusers/edit";
    }


    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute SysUser sysuser, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, sysuser);
            return "_secure/sysusers/edit";
        }
        SysUser savedSysUser = sysuserService.save(sysuser);
        redirectAttrs.addAttribute("id", savedSysUser.getId());
        return "redirect:/_secure/sysusers/{id}";
    }


    @RequestMapping(value = "/delete/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        sysuserService.delete(id);
        model.asMap().clear();
       return "redirect:/_secure/sysusers";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", sysuserService.findOne(id));
        return "_secure/sysusers/show";
    }


    void populateForm(Model uiModel, SysUser sysuser) {
        uiModel.addAttribute("sysuser", sysuser);
    }
}