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
public class ImageGallery extends BaseEntity {


    private boolean deleted;

    @NotNull
    private String title;

    @NotNull
    private String finglisTitle;

    private String mainImageUrl;

    private String meta;
    @Lob
    private String description;

    private String createdDate;

    private Long createdDateL;

    @PreUpdate
    @PrePersist
    public void addPostCost() {
        createdDateL = MyArgUtils.nowEpoch();
        if (title != null)
            finglisTitle = MyArgUtils.toPrettyURLWithPersianScape(title);
    }

    @ManyToOne
    private SysUser sysUser;

    @ManyToOne
    DocFolder docFolder;

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("ImageGallery{");
        sb.append("deleted=").append(deleted);
        sb.append(", title='").append(title).append('\'');
        sb.append(", finglisTitle='").append(finglisTitle).append('\'');
        sb.append(", mainImageUrl='").append(mainImageUrl).append('\'');
        sb.append(", meta='").append(meta).append('\'');
        sb.append(", description='").append(description).append('\'');
        sb.append(", createdDate='").append(createdDate).append('\'');
        sb.append(", createdDateL=").append(createdDateL);
        sb.append(", sysUser=").append(sysUser);
        sb.append(", docFolder=").append(docFolder);
        sb.append('}');
        return sb.toString();
    }
}
