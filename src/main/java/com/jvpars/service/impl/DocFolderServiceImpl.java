package com.jvpars.service.impl;

import com.jvpars.repository.DocFolderRepository;
import com.jvpars.service.api.DocFolderService;

import com.jvpars.utils.FindOS;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.domain.DocFolder;

import java.io.File;
import java.util.List;

import com.jvpars.utils.MyArgUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by ali on 2/8/17.
 */

@Service
@Transactional(readOnly = true)
public class DocFolderServiceImpl implements DocFolderService {

    public   static String IMAGE_GALLERY="ImageGallery";
    String filePathToGraphsDir= FindOS.getFileDirectory();



    @Autowired
    public DocFolderRepository repository;

    @Transactional(readOnly = false)
    public DocFolder save(DocFolder entity) {
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Iterable<DocFolder> findAll() {
        return repository.findAll();
    }

    public DocFolder findOne(Long id) {
        return repository.findById(id).get();
    }

    public long count() {
        return repository.count();
    }


    public Page<DocFolder> findAll(GlobalSearch globalSearch, Pageable pageable) {
        return repository.findAll(globalSearch, pageable);
    }

    @Override
    public DocFolder createImageGalleryDirectoryIfNotExist() {

        DocFolder d = repository.findByFolderName(IMAGE_GALLERY);
        if(d==null ){
            DocFolder imageGallery = new DocFolder();
            imageGallery.setParentFolder(null);
            imageGallery.setFolderName(IMAGE_GALLERY);
            imageGallery.setFolderPath(filePathToGraphsDir+File.separator+IMAGE_GALLERY);
            MyArgUtils.folderCreateIfNotExist(filePathToGraphsDir+File.separator+IMAGE_GALLERY);
           return   repository.save(imageGallery);
        }
        else{
            return d;
        }
    }

    public  List<DocFolder> findAllByParentFolderIsNull(){
        return repository.findAllByParentFolderIsNull();
    }

/*
public Long countBySysUserId(Long id) {
   return repository.countBySysUserId(id);
}

public Page<DocFolder> findAllBySysUser(SysUser sysUserField, GlobalSearch globalSearch, Pageable pageable) {
   return repository.findAllBySysUser(sysUserField, globalSearch, pageable);
}
*/

}
