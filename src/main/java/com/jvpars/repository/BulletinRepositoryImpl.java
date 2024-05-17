package com.jvpars.repository;


import com.jvpars.domain.Bulletin;
import com.jvpars.domain.QBulletin;
import com.jvpars.utils.GlobalSearch;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.JPQLQuery;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.LogicalExpression;
import org.hibernate.criterion.Property;
import org.hibernate.criterion.Restrictions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class BulletinRepositoryImpl extends QuerydslRepositorySupport implements BulletinRepositoryCustom {



    BulletinRepositoryImpl() {
        super(Bulletin.class);
    }

    private JPQLQuery getQueryFrom(QBulletin qEntity) {
        return from(qEntity);
    }

    public Page<Bulletin> findAll(GlobalSearch globalSearch, Pageable pageable) {
        QBulletin bulletin = QBulletin.bulletin;
        JPQLQuery query = from(bulletin);


        BooleanBuilder where = new BooleanBuilder();
        if (globalSearch != null) {
            String txt = globalSearch.getText();
            where.and(
                    bulletin.title.like("%".concat(txt).concat("%"))
                            .or(bulletin.createdDate.eq(txt))
            );
        }
        query.where(where);
        long totalFound = query.fetchCount();
        query.orderBy(bulletin.createdDate.desc());
        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    Order direction = order.isAscending() ? Order.ASC : Order.DESC;
                    switch(((order.getProperty()))) {
                        case "title":
                            query.orderBy(new OrderSpecifier<String>(direction, bulletin.title));
                            break;
                        case "createdDate":
                            query.orderBy(new OrderSpecifier<String>(direction, bulletin.createdDate));
                            break;

                    }
                }
            }
            query.offset(pageable.getOffset()).limit(pageable.getPageSize());
        }
        List<Bulletin> results = query.fetch();
        return new PageImpl<Bulletin>(results, pageable, totalFound);
    }

}
