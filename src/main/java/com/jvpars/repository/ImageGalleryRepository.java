package com.jvpars.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import com.jvpars.domain.ImageGallery;

import java.util.List;

/**
 * Created by ali on 2/8/17.
 */

@Repository
public interface ImageGalleryRepository extends CrudRepository<ImageGallery, Long>, ImageGalleryRepositoryCustom {

    List<ImageGallery> findTop7ByOrderByIdDesc();

    Page<ImageGallery> findAll(Pageable pageable);
}
