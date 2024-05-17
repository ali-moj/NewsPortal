package com.jvpars.utils.sitemap;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.*;
import javax.xml.stream.events.Namespace;
import java.util.ArrayList;
import java.util.Collection;

@XmlAccessorType(value = XmlAccessType.NONE)
@XmlRootElement(name = "url")
public class XmlImageUrl {
    public String getLoc() {
        return loc;
    }

    public void setLoc(String loc) {
        this.loc = loc;
    }

    public Collection<XmlImageElement> getElements() {
        return elements;
    }

    public void setElements(Collection<XmlImageElement> elements) {
        this.elements = elements;
    }

    @XmlElement
    private String loc;

    @XmlElements({@XmlElement(name = "image", type = XmlImageElement.class, namespace = "http://www.google.com/schemas/sitemap-image/1.1")})
    private Collection<XmlImageElement> elements = new ArrayList<>();
}
