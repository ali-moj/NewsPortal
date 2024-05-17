package com.jvpars.repository;
import com.jvpars.domain.Menu;
import com.jvpars.utils.GlobalSearch;
import com.jvpars.utils.MyArgUtils;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Property;
import org.hibernate.criterion.Restrictions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


@Transactional(readOnly = true)
public class MenuRepositoryCustomImpl implements MenuRepositoryCustom {

    @PersistenceContext
    protected EntityManager em;

    public Page<Menu> findAll(GlobalSearch globalSearch, Pageable pageable) {
        Session session = em.unwrap(Session.class);
        Criteria criteria = session.createCriteria(Menu.class);


        if (globalSearch != null) {
            String txt = globalSearch.getText();
            String search = "%".concat(txt).concat("%");
            Criterion x = Restrictions.like("title", search);
            criteria.add(x);

        }
        int totalFound = criteria.list().size();

        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    switch (((order.getProperty()))) {
                        case "title":
                            criteria.addOrder(Property.forName("title").desc());
                            break;

                        case "arrangment":
                            criteria.addOrder(Property.forName("arrangment").desc());
                            break;

                    }
                }
            }
            long firstResult = pageable.getOffset();
            int sizeNo = pageable.getPageSize();
            criteria.setFirstResult((int)firstResult);
            criteria.setMaxResults(sizeNo);
        }
        return new PageImpl<Menu>(criteria.list(), pageable, totalFound);
    }

}
