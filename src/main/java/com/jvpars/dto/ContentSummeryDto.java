package com.jvpars.dto;

import com.jvpars.domain.Content;
import lombok.Data;

@Data
public class ContentSummeryDto {

    public ContentSummeryDto() {
    }

    public ContentSummeryDto(Content content) {
        id = content.getId();
        title = content.getTitle();
        publishDate = content.getCreatedDate();
        summery = content.getPageSummery();
        mainImage = content.getMainImage();
        createdDateL = content.getCreatedDateL();
        if (content.getSysUser() != null) {
            author = content.getSysUser().getFullName();
            userId = content.getSysUser().getId();
        }
    }

    private Long id;
    private String title;
    private String summery;
    private String mainImage;
    private String author;
    private String publishDate;
    private Long createdDateL;
    private Long userId;
}
