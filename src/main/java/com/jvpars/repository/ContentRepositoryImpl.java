package com.jvpars.repository;

import com.jvpars.domain.Content;
import com.jvpars.domain.QContent;
import com.jvpars.domain.SysUser;
import com.jvpars.utils.GlobalSearch;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


@Transactional(readOnly = true)
public class ContentRepositoryImpl extends QuerydslRepositorySupport implements ContentRepositoryCustom {


    ContentRepositoryImpl() {
        super(Content.class);
    }


    private JPQLQuery getQueryFrom(QContent qEntity) {
        return from(qEntity);
    }

    public Page<Content> findAll(GlobalSearch globalSearch, Pageable pageable) {
        QContent content = QContent.content;
        JPQLQuery query = from(content);

        BooleanBuilder where = new BooleanBuilder();
        if (globalSearch != null) {
            String txt = globalSearch.getText();
            where.and(
                    content.title.like("%".concat(txt).concat("%"))
                            .or(content.createdDate.eq(txt))
            );
        }
        query.where(where);
        long totalFound = query.fetchCount();
        query.orderBy(content.createdDate.desc());
        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    Order direction = order.isAscending() ? Order.ASC : Order.DESC;
                    switch(((order.getProperty()))) {
                        case "title":
                            query.orderBy(new OrderSpecifier<String>(direction, content.title));
                            break;
                        case "createdDate":
                            query.orderBy(new OrderSpecifier<String>(direction, content.createdDate));
                            break;

                    }
                }
            }
            query.offset(pageable.getOffset()).limit(pageable.getPageSize());
        }

        List<Content> results = query.fetch();
        return new PageImpl<Content>(results, pageable, totalFound);
    }

    public Page<Content> findAllByUser(GlobalSearch globalSearch, Pageable pageable , SysUser user) {
        QContent content = QContent.content;
        JPQLQuery query = from(content);

        BooleanBuilder where = new BooleanBuilder();
        where.and(content.sysUser.id.eq(user.getId()));
        if (globalSearch != null) {
            String txt = globalSearch.getText();
            where.and(
                    content.title.like("%".concat(txt).concat("%"))
                            .or(content.createdDate.eq(txt))
            );
        }
        query.where(where);
        long totalFound = query.fetchCount();
        query.orderBy(content.createdDate.desc());
        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    Order direction = order.isAscending() ? Order.ASC : Order.DESC;
                    switch(((order.getProperty()))) {
                        case "title":
                            query.orderBy(new OrderSpecifier<String>(direction, content.title));
                            break;
                        case "createdDate":
                            query.orderBy(new OrderSpecifier<String>(direction, content.createdDate));
                            break;

                    }
                }
            }
            query.offset(pageable.getOffset()).limit(pageable.getPageSize());
        }

        List<Content> results = query.fetch();
        return new PageImpl<Content>(results, pageable, totalFound);
    }

    public Page<Content> findAllUnpublished(GlobalSearch globalSearch, Pageable pageable) {
        QContent content = QContent.content;
        JPQLQuery query = from(content);

        BooleanBuilder where = new BooleanBuilder();
        where.and(content.published.eq(false));
        if (globalSearch != null) {
            String txt = globalSearch.getText();
            where.and(
                    content.title.like("%".concat(txt).concat("%"))
                            .or(content.createdDate.eq(txt))
            );
        }
        query.where(where);
        long totalFound = query.fetchCount();
        query.orderBy(content.createdDate.desc());
        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    Order direction = order.isAscending() ? Order.ASC : Order.DESC;
                    switch(((order.getProperty()))) {
                        case "title":
                            query.orderBy(new OrderSpecifier<String>(direction, content.title));
                            break;
                        case "createdDate":
                            query.orderBy(new OrderSpecifier<String>(direction, content.createdDate));
                            break;

                    }
                }
            }
            query.offset(pageable.getOffset()).limit(pageable.getPageSize());
        }

        List<Content> results = query.fetch();
        return new PageImpl<Content>(results, pageable, totalFound);
    }


}