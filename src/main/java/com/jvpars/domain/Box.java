package com.jvpars.domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Box extends  BaseEntity {

    @NotNull
    @ManyToOne
    Menu menu;

    @NotNull
    String  boxType;

    @NotNull
    private String name;

    @NotNull
    private Integer priority;

    private String mainImage;

    @Override
    public String toString() {
        return String.format("%s - %s - %s" , menu.getTitle() , boxType , name);
    }

    @Transient
    String select2;

    @PostLoad
    public void select2Chooser() {
        this.select2 = this.toString();
    }

}
