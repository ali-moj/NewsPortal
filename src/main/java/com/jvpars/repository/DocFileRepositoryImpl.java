package com.jvpars.repository;

import com.jvpars.domain.DocFile;
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
public class DocFileRepositoryImpl implements DocFileRepositoryCustom {

    @PersistenceContext
    protected EntityManager em;

    public Page<DocFile> findAll(GlobalSearch globalSearch, Pageable pageable) {
        Session session = em.unwrap(Session.class);
        Criteria criteria = session.createCriteria(DocFile.class);


        if (globalSearch != null) {
            String txt = globalSearch.getText();
            String search = "%".concat(txt).concat("%");

            Criterion x = Restrictions.like("fileType", search);
            Criterion y = Restrictions.like("fileSize", search);

            LogicalExpression orExp = Restrictions.or(x, y);
            criteria.add(orExp);

        }
        int totalFound = criteria.list().size();

        if (pageable != null) {
            if (pageable.getSort() != null) {
                for (Sort.Order order : pageable.getSort()) {
                    switch (((order.getProperty()))) {
                        case "fileType":
                            criteria.addOrder(Property.forName("fileType").desc());
                            break;

                        case "fileSize":
                            criteria.addOrder(Property.forName("fileSize").desc());
                            break;


                        case "fileName":
                            criteria.addOrder(Property.forName("fileName").desc());
                            break;


                    }
                }
            }
            int firstResult = (int) pageable.getOffset();
            int sizeNo = pageable.getPageSize();
            criteria.setFirstResult(firstResult);
            criteria.setMaxResults(sizeNo);
        }
        return new PageImpl<DocFile>(criteria.list(), pageable, totalFound);
    }


}