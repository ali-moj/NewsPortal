package com.jvpars.repository;

import com.jvpars.domain.Comment;
import com.jvpars.domain.QComment;
import com.jvpars.utils.GlobalSearch;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.JPQLQuery;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Property;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.LogicalExpression;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;


@Transactional(readOnly = true)
public class CommentRepositoryImpl extends QuerydslRepositorySupport implements CommentRepositoryCustom {

    CommentRepositoryImpl() {
        super(Comment.class);
    }


    private JPQLQuery getQueryFrom(QComment qEntity) {
        return from(qEntity);
    }

    public Page<Comment> findAll(GlobalSearch globalSearch, Pageable pageable) {
        QComment comment = QComment.comment;
        JPQLQuery query = from(comment);


        BooleanBuilder where = new BooleanBuilder();
        if (globalSearch != null) {
            String txt = globalSearch.getText();
            where.and(
                    comment.commentText.like("%".concat(txt).concat("%"))
                            .or(comment.createdDate.eq(txt))
                            .or(comment.content.title.like("%".concat(txt).concat("%")))
                            .or(comment.senderName.like("%".concat(txt).concat("%")))

            );
        }
        query.where(where);
        long totalFound = query.fetchCount();
        query.orderBy(comment.createdDate.desc());
        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    Order direction = order.isAscending() ? Order.ASC : Order.DESC;
                    switch (((order.getProperty()))) {
                        case "commentText":
                            query.orderBy(new OrderSpecifier<String>(direction, comment.commentText));
                            break;
                        case "createdDate":
                            query.orderBy(new OrderSpecifier<String>(direction, comment.createdDate));
                            break;

                    }
                }
            }
            query.offset(pageable.getOffset()).limit(pageable.getPageSize());
        }

        List<Comment> results = query.fetch();
        return new PageImpl<Comment>(results, pageable, totalFound);
    }

}