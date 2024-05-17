package com.jvpars.domain;

import lombok.Data;

import javax.persistence.*;

/**
 * Created by ali on 3/25/17.
 */
@Data
@MappedSuperclass
public class BaseEntity {

    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    @Column(name = "id")
    private Long id;


    @Version
    @Column(name = "version")
    private Integer version;

/*    protected LinkedHashMap<String, String> properties = new LinkedHashMap<String, String>();

    public Map<String, String> getProperties() {
        return properties;
    }

    public void setProperties(LinkedHashMap<String, String> properties) {
        this.properties = properties;
    }*/

}