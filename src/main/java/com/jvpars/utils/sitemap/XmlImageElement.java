package com.jvpars.utils.sitemap;

import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.*;


@XmlAccessorType(value = XmlAccessType.NONE)
@XmlRootElement(name = "image", namespace = "http://www.google.com/schemas/sitemap-image/1.1")
public class XmlImageElement {

    public XmlImageElement(String loc) {
        this.loc = loc;
    }

    public XmlImageElement() {
    }

    public String getLoc() {
        return loc;
    }

    public void setLoc(String loc) {
        this.loc = loc;
    }

    @XmlElement
    private String loc;


}
