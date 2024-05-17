package com.jvpars.domain;

import com.jvpars.selection.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Email;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Compliant extends  BaseEntity {
    @NotNull(message="این فیلد را فراموش کرده اید")
    @Email(message = "یک ایمیل صحیح وارد کنید")
    private String email;

    private String mobile;

    private String captcha;


    @Enumerated
    private Status status;

    @Lob
    @NotNull(message="این فیلد را فراموش کرده اید")
    private String note;
    private Long createdDate;


}
