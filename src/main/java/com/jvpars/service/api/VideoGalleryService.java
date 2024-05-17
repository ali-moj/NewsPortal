package com.jvpars.service.api;

import com.jvpars.domain.VideoGallery;
import com.jvpars.utils.GlobalSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface VideoGalleryService {
    @Transactional(readOnly = false)
    public abstract VideoGallery save(VideoGallery entity);

    @Transactional(readOnly = false)
    public abstract void delete(Long id);

    public abstract Iterable<VideoGallery> findAll();

    public abstract VideoGallery findOne(Long id);

    public abstract long count();

    public abstract Page<VideoGallery> findAll(GlobalSearch globalSearch, Pageable pageable);


    public abstract List<VideoGallery> findTop7ByOrderByIdDesc();

    Page<VideoGallery> findByPage(Pageable pageable);
}
