package com.jvpars.web.front;

import com.jvpars.domain.Box;
import com.jvpars.domain.Comment;
import com.jvpars.domain.Content;
import com.jvpars.dto.CommentDto;
import com.jvpars.service.api.CommentService;
import com.jvpars.service.api.ContentService;
import com.jvpars.utils.MyArgUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@Controller
public class CommentController {

    private CommentService commentService;
    private ContentService contentService;


    @Autowired
    CommentController(CommentService commentService , ContentService contentService) {
        this.commentService = commentService;
        this.contentService = contentService;
    }

    @RequestMapping(value = "/comments", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity saveComment(
            @RequestParam("contentId") String contentId,
            @RequestParam("commentText") String commentText,
            @RequestParam("senderName") String senderName,
            @RequestParam("captcha") String captcha,
            HttpSession session) {

        String sessionCaptcha =(String)session.getAttribute("CAPTCHA");
        if(sessionCaptcha==null || (sessionCaptcha!=null && !sessionCaptcha.toUpperCase().equals(captcha.toUpperCase()))){
          //  MyArgUtils.print("wrong captcha");
            return new ResponseEntity(HttpStatus.NOT_ACCEPTABLE);
        }else{
            Content content = contentService.findOne(Long.parseLong(contentId));
            Comment comment = Comment.builder()
                    .commentText(commentText)
                    .createdDateL(MyArgUtils.nowEpoch())
                    .content(content)
                    .confirmed(false)
                    .senderName(senderName)
                    .build();

            commentService.save(comment);
            return new ResponseEntity(HttpStatus.OK);
        }
    }
}
