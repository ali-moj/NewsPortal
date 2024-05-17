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
public class ContentAlbum extends BaseEntity {


    private boolean deleted;
    @ManyToOne
    private Content content;
    @NotNull
    private String albumImage;
}
