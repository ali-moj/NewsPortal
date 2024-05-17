package com.jvpars.dto;

import com.jvpars.domain.VideoGallery;

public class VideoDto {
    public VideoDto() {
    }

    public VideoDto(VideoGallery gallery) {
        this.id = gallery.getId();
        this.title = gallery.getTitle();
        this.mainImageUrl = gallery.getMainImageUrl();
        this.createdDate = gallery.getCreatedDate();
        this.userName = gallery.getSysUser().getFullName();
        this.videoUrl = gallery.getVideoUrl();
    }

    public Long id;
    public String title;
    public String mainImageUrl ;
    private String videoUrl;
    public String createdDate;
    public String userName;
}
