package com.jvpars.utils;


import org.apache.commons.beanutils.BeanUtilsBean;
import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.InvocationTargetException;

public class BeanCopy extends BeanUtilsBean {

    private boolean copyBlankStrings = true;
    private boolean copyNulls = true;

    public BeanCopy() {
    }

    public BeanCopy(boolean copyNulls, boolean copyBlankStrings) {
        this.copyNulls = copyNulls;
        this.copyBlankStrings = copyBlankStrings;
    }

    @Override
    public void copyProperties(Object dest, Object orig) {
        try {
            super.copyProperties(dest, orig);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void copyProperty(Object bean, String name, Object value) throws IllegalAccessException,
            InvocationTargetException {
        if (!copyNulls && (value == null)) {
            return;
        }
        if (!copyBlankStrings && (value instanceof String)) {
            String strVal = (String) value;
            if (StringUtils.isBlank(strVal)) {
                return;
            }
        }
        super.copyProperty(bean, name, value);
    }

}