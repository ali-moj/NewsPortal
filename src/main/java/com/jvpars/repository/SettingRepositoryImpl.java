package com.jvpars.repository;

import com.jvpars.domain.Setting;
import com.jvpars.utils.GlobalSearch;

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
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


@Transactional(readOnly = true)
public class SettingRepositoryImpl implements SettingRepositoryCustom {

    @PersistenceContext
    protected EntityManager em;

    public Page<Setting> findAll(GlobalSearch globalSearch, Pageable pageable) {
        Session session = em.unwrap(Session.class);
        Criteria criteria = session.createCriteria(Setting.class);


        if (globalSearch != null) {
            String txt = globalSearch.getText();
            String search = "%".concat(txt).concat("%");

            Criterion x = Restrictions.like("whiteLogo", search);
            Criterion y = Restrictions.like("telegramLink", search);

            LogicalExpression orExp = Restrictions.or(x, y);
            criteria.add(orExp);

        }
        int totalFound = criteria.list().size();

        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    switch (((order.getProperty()))) {
                        case "whiteLogo":
                            criteria.addOrder(Property.forName("whiteLogo").desc());
                            break;

                        case "telegramLink":
                            criteria.addOrder(Property.forName("telegramLink").desc());
                            break;


                        case "startDateSupport":
                            criteria.addOrder(Property.forName("startDateSupport").desc());
                            break;


                    }
                }
            }
            int firstResult = (int) pageable.getOffset();
            int sizeNo = pageable.getPageSize();
            criteria.setFirstResult(firstResult);
            criteria.setMaxResults(sizeNo);
        }
        return new PageImpl<Setting>(criteria.list(), pageable, totalFound);
    }


}