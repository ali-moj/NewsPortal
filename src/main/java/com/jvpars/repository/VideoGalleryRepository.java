package com.jvpars.repository;

import com.jvpars.domain.VideoGallery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoGalleryRepository extends CrudRepository<VideoGallery, Long>, VideoGalleryRepositoryCustom {

    List<VideoGallery> findTop7ByOrderByIdDesc();
    Page<VideoGallery> findAll(Pageable pageable);
}
