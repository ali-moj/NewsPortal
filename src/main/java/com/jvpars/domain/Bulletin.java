package com.jvpars.domain;

import com.jvpars.utils.MyArgUtils;
import com.jvpars.utils.ViewType.PersianDateType;
import com.jvpars.utils.ViewType.RichTextType;
import lombok.*;
import org.springframework.beans.factory.annotation.Required;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Bulletin extends BaseEntity {



    @NotNull
    public String title;

    @NotNull
    private String mainImage ;

    @NotNull
    @PersianDateType
    private String createdDate;

    private Long createdDateL;

    @NotNull
    @PersianDateType
    private String expirationDate;

    private Long expirationDateL;

    @NotNull
    @RichTextType
    @Lob
    private String bodyText;

    @PreUpdate
    @PrePersist
    public void addPostCost()  {
        createdDateL = MyArgUtils.nowEpoch();
        expirationDateL = MyArgUtils.nowEpoch();
    }


}
