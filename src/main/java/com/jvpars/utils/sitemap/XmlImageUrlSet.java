package com.jvpars.utils.sitemap;


import javax.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.Collection;


@XmlAccessorType(value = XmlAccessType.NONE)
@XmlRootElement(name = "urlset", namespace = "http://www.sitemaps.org/schemas/sitemap/0.9")
public class XmlImageUrlSet {

    @XmlElements({@XmlElement(name = "url", type = XmlImageUrl.class)})
    private Collection<XmlImageUrl> xmlUrls = new ArrayList<>();

    public void addUrl(XmlImageUrl element) {
        xmlUrls.add(element);
    }

    public Collection<XmlImageUrl> getXmlUrls() {
        return xmlUrls;
    }

    public void setXmlUrls(Collection<XmlImageUrl> xmlUrls) {
        this.xmlUrls = xmlUrls;
    }
}
