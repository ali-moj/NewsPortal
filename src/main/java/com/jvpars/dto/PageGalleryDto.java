package com.jvpars.dto;

import java.util.List;

public class PageGalleryDto {
    public Long total;
    public Integer pageCount;
    public Integer currentPage;

    public List<GalleryDto> items  ;
}
