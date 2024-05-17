package com.jvpars.web.formatters;

import com.jvpars.domain.Comment;
import com.jvpars.service.api.CommentService;
import org.springframework.format.Formatter;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.util.Locale;


public class CommentFormatter implements Formatter<Comment> {

    @Autowired
    public CommentService commentService;


    public Comment parse(String text, Locale locale) {
        if (text == null || !StringUtils.hasText(text)) {
            return null;
        }
        Long id = Long.valueOf(text);
        return commentService.findOne(id);
    }

    public String print(Comment comment, Locale locale) {
        return comment.toString();

    }
}