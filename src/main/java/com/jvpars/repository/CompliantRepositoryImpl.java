package com.jvpars.repository;

import com.jvpars.domain.Compliant;
import com.jvpars.domain.QCompliant;
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
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Transactional(readOnly = true)
public class CompliantRepositoryImpl extends QuerydslRepositorySupport implements CompliantRepositoryCustom {


    CompliantRepositoryImpl() {
        super(Compliant.class);
    }


    private JPQLQuery getQueryFrom(QCompliant qEntity) {
        return from(qEntity);
    }

    public Page<Compliant> findAll(GlobalSearch globalSearch, Pageable pageable) {
        QCompliant compliant = QCompliant.compliant;
        JPQLQuery query = from(compliant);


        BooleanBuilder where = new BooleanBuilder();
        if (globalSearch != null) {
            String txt = globalSearch.getText();
            where.and(
                    compliant.email.like("%".concat(txt).concat("%"))
            );
        }
        query.where(where);
        long totalFound = query.fetchCount();
        query.orderBy(compliant.createdDate.desc());
        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    Order direction = order.isAscending() ? Order.ASC : Order.DESC;
                    switch(((order.getProperty()))) {
                        case "email":
                            query.orderBy(new OrderSpecifier<String>(direction, compliant.email));
                            break;

                    }
                }
            }
            query.offset(pageable.getOffset()).limit(pageable.getPageSize());
        }

        List<Compliant> results = query.fetch();
        return new PageImpl<Compliant>(results, pageable, totalFound);
    }


}
