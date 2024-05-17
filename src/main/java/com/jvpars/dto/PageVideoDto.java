package com.jvpars.dto;

import java.util.List;

public class PageVideoDto {
    public Long total;
    public Integer pageCount;
    public Integer currentPage;

    public List<VideoDto> items  ;
}
