package com.jvpars.repository;

import com.jvpars.domain.VideoGallery;
import com.jvpars.utils.GlobalSearch;
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
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Transactional(readOnly = true)
public class VideoGalleryRepositoryImpl implements VideoGalleryRepositoryCustom {
    @PersistenceContext
    protected EntityManager em;

    public Page<VideoGallery> findAll(GlobalSearch globalSearch, Pageable pageable) {
        Session session = em.unwrap(Session.class);
        Criteria criteria = session.createCriteria(VideoGallery.class);


        if (globalSearch != null) {
            String txt = globalSearch.getText();
            String search = "%".concat(txt).concat("%");

            Criterion x = Restrictions.like("title", search);
            Criterion y = Restrictions.like("createdDate", search);

            LogicalExpression orExp = Restrictions.or(x, y);
            criteria.add(orExp);

        }
        int totalFound = criteria.list().size();

        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    switch (((order.getProperty()))) {
                        case "title":
                            criteria.addOrder(Property.forName("title").desc());
                            break;

                        case "serialVersionUID":
                            criteria.addOrder(Property.forName("createdDate").desc());
                            break;

                        case "meta":
                            criteria.addOrder(Property.forName("meta").desc());
                            break;


                    }
                }
            }
            int firstResult = (int) pageable.getOffset();
            int sizeNo = pageable.getPageSize();
            criteria.setFirstResult(firstResult);
            criteria.setMaxResults(sizeNo);
        }
        return new PageImpl<VideoGallery>(criteria.list(), pageable, totalFound);
    }
}
