package com.jvpars.utils;


import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by ali on 3/25/17.
 */
public class MapWrapper {
    private LinkedHashMap<String, String> properties = new LinkedHashMap<>();


    public Map<String, String> getProperties() {
        return properties;
    }

    public void setProperties(LinkedHashMap<String, String> properties) {
        this.properties = properties;
    }
}
