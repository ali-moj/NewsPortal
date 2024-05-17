package com.jvpars.repository;

import com.jvpars.domain.Content;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import com.jvpars.domain.Comment;

import java.util.List;

/**
 * Created by ali on 2/8/17.
 */

@Repository
public interface CommentRepository extends CrudRepository<Comment, Long>, CommentRepositoryCustom {

    List<Comment> findAllByContentAndConfirmedIsTrue(Content content);

    List<Comment> findTop5ByConfirmedIsFalseOrderByIdDesc();
}
