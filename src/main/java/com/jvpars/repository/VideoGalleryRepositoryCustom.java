package com.jvpars.repository;

import com.jvpars.domain.VideoGallery;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VideoGalleryRepositoryCustom {
    public abstract Page<VideoGallery> findAll(GlobalSearch globalSearch, Pageable pageable);
}
