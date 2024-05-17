package com.jvpars.web._secure;

import com.jvpars.utils.DatatablesData;
import com.jvpars.utils.DatatablesPageable;
import com.jvpars.utils.HtmlBuilder;
import com.jvpars.utils.MapWrapper;

import com.jvpars.domain.ContentAlbum;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.service.api.ContentAlbumService;


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

@RequestMapping("/_secure/contentalbums")
@Controller
@Secured("ROLE_ADMIN")
public class ContentAlbumsController {


    @Autowired
    public ContentAlbumService contentalbumService;

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(ContentAlbum.class).drop("id").drop("version").html().build();
        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "_secure/contentalbums/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<ContentAlbum> list(GlobalSearch search, Pageable pageable) {
        Page<ContentAlbum> contentalbum = contentalbumService.findAll(search, pageable);
        return contentalbum;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<ContentAlbum> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<ContentAlbum> contentalbum = list(search, pageable);
        long allAvailableContentAlbum = contentalbumService.count();
        return new DatatablesData<ContentAlbum>(contentalbum, allAvailableContentAlbum, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new ContentAlbum());
        return "_secure/contentalbums/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute ContentAlbum contentalbum, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new ContentAlbum());
            return "_secure/contentalbums/create";
        }
        ContentAlbum newContentAlbum = contentalbumService.save(contentalbum);
        redirectAttrs.addAttribute("id", newContentAlbum.getId());
        return "redirect:/_secure/contentalbums/{id}";
    }


    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, contentalbumService.findOne(id));
        return "_secure/contentalbums/edit";
    }


    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute ContentAlbum contentalbum, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, contentalbum);
            return "_secure/contentalbums/edit";
        }
        ContentAlbum savedContentAlbum = contentalbumService.save(contentalbum);
        redirectAttrs.addAttribute("id", savedContentAlbum.getId());
        return "redirect:/_secure/contentalbums/{id}";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        contentalbumService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/contentalbums";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("contentalbum", contentalbumService.findOne(id));
        return "/_secure/contentalbums/show";
    }


    void populateForm(Model uiModel, ContentAlbum contentalbum) {
        uiModel.addAttribute("contentalbum", contentalbum);
    }
}