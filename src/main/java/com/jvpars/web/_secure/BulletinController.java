package com.jvpars.web._secure;


import com.jvpars.domain.Bulletin;
import com.jvpars.service.api.BulletinService;
import com.jvpars.utils.*;
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

@RequestMapping(value = {"/_secure/bulletins"})
@Controller
@Secured("ROLE_ADMIN")
public class BulletinController {

    @Autowired
    BulletinService bulletinService;

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(Bulletin.class)
                .drop("id")
                .drop("version")
                .drop("createdDateL")
                .drop("expirationDateL")
                .html().build();
        return wrapper;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "_secure/bulletins/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<Bulletin> list(GlobalSearch search, Pageable pageable) {
        return bulletinService.findAll(search, pageable);
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<Bulletin> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<Bulletin> box = list(search, pageable);
        long allAvailablebox = bulletinService.count();
        return new DatatablesData<>(box, allAvailablebox, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new Bulletin());
        return "_secure/bulletins/create";
    }


    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute Bulletin box, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new Bulletin());
            return "_secure/bulletins/create";
        }
        Bulletin bulletin = bulletinService.save(box);
        redirectAttrs.addAttribute("id", bulletin.getId());
        return "redirect:/_secure/bulletins/{id}";
    }


    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, bulletinService.findOne(id));
        return "_secure/bulletins/edit";
    }


    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute Bulletin bulletin, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, bulletin);
            return "_secure/bulletins/edit";
        }
        Bulletin saveBulletin = bulletinService.save(bulletin);
        redirectAttrs.addAttribute("id", saveBulletin.getId());
        return "redirect:/_secure/bulletins/{id}";
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        bulletinService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/bulletins/";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        populateForm(model, bulletinService.findOne(id));
        return "_secure/bulletins/show";
    }


    void populateForm(Model uiModel, Bulletin bulletin) {
        uiModel.addAttribute("bulletin", bulletin);
    }
}
