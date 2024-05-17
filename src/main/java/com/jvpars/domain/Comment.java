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
public class Comment extends  BaseEntity {

    private boolean deleted;

    @NotNull
    private String senderName;

    @NotNull
    @Lob
    private String commentText;

    @ManyToOne
    private  Content content;

    private boolean confirmed;

    private String createdDate;

    private Long createdDateL;


    @PreUpdate
    @PrePersist
    public void addPostCost()  {
        createdDateL= MyArgUtils.nowEpoch();
    }
}
