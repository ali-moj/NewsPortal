package com.jvpars.web._secure;

import com.jvpars.utils.DatatablesData;
import com.jvpars.utils.DatatablesPageable;
import com.jvpars.utils.HtmlBuilder;
import com.jvpars.utils.MapWrapper;

import com.jvpars.domain.DocFile;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.service.api.DocFileService;


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

@RequestMapping("/_secure/docfiles")
@Controller
public class DocFilesController {


    @Autowired
    public DocFileService docfileService;

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(DocFile.class).drop("id").drop("version").html().build();
        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "docfiles/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<DocFile> list(GlobalSearch search, Pageable pageable) {
        Page<DocFile> docfile = docfileService.findAll(search, pageable);
        return docfile;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<DocFile> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<DocFile> docfile = list(search, pageable);
        long allAvailableDocFile = docfileService.count();
        return new DatatablesData<DocFile>(docfile, allAvailableDocFile, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new DocFile());
        return "_secure/docfiles/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute DocFile docfile, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new DocFile());
            return "_secure/docfiles/create";
        }
        DocFile newDocFile = docfileService.save(docfile);
        redirectAttrs.addAttribute("id", newDocFile.getId());
        return "redirect:/_secure/docfiles/{id}";
    }


    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, docfileService.findOne(id));
        return "_secure/docfiles/edit";
    }


    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute DocFile docfile, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, docfile);
            return "_secure/docfiles/edit";
        }
        DocFile savedDocFile = docfileService.save(docfile);
        redirectAttrs.addAttribute("id", savedDocFile.getId());
        return "redirect:/_secure/docfiles/{id}";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        docfileService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/docfiles";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("docfile", docfileService.findOne(id));
        return "_secure/docfiles/show";
    }


    void populateForm(Model uiModel, DocFile docfile) {
        uiModel.addAttribute("docfile", docfile);
    }
}