package com.jvpars.utils;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by ali
 */
@XmlAccessorType(value = XmlAccessType.NONE)
@XmlRootElement(name = "url")
public class XmlUrl {


    @XmlElement
    private String loc;

    @XmlElement
    private String lastmod;



    public XmlUrl() {
    }

    public XmlUrl(String loc,String lastmod) {
        this.loc = loc;
        this.lastmod=lastmod;

    }

    public String getLoc() {
        return loc;
    }


    public String getLastmod() {
        return lastmod;
    }
}