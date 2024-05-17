package com.jvpars.web._secure;

import com.jvpars.utils.DatatablesData;
import com.jvpars.utils.DatatablesPageable;
import com.jvpars.utils.HtmlBuilder;
import com.jvpars.utils.MapWrapper;

import com.jvpars.domain.Box;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.service.api.BoxService;


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


@RequestMapping(value = {"/_secure/boxes" , "_secure/boxs"})
@Controller
@Secured("ROLE_ADMIN")
public class BoxesController {


    @Autowired
    public BoxService boxService;

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(Box.class)
                .drop("id")
                .drop("version")
                .drop("mainImage")
                .drop("select2")
                .html().build();
        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "_secure/boxes/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<Box> list(GlobalSearch search, Pageable pageable) {
        return boxService.findAll(search, pageable);
    }



    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<Box> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<Box> box = list(search, pageable);
        long allAvailablebox = boxService.count();
        return new DatatablesData<Box>(box, allAvailablebox, draw);
    }

    @RequestMapping(value = {"/create-form"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new Box());
        return "_secure/boxes/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute Box box, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new Box());
            return "_secure/boxes/create";
        }
        Box newbox = boxService.save(box);
        redirectAttrs.addAttribute("id", newbox.getId());
        return "redirect:/_secure/boxes/{id}";
    }


    @RequestMapping(value = {"/edit-form/{id}","_secure/boxs//edit-form/{id}"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, boxService.findOne(id));
        return "_secure/boxes/edit";
    }


    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute Box box, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, box);
            return "_secure/boxes/edit";
        }
        Box savedbox = boxService.save(box);
        redirectAttrs.addAttribute("id", savedbox.getId());
        return "redirect:/_secure/boxes/{id}";
    }

    @RequestMapping(value = { "delete/{id}"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        boxService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/boxes/";
    }


    @RequestMapping(value = {"/{id}"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("box", boxService.findOne(id));
        return "_secure/boxes/show";
    }


    void populateForm(Model uiModel, Box box) {
        uiModel.addAttribute("box", box);
    }
}