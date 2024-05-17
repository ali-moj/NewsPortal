package com.jvpars.domain;

import com.jvpars.utils.MyArgUtils;
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
public class VideoGallery extends BaseEntity {


    private boolean deleted;

    @NotNull
    private String title;

    private String mainImageUrl ;

    private String videoUrl;

    private String meta ;

    private String createdDate;

    private Long createdDateL;

    @PreUpdate
    @PrePersist
    public void addPostCost()  {
        createdDateL = MyArgUtils.nowEpoch();
    }

    @ManyToOne
    private SysUser sysUser;
}
