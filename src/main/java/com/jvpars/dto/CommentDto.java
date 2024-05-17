package com.jvpars.dto;


import javax.validation.constraints.NotNull;

public class CommentDto {

    @NotNull
    private String senderName;
    @NotNull
    private String captcha;
    @NotNull
    private String commentText;
    @NotNull
    private Integer contentId;

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getCaptcha() {
        return captcha;
    }

    public void setCaptcha(String captcha) {
        this.captcha = captcha;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public Integer getContentId() {
        return contentId;
    }

    public void setContentId(Integer contentId) {
        this.contentId = contentId;
    }

    @Override
    public String toString() {
        return "CommentDto{" +
                "senderName='" + senderName + '\'' +
                ", captcha='" + captcha + '\'' +
                ", commentText='" + commentText + '\'' +
                ", contentId=" + contentId +
                '}';
    }
}
