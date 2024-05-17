package com.jvpars.dto;


import com.jvpars.domain.ImageGallery;

public class GalleryDto {

    public GalleryDto() {
    }

    public GalleryDto(ImageGallery gallery) {
        this.id = gallery.getId();
        this.title = gallery.getTitle();
        this.finglisTitle = gallery.getFinglisTitle();
        this.mainImageUrl = gallery.getMainImageUrl();
        this.createdDate = gallery.getCreatedDate();
        this.userName = gallery.getSysUser().getFullName();
    }

    public Long id;
    public String title;
    public String finglisTitle;
    public String mainImageUrl ;
    public String createdDate;
    public String userName;

}
