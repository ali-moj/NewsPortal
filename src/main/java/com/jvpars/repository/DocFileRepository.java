package com.jvpars.repository;

import com.jvpars.domain.DocFolder;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import com.jvpars.domain.DocFile;

import java.util.List;

/**
 * Created by ali on 2/8/17.
 */

@Repository
public interface DocFileRepository extends CrudRepository<DocFile, Long>, DocFileRepositoryCustom {

    List<DocFile> findByDocFolderOrderByIdDesc(DocFolder docFolder);

}
