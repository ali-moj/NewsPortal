package com.jvpars.web._secure;

import com.jvpars.utils.DatatablesData;
import com.jvpars.utils.DatatablesPageable;
import com.jvpars.utils.HtmlBuilder;
import com.jvpars.utils.MapWrapper;

import com.jvpars.domain.DocFolder;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.service.api.DocFolderService;


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

@RequestMapping("/_secure/docfolders")
@Controller
public class DocFoldersController {


    @Autowired
    public DocFolderService docfolderService;

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(DocFolder.class).drop("id").drop("version").html().build();
        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "_secure/docfolders/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<DocFolder> list(GlobalSearch search, Pageable pageable) {
        Page<DocFolder> docfolder = docfolderService.findAll(search, pageable);
        return docfolder;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<DocFolder> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<DocFolder> docfolder = list(search, pageable);
        long allAvailableDocFolder = docfolderService.count();
        return new DatatablesData<DocFolder>(docfolder, allAvailableDocFolder, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new DocFolder());
        return "_secure/docfolders/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute DocFolder docfolder, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new DocFolder());
            return "_secure/docfolders/create";
        }
        DocFolder newDocFolder = docfolderService.save(docfolder);
        redirectAttrs.addAttribute("id", newDocFolder.getId());
        return "redirect:/_secure/docfolders/{id}";
    }


    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, docfolderService.findOne(id));
        return "_secure/docfolders/edit";
    }


    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute DocFolder docfolder, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, docfolder);
            return "_secure/docfolders/edit";
        }
        DocFolder savedDocFolder = docfolderService.save(docfolder);
        redirectAttrs.addAttribute("id", savedDocFolder.getId());
        return "redirect:/_secure/docfolders/{id}";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        docfolderService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/docfolders";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("docfolder", docfolderService.findOne(id));
        return "_secure/docfolders/show";
    }


    void populateForm(Model uiModel, DocFolder docfolder) {
        uiModel.addAttribute("docfolder", docfolder);
    }
}