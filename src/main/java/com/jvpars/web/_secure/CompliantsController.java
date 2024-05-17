package com.jvpars.web._secure;

import com.jvpars.domain.Comment;
import com.jvpars.domain.Compliant;
import com.jvpars.selection.Status;
import com.jvpars.service.api.CompliantService;
import com.jvpars.utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/_secure/compliants")
@Controller
@Secured("ROLE_ADMIN")
public class CompliantsController {
     @Autowired
    public CompliantService compliantService;


    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(Compliant.class)
                .drop("id")
                .drop("version")
                .drop("content")
                .drop("deleted")
                .drop("createdDateL")
                .html()
                .build();

        return wrapper;
    }




    @Autowired
    public CompliantsController(CompliantService compliantService) {
        this.compliantService = compliantService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "_secure/compliants/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<Compliant> list(GlobalSearch search, Pageable pageable) {
        Page<Compliant> compliant = compliantService.findAll(search, pageable);
        return compliant;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<Compliant> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<Compliant> compliant = list(search, pageable);
        long allAvailableCompliant = compliantService.count();
        return new DatatablesData<Compliant>(compliant, allAvailableCompliant, draw);
    }




    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        compliantService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/compliants";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("compliant", compliantService.findOne(id));
        return "_secure/compliants/show";
    }

    @RequestMapping(value = "/seen", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String seen(@RequestParam("id") Long id, Model model) {
        Compliant compliant =compliantService.findOne(id);
        compliant.setStatus(Status.enable);
        compliantService.save(compliant);
        return "redirect:/_secure/compliants";
    }


    void populateForm(Model uiModel, Compliant compliant) {
        uiModel.addAttribute("compliant", compliant);
    }
}
