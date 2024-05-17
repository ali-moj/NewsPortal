package com.jvpars.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Slider extends  BaseEntity{
    @NotNull(message="این فیلد را فراموش کرده اید")
    public String mainImage;
    @NotNull(message="این فیلد را فراموش کرده اید")
    public String title;
    @NotNull(message="این فیلد را فراموش کرده اید")
    public String caption;


}
