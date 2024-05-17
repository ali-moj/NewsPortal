package com.jvpars.web._secure;

import com.jvpars.utils.DatatablesData;
import com.jvpars.utils.DatatablesPageable;
import com.jvpars.utils.HtmlBuilder;
import com.jvpars.utils.MapWrapper;

import com.jvpars.domain.ContentTag;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.service.api.ContentTagService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


import javax.validation.Valid;

@RequestMapping("/_secure/contenttags")
@Controller
public class ContentTagsController {


    @Autowired
    public ContentTagService contenttagService;

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(ContentTag.class).drop("id").drop("version").html().build();
        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "_secure/contenttags/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<ContentTag> list(GlobalSearch search, Pageable pageable) {
        Page<ContentTag> contenttag = contenttagService.findAll(search, pageable);
        return contenttag;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<ContentTag> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<ContentTag> contenttag = list(search, pageable);
        long allAvailableContentTag = contenttagService.count();
        return new DatatablesData<ContentTag>(contenttag, allAvailableContentTag, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new ContentTag());
        return "_secure/contenttags/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute ContentTag contenttag, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new ContentTag());
            return "_secure/contenttags/create";
        }
        ContentTag newContentTag = contenttagService.save(contenttag);
        redirectAttrs.addAttribute("id", newContentTag.getId());
        return "redirect:/_secure/contenttags/{id}";
    }


    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, contenttagService.findOne(id));
        return "_secure/contenttags/edit";
    }


    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute ContentTag contenttag, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, contenttag);
            return "_secure/contenttags/edit";
        }
        ContentTag savedContentTag = contenttagService.save(contenttag);
        redirectAttrs.addAttribute("id", savedContentTag.getId());
        return "redirect:/_secure/contenttags/{id}";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        contenttagService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/contenttags";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("contenttag", contenttagService.findOne(id));
        return "_secure/contenttags/show";
    }


    void populateForm(Model uiModel, ContentTag contenttag) {
        uiModel.addAttribute("contenttag", contenttag);
    }
}