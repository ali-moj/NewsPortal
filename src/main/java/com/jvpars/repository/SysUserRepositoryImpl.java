package com.jvpars.repository;

import com.jvpars.domain.QSysUser;
import com.jvpars.domain.SysUser;
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
public class SysUserRepositoryImpl extends QuerydslRepositorySupport implements SysUserRepositoryCustom {



    SysUserRepositoryImpl() {
        super(SysUser.class);
    }


    private JPQLQuery getQueryFrom(QSysUser qEntity) {
        return from(qEntity);
    }

    public Page<SysUser> findAll(GlobalSearch globalSearch, Pageable pageable) {
        QSysUser sysUser = QSysUser.sysUser;
        JPQLQuery query = from(sysUser);


        BooleanBuilder where = new BooleanBuilder();
        if (globalSearch != null) {
            String txt = globalSearch.getText();
            where.and(
                    sysUser.fullName.like("%".concat(txt).concat("%"))
                            .or(sysUser.email.contains(txt))
            );
        }
        query.where(where);
        long totalFound = query.fetchCount();
        query.orderBy(sysUser.createdDate.desc());
        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    Order direction = order.isAscending() ? Order.ASC : Order.DESC;
                    switch(((order.getProperty()))) {
                        case "fullName":
                            query.orderBy(new OrderSpecifier<String>(direction, sysUser.fullName));
                            break;
                        case "email":
                            query.orderBy(new OrderSpecifier<String>(direction, sysUser.email));
                            break;

                    }
                }
            }
            query.offset(pageable.getOffset()).limit(pageable.getPageSize());
        }

        List<SysUser> results = query.fetch();
        return new PageImpl<SysUser>(results, pageable, totalFound);
    }



}