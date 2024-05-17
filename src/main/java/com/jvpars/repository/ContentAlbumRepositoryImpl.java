package com.jvpars.repository;

import com.jvpars.domain.ContentAlbum;
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
public class ContentAlbumRepositoryImpl implements ContentAlbumRepositoryCustom {

    @PersistenceContext
    protected EntityManager em;

    public Page<ContentAlbum> findAll(GlobalSearch globalSearch, Pageable pageable) {
        Session session = em.unwrap(Session.class);
        Criteria criteria = session.createCriteria(ContentAlbum.class);


        if (globalSearch != null) {
            String txt = globalSearch.getText();
            String search = "%".concat(txt).concat("%");

            Criterion x = Restrictions.like("properties", search);
            Criterion y = Restrictions.like("albumImage", search);

            LogicalExpression orExp = Restrictions.or(x, y);
            criteria.add(orExp);

        }
        int totalFound = criteria.list().size();

        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    switch (((order.getProperty()))) {
                        case "properties":
                            criteria.addOrder(Property.forName("properties").desc());
                            break;

                        case "albumImage":
                            criteria.addOrder(Property.forName("albumImage").desc());
                            break;


                        case "":
                            criteria.addOrder(Property.forName("").desc());
                            break;


                    }
                }
            }
            int firstResult = (int) pageable.getOffset();
            int sizeNo = pageable.getPageSize();
            criteria.setFirstResult(firstResult);
            criteria.setMaxResults(sizeNo);
        }
        return new PageImpl<ContentAlbum>(criteria.list(), pageable, totalFound);
    }


}