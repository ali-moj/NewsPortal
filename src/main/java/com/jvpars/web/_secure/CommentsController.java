package com.jvpars.web._secure;

import com.jvpars.utils.DatatablesData;
import com.jvpars.utils.DatatablesPageable;
import com.jvpars.utils.HtmlBuilder;
import com.jvpars.utils.MapWrapper;

import com.jvpars.domain.Comment;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.service.api.CommentService;


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

@RequestMapping("/_secure/comments")
@Controller
@Secured("ROLE_ADMIN")
public class CommentsController {


    @Autowired
    public CommentService commentService;

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(Comment.class)
                .drop("id")
                .drop("version")
                .drop("content")
                .drop("deleted")
                .drop("createdDateL")
                .html()
                .build();

        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "_secure/comments/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<Comment> list(GlobalSearch search, Pageable pageable) {
        Page<Comment> comment = commentService.findAll(search, pageable);
        return comment;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<Comment> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<Comment> comment = list(search, pageable);
        long allAvailableComment = commentService.count();
        return new DatatablesData<Comment>(comment, allAvailableComment, draw);
    }

    @RequestMapping(value = "/confirm-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(@PathVariable("id") Long id) {
        Comment comment =  commentService.findOne(id);
        comment.setConfirmed(true);
        commentService.save(comment);
        return "redirect:/_secure/comments/";
    }






    @RequestMapping(value = "delete/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        commentService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/comments/";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("comment", commentService.findOne(id));
        return "_secure/comments/show";
    }


    void populateForm(Model uiModel, Comment comment) {
        uiModel.addAttribute("comment", comment);
    }
}