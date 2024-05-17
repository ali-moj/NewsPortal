package com.jvpars.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import com.jvpars.domain.DocFolder;

import java.util.List;

/**
 * Created by ali on 2/8/17.
 */

@Repository
public interface DocFolderRepository extends CrudRepository<DocFolder, Long>, DocFolderRepositoryCustom {

    List<DocFolder> findAllByParentFolderIsNull();

    DocFolder findByFolderName(String folderName);
}
