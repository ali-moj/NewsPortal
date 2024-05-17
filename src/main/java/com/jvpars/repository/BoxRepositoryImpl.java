package com.jvpars.repository;

import com.jvpars.domain.Box;
import com.jvpars.domain.QBox;
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
public class BoxRepositoryImpl extends QuerydslRepositorySupport implements BoxRepositoryCustom {

    BoxRepositoryImpl() {
        super(Box.class);
    }

    private JPQLQuery getQueryFrom(QBox qEntity) {
        return from(qEntity);
    }


    public Page<Box> findAll(GlobalSearch globalSearch, Pageable pageable) {
        QBox box = QBox.box;
        JPQLQuery query = from(box);


        BooleanBuilder where = new BooleanBuilder();
        if (globalSearch != null) {
            String txt = globalSearch.getText();
            where.and(
                    box.name.like("%".concat(txt).concat("%"))
                            .or(box.boxType.eq(txt))
            );
        }
        query.where(where);
        long totalFound = query.fetchCount();
        query.orderBy(box.id.desc());
        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    Order direction = order.isAscending() ? Order.ASC : Order.DESC;
                    switch(((order.getProperty()))) {
                        case "name":
                            query.orderBy(new OrderSpecifier<String>(direction, box.name));
                            break;
                        case "boxType":
                            query.orderBy(new OrderSpecifier<String>(direction, box.boxType));
                            break;

                    }
                }
            }
            query.offset(pageable.getOffset()).limit(pageable.getPageSize());
        }

        List<Box> results = query.fetch();
        return new PageImpl<Box>(results, pageable, totalFound);
    }


}