package com.jvpars.web._secure;

import com.jvpars.domain.Box;
import com.jvpars.domain.Menu;
import com.jvpars.domain.SysUser;
import com.jvpars.repository.BoxRepository;
import com.jvpars.repository.MenuRepository;
import com.jvpars.security.LoggedIn;
import com.jvpars.utils.*;

import com.jvpars.domain.Content;
import com.jvpars.service.api.ContentService;


import com.jvpars.web.errors.JvparsException;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

@RequestMapping("/_secure/contents")
@Controller
public class ContentsController {

    static Logger log = Logger.getLogger(ContentsController.class.getName());

    @Autowired
    LoggedIn loggedIn;

    @Autowired
    public ContentService contentService;

    @Autowired
    public BoxRepository boxRepository;
    @Autowired
    public MenuRepository menuRepository;


    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(Content.class).drop("id").drop("version").drop("deleted").drop("createdDateL").drop("sysUser").drop("viewCount").drop("published").html().build();
        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String list(Model model) {
        return "_secure/contents/list";
    }

    @RequestMapping(value = "/unpublished-list", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String unpublishedList(Model model) {
        return "_secure/contents/unpublishedList";
    }

    @RequestMapping(value = "/unpublished-datatable", method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<Content> unpublishedList(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<Content> content = contentService.findAllUnpublished(search, pageable);
        long allAvailableContent = contentService.count();
        return new DatatablesData<Content>(content, allAvailableContent, draw);
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<Content> list(GlobalSearch search, Pageable pageable) {
        Page<Content> content = contentService.findAll(search, pageable);
        return content;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<Content> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<Content> content = list(search, pageable);
        long allAvailableContent = contentService.count();
        return new DatatablesData<Content>(content, allAvailableContent, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String createForm(Model model) {
        populateForm(model, new Content());
        return "_secure/contents/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String create(@Valid @ModelAttribute Content content, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new Content());
            return "_secure/contents/create";
        }

        if (loggedIn.getEmail().equals("support@jvpars.com")) {
            throw new JvparsException("user support can not add content ! ");
        }

        SysUser user = loggedIn.getUser();
        content.setCreatedDateL(MyArgUtils.nowEpoch());
        content.setSysUser(user);
        Content newContent = contentService.save(content);
        redirectAttrs.addAttribute("id", newContent.getId());

        return "redirect:/_secure/contents/{id}";
    }


    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, contentService.findOne(id));
        return "_secure/contents/edit";
    }


    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String update(@Valid @ModelAttribute Content content, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            //MyArgUtils.bindingResultErrorPrint(result);
            populateForm(model, content);
            return "_secure/contents/edit";
        }
        if (loggedIn.getEmail().equals("support@jvpars.com")) {
            throw new JvparsException("user support can not add content ! ");
        }

        SysUser user = loggedIn.getUser();
        content.setSysUser(user);
        Content savedContent = contentService.update(content);
        redirectAttrs.addAttribute("id", savedContent.getId());
        return "redirect:/_secure/contents/{id}";
    }


    @RequestMapping(value = "/delete/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String delete(@PathVariable("id") Long id, Model model) {
        contentService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/contents";
    }

    @RequestMapping(value = "/publish/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String publish(@PathVariable("id") Long id, Model model) {
        Content content = contentService.findOne(id);
        if(content == null) {
            throw new JvparsException("Bilakh");
        }
        content.setPublished(!content.getPublished());
        contentService.publish(content);
        model.asMap().clear();
        return "redirect:/_secure/contents/" + id;
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @Secured("ROLE_ADMIN")
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("content", contentService.findOne(id));
        return "_secure/contents/show";
    }


    void populateForm(Model uiModel, Content content) {
        uiModel.addAttribute("content", content);
    }


    @RequestMapping(value = "/list-by-user", method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<Content> listByUser(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        SysUser user = loggedIn.getUser();
        Page<Content> content = contentService.findAllByUser(search, pageable, user);
        long allAvailableContent = contentService.count();
        return new DatatablesData<>(content, allAvailableContent, draw);
    }

    @RequestMapping(value = "/user-contents", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String userContentList(Model model) {
        return "_secure/contents/userContents";
    }

    @RequestMapping(value = "/user-create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String userCreateContent(Model model) {
        model.addAttribute("content", new Content());
        model.addAttribute("boxes", userCreateContent());
        return "_secure/contents/userCreateContent";
    }

    @RequestMapping(value = "/user-create-form", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String userCreateContent(@Valid @ModelAttribute Content content, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new Content());
            return "_secure/contents/user-create-form";
        }

        SysUser user = loggedIn.getUser();
        content.setCreatedDateL(MyArgUtils.nowEpoch());
        content.setSysUser(user);
        Content newContent = contentService.save(content);
        redirectAttrs.addAttribute("id", newContent.getId());

        return "redirect:/_secure/contents/show-user-content/{id}";

    }

    @RequestMapping(value = "/user-edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editUserContent(@PathVariable("id") Long id, Model model) {
        log.info("edit callback");
        Content content = contentService.findOne(id);
        if (checkUserAccess(content.getSysUser()))
            throw new JvparsException("İZİN YOK !");
        model.addAttribute("content", content);
        model.addAttribute("boxes", userCreateContent());
        return "_secure/contents/editUserContent";
    }

    @RequestMapping(value = "/user-update", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String updateUserContent(@Valid @ModelAttribute Content content, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            //MyArgUtils.bindingResultErrorPrint(result);
            populateForm(model, content);
            return "_secure/contents/user-edit-form";
        }

        SysUser user = loggedIn.getUser();
        content.setSysUser(user);
        Content savedContent = contentService.update(content);
        redirectAttrs.addAttribute("id", savedContent.getId());
        return "redirect:/_secure/contents/show-user-content/{id}";
    }

    @RequestMapping(value = "/show-user-content/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String showUserContent(@PathVariable("id") Long id, Model model) {
        Content content = contentService.findOne(id);
        if (checkUserAccess(content.getSysUser()))
            throw new JvparsException("İZİN YOK !");
        model.addAttribute("content", content);
        return "_secure/contents/showUserContent";
    }

    @RequestMapping(value = "/user-delete-content/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String deleteUserContent(@PathVariable("id") Long id, Model model) {
        Content content = contentService.findOne(id);
        if (checkUserAccess(content.getSysUser()))
            throw new JvparsException("İZİN YOK !");
        contentService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/contents/user-contents";
    }

    private boolean checkUserAccess(SysUser dataUser) {
        SysUser user = loggedIn.getUser();
        return !dataUser.getId().equals(user.getId());
    }

    private List<Box> userCreateContent() {

        SysUser user = loggedIn.getUser();
        List<String> roles = new ArrayList<>(Arrays.asList(user.getRole().split(",")));
        List<Menu> menus = menuRepository.findAllByAclIn(roles);
        return boxRepository.findAllByMenuIn(menus);
    }

}