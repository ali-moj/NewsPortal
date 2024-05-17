package com.jvpars.web.front;


import com.jvpars.domain.*;
import com.jvpars.dto.*;
import com.jvpars.service.api.*;
import com.jvpars.web.errors.JvparsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class PageContentController {

    private final Logger log = LoggerFactory.getLogger(PageContentController.class);


    private ContentService contentService;
    private MenuService menuService;
    private BoxService boxService;
    private CommentService commentService;
    private SysUserService userService;
    private SettingService settingService;

    @Autowired
    PageContentController(CommentService commentService, BoxService boxService, MenuService menuService, ContentService contentService, SysUserService userService, SettingService settingService) {
        this.contentService = contentService;
        this.commentService = commentService;
        this.boxService = boxService;
        this.menuService = menuService;
        this.userService = userService;
        this.settingService = settingService;
    }

    private List<BoxContent> getCol6RightSliderContents(Long menuId) {

        Menu menu = menuService.findOne(menuId);
        List<Box> boxes = boxService.findByMenu(menu);
        List<BoxContent> boxContents = new ArrayList<>();
        for (Box box : boxes) {
            if (box.getBoxType().equals("Col6RightSlider")) {

                List<Content> items = contentService.findTop10ByBoxOrderByIdDesc(box);
                boxContents.add(createBoxContent(box, items));
            }
        }
        return boxContents;
    }

    private BoxContent createBoxContent(Box box, List<Content> contents) {
        BoxContent boxContent;
        boxContent = new BoxContent();
        boxContent.setId(box.getId());
        boxContent.setPriority(box.getPriority());
        boxContent.setTitle(box.getName());
        List<ContentSummeryDto> contentSummeryDtos = new ArrayList<>();
        for (Content content : contents) {
            ContentSummeryDto summeryDto = new ContentSummeryDto(content);
            contentSummeryDtos.add(summeryDto);
        }
        boxContent.setContents(contentSummeryDtos);
        return boxContent;
    }

    private List<ContentSummeryDto> convertContentDto(List<Content> contents) {
        List<ContentSummeryDto> contentSummeryDtos = new ArrayList<>();
        for (Content content : contents) {
            ContentSummeryDto summeryDto = new ContentSummeryDto(content);
            contentSummeryDtos.add(summeryDto);
        }
        return contentSummeryDtos;
    }

    //Col6RightTop
    private List<BoxContent> getCol6RightTopContents(Long menuId) {
        Menu menu = menuService.findOne(menuId);
        List<Box> boxes = boxService.findByMenu(menu);
        List<BoxContent> boxContents = new ArrayList<>();
        for (Box box : boxes)
            if (box.getBoxType().equals("Col6RightTop")) {
                List<Content> items = contentService.findTop1ByBoxOrderByIdDesc(box);
                boxContents.add(createBoxContent(box, items));
            }
        return boxContents;
    }

    //Col6RightMiddle
    private List<BoxContent> getCol6RightMiddleContents(Long menuId) {

        Menu menu = menuService.findOne(menuId);
        List<Box> boxes = boxService.findByMenu(menu);
        List<BoxContent> boxContents = new ArrayList<>();
        for (Box box : boxes) {
            if (box.getBoxType().equals("Col6RightMiddle")) {
                List<Content> items = contentService.findTop10ByBoxOrderByIdDesc(box);
                boxContents.add(createBoxContent(box, items));
            }
        }
        return boxContents;
    }

    //Col6RightBottom
    private List<BoxContent> getCol6RightBottomContents(Long menuId) {
        Menu menu = menuService.findOne(menuId);
        List<Box> boxes = boxService.findByMenu(menu);
        List<BoxContent> boxContents = new ArrayList<>();
        for (Box box : boxes) {
            if (box.getBoxType().equals("Col6RightBottom")) {

                List<Content> items = contentService.findTop10ByBoxOrderByIdDesc(box);
                boxContents.add(createBoxContent(box, items));
            }
        }
        return boxContents;
    }

    //col3Left1Top
    private List<BoxContent> getCol3Left1TopContents(Long menuId) {
        Menu menu = menuService.findOne(menuId);
        List<Box> boxes = boxService.findByMenu(menu);
        List<BoxContent> boxContents = new ArrayList<>();
        for (Box box : boxes) {
            if (box.getBoxType().equals("Col3Left1Top")) {
                List<Content> items = contentService.findTop10ByBoxOrderByIdDesc(box);
                boxContents.add(createBoxContent(box, items));
            }
        }
        return boxContents;
    }

    private List<BoxContent> getCol3left1middleContents(Long menuId) {
        Menu menu = menuService.findOne(menuId);
        List<Box> boxes = boxService.findByMenu(menu);
        List<BoxContent> boxContents = new ArrayList<>();
        for (Box box : boxes) {
            if (box.getBoxType().equals("Col3left1middle")) {
                List<Content> items = contentService.findTop10ByBoxOrderByIdDesc(box);
                boxContents.add(createBoxContent(box, items));
            }
        }
        return boxContents;
    }

    //Col3left1bottom
    private List<BoxContent> getCol3left1bottomContents(Long menuId) {

        Menu menu = menuService.findOne(menuId);
        List<Box> boxes = boxService.findByMenu(menu);
        List<BoxContent> boxContents = new ArrayList<>();
        for (Box box : boxes) {
            if (box.getBoxType().equals("Col3left1bottom")) {

                List<Content> items = contentService.findTop10ByBoxOrderByIdDesc(box);
                boxContents.add(createBoxContent(box, items));
            }
        }
        return boxContents;
    }


    private Content getStaticPage(Long menuId) {
        Menu menu = menuService.findOne(menuId);
        List<Box> boxes = boxService.findByMenu(menu);
        for (Box box : boxes) {
            if (box.getBoxType().equals("SinglePage")) {
                List<Content> items = contentService.findTop1ByBoxOrderByIdDesc(box);
                if (items.size() > 0)
                    return items.get(0);
            }
        }
        return null;
    }


    @RequestMapping(value = {"/home", "/"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getPage(Model model) {
        long id = 0;
        List<Setting> li = (List<Setting>) settingService.findAll();
        if (li.size() > 0) {
            id = Long.parseLong(li.get(0).getMainPageUrl());
        }
        model.addAttribute("page", menuService.findOne(id));
        model.addAttribute("col6RightTop", getCol6RightTopContents(id));
        model.addAttribute("col6RightMiddle", getCol6RightMiddleContents(id));
        model.addAttribute("col6RightBottom", getCol6RightBottomContents(id));
        model.addAttribute("col3Left1Top", getCol3Left1TopContents(id));
        model.addAttribute("col3left1middle", getCol3left1middleContents(id));
        model.addAttribute("col3left1bottom", getCol3left1bottomContents(id));
        model.addAttribute("sliders", getCol6RightSliderContents(id));
        Content staticPage = getStaticPage(id);
        model.addAttribute("StaticPage", staticPage);
        return "/front/home";
    }

    @RequestMapping(value = {"/page/{id}", "/page/{id}/{title}"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getPage(@PathVariable("id") Long id, @PathVariable(value = "title", required = false) String title, Model model) {
        model.addAttribute("page", menuService.findOne(id));
        model.addAttribute("col6RightTop", getCol6RightTopContents(id));
        model.addAttribute("col6RightMiddle", getCol6RightMiddleContents(id));
        model.addAttribute("col6RightBottom", getCol6RightBottomContents(id));
        model.addAttribute("col3Left1Top", getCol3Left1TopContents(id));
        model.addAttribute("col3left1middle", getCol3left1middleContents(id));
        model.addAttribute("col3left1bottom", getCol3left1bottomContents(id));
        model.addAttribute("sliders", getCol6RightSliderContents(id));
        Content staticPage = getStaticPage(id);
        model.addAttribute("StaticPage", staticPage);
        return "front/contents/page";
    }


    @RequestMapping(value = {"/contents/{id}", "/contents/{id}/{title}"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(@PathVariable("id") Long id, @PathVariable(value = "title", required = false) String title, Model model) {
        Content content = contentService.findByTime(id);
        if (!content.getPublished()) {
            throw new JvparsException("404 Not found");
        }
        content.setViewCount(content.getViewCount() + 1);
        Content newContent = contentService.save(content);
        Menu menu = content.getBox().getMenu();
        List<Content> contents = contentService.CustomQueryByMenu(menu);
        List<Content> relatedBoxContents = contentService.findTop10ByBoxOrderByIdDesc(content.getBox());
        List<Comment> comments = commentService.findAllByContentAndConfirmedIsTrue(content);

        String[] tags = content.getMeta().split("،");
        model.addAttribute("content", newContent);
        model.addAttribute("lastContent", convertContentDto(contents));
        model.addAttribute("relatedContents", convertContentDto(relatedBoxContents));
        model.addAttribute("comments", comments);
        model.addAttribute("tags", tags);
        //  MyArgUtils.print("tags : " + tags);
        return "front/contents/content";
    }

    @RequestMapping(value = {"/box-archive/{id}"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String boxArchive(@PathVariable("id") Long id, Model model, @PageableDefault(size = 8) Pageable pageable) {

        Box box = boxService.findOne(id);
        Page page = contentService.findAllByBox(pageable, box);
        List<Content> contents = contentService.findTop10ByPublishedIsTrueOrderByIdDesc();
        model.addAttribute("box", box);
        model.addAttribute("page", page);
        model.addAttribute("contents", convertContentDto(contents));
        return "front/contents/boxArchive";
    }


    @RequestMapping(value = {"/news-tags"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String tagContents(@RequestParam("tag") String tag, Model model, @PageableDefault(size = 8) Pageable pageable) {

        Page<Content> contents = contentService.findByMeta("%" + tag + "%", pageable);
        model.addAttribute("items", contents);
        model.addAttribute("tag", tag);
        return "front/contents/newsTags";
    }

    @RequestMapping(value = {"/user-contents/{id}"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String userContents(@PathVariable("id") Long id, Model model, @PageableDefault(size = 8) Pageable pageable) {

        SysUser user = userService.findOne(id);
        Page<Content> contents = contentService.findAllBySysUser(user, pageable);
        model.addAttribute("user", user);
        model.addAttribute("items", contents);
        return "front/contents/userContents";
    }


}
