package com.jvpars.web._secure;

import com.jvpars.domain.Box;
import com.jvpars.domain.Content;
import com.jvpars.domain.Menu;
import com.jvpars.dto.Select2Role;
import com.jvpars.service.api.BoxService;
import com.jvpars.service.api.ContentService;
import com.jvpars.service.api.MenuService;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.utils.HtmlBuilder;
import com.jvpars.utils.MapWrapper;
import com.jvpars.utils.MyArgUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;


@Controller
@Secured({"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
public class MenuController {

    MenuService menuService;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    ContentService contentService;

    @Autowired
    BoxService boxService;


    @Autowired
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }


    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(Menu.class).drop("id").drop("version").drop("children").drop("deleted").drop("menuType").drop("parent").html().build();
        return wrapper;
    }


    @RequestMapping(value = {"/_secure/menus", "/menus"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<Menu> list(GlobalSearch search, Pageable pageable) {

        //      MyArgUtils.print("callBack" + menuService.findAll(search, pageable).getTotalElements());
        return menuService.findAll(search, pageable);
    }

    private void checkForMainPageMenu() {
        List<Menu> menus = menuService.findAllByMainPageIsTrue();
        if (menus.size() == 0) {
            Menu menu = new Menu();
            menu.setParent(null);
            menu.setArrangment(1);
            String name = messageSource.getMessage("mainPage", new Object[0], LocaleContextHolder.getLocale());
            menu.setTitle(name);
            menu.setMainPage(true);
            menuService.save(menu);
        }

    }

    @RequestMapping(value = "/_secure/menus/get-roles", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity getMenus(GlobalSearch search, Pageable pageable) {
        List<Select2Role> roles = new ArrayList<>();
        roles.add(new Select2Role("ROLE_ADMIN", "ADMIN"));
        Iterable<Menu> menus = menuService.findAll();
        for (Menu menu : menus)
            roles.add(new Select2Role(menu.getAcl(), menu.getAcl().replace("ROLE_", "")));
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    @RequestMapping(value = {"/_secure/menus", "/menus"}, method = RequestMethod.GET, produces = "text/html")
    public String getList(Model model) {
        //checkForMainPageMenu();
        List<Menu> menus = menuService.findAllByParentIsNull();
        model.addAttribute("menuItemsList", menus);
        return "_secure/menus/list";
    }

    @RequestMapping(value = "/_secure/menus/create-form", method = RequestMethod.GET, produces = "text/html")
    public String createMenu(@RequestParam(value = "parentId", required = false) Long parentId, Model model) {

        Menu menu = new Menu();
        if (parentId != null) {
            Menu parentMenu = menuService.findOne(parentId);
            //MyArgUtils.print("title: " + parentMenu.getTitle());
            menu.setParent(parentMenu);
        }
        pupulateForm(model, menu);
        return "_secure/menus/create";
    }


    @RequestMapping(value = "/_secure/menus/", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String save(@Valid @ModelAttribute Menu menu, @RequestParam(value = "parentId", required = false) Long parentId, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            Menu newMenu = new Menu();
            if (parentId != null) {
                Menu parentMenu = menuService.findOne(parentId);

                newMenu.setParent(parentMenu);
            }
            pupulateForm(model, newMenu);
            return "_secure/menus/create";
        } else {
            //MyArgUtils.print("error : " + result.toString());
        }

//        if(parentId != null){
//            menu.setParent(menuService.findOne(parentId));
//        }
        //MyArgUtils.print("Save");
        menuService.save(menu);
        return "redirect:/_secure/menus";
    }

    @RequestMapping(value = "/_secure/menus/{id}", method = RequestMethod.POST, produces = "text/html")
    public String showMenu(@PathVariable("id") Long id, Model model) {
        pupulateForm(model, menuService.findOne(id));
        return "redirect:/_secure/menus";
    }

    @RequestMapping(value = "/_secure/menus/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editMenu(@PathVariable("id") Long id, Model model) {
        Menu menu = menuService.findOne(id);

        pupulateForm(model, menu);
        return "_secure/menus/edit";
    }

    @RequestMapping(value = "/_secure/menus/", method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String edit(@Valid @ModelAttribute Menu menu, BindingResult result, RedirectAttributes redirectAttrs, Model model) {

        if (result.hasErrors()) {
            pupulateForm(model, menu);
            return "_secure/menus/edit";
        }

        //MyArgUtils.print("Edit " + menu.getId());
        model.asMap().clear();
        // menuService.delete(menu.getId());
        menuService.save(menu);

        return "redirect:/_secure/menus";
    }

    @RequestMapping(value = "/_secure/menus/del/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        try {
            Menu menu = menuService.findOne(id);
            getChildrenAndDelete(menu);
            menuService.delete(menu.getId());
            model.asMap().clear();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "redirect:/_secure/menus";
    }

    private void getChildrenAndDelete(Menu menu) {
        List<Menu> children = menu.getChildren();
        // MyArgUtils.print("menu " + menu.getTitle() + " childs = "  + children.size());
        if (children.size() == 0) {
            menuDelete(menu);
        }

        for (Menu x : children) {
            getChildrenAndDelete(x);
            menuDelete(menu);
        }
    }

    private void menuDelete(Menu menu) {
        //  MyArgUtils.print("menu :  " + menu.getId() + " : " + menu.getTitle() );
        List<Box> boxes = boxService.findByMenu(menu);
        for (Box box : boxes) {
            List<Content> contents = contentService.findALLByBox(box);
            for (Content content : contents) {
                contentService.delete(content.getId());
            }
        }
    }

    //................


    private void pupulateForm(Model uiModel, Menu menu) {
        uiModel.addAttribute("menu", menu);
    }

    @RequestMapping(value = "/_secure/menus/getone/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Menu> getMenu(@PathVariable("id") Long id) {

        Menu parrent = menuService.findOne(id);
        return parrent.getChildren();
    }

}
