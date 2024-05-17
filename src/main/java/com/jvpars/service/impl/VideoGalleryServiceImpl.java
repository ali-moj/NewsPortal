package com.jvpars.service.impl;

import com.jvpars.domain.VideoGallery;
import com.jvpars.repository.VideoGalleryRepository;
import com.jvpars.service.api.VideoGalleryService;
import com.jvpars.utils.GlobalSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class VideoGalleryServiceImpl implements VideoGalleryService {
    @Autowired
    public VideoGalleryRepository repository;

    @Transactional(readOnly = false)
    public VideoGallery save(VideoGallery entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<VideoGallery> findAll() {
        return repository.findAll();
    }

    public VideoGallery findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<VideoGallery> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

    @Override
    public List<VideoGallery> findTop7ByOrderByIdDesc() {
        return repository.findTop7ByOrderByIdDesc();
    }

    @Override
    public Page<VideoGallery> findByPage(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
