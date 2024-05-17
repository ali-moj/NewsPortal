package com.jvpars.dto;

import java.util.List;

public class BoxContent {

    public List<ContentSummeryDto> getContents() {
        return contents;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public void setContents(List<ContentSummeryDto> contents) {

        this.contents = contents;
    }

    private List<ContentSummeryDto> contents ;
    private String title;
    private Long id;
    private Integer priority;
}
