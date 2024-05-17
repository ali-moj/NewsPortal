package com.jvpars.domain;

import com.jvpars.utils.MyArgUtils;
import com.jvpars.utils.ViewType.RichTextType;
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
@Table(indexes = { @Index(name = "EPOCH_IDX", columnList = "createdDateL" , unique = true)}  )
public class Content extends BaseEntity {


    @ManyToOne
    private Box box;

    private boolean deleted;

    @NotNull
    private String title;

    private String mainImage;

    @Lob
    @NotNull
    @RichTextType
    private String pageSummery;

    @NotNull
    @Lob
    @RichTextType
    private String bodyText;

    private String meta;

    private String createdDate;

    @Column(unique = true)
    private Long createdDateL;



    @ManyToOne
    private SysUser sysUser;

    private Integer viewCount = 0;

    private Boolean published = false;

}
