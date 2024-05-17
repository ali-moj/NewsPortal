package com.jvpars.dto;

import java.util.List;

public class PageContentDto {
    public Long total;
    public Integer pageCount;
    public Integer currentPage;

    public List<ContentSummeryDto> items  ;
}
