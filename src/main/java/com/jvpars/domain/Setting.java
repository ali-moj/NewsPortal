package com.jvpars.domain;

import com.jvpars.selection.Status;
import com.jvpars.utils.MyArgUtils;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Setting  extends  BaseEntity{

    static String blank =" data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKAP/2Q==";



    @Enumerated
    private Status newsStatus=Status.enable;

    @Enumerated
    private Status articleStatus=Status.enable;


    @Enumerated
    private Status aboutStatus=Status.enable;

    @Enumerated
    private Status contactStatus=Status.enable;

    public String getMainPageUrl() {
        return mainPageUrl;
    }

    public void setMainPageUrl(String mainPageUrl) {
        this.mainPageUrl = mainPageUrl;
    }

    private String mainPageUrl;

    @Lob
    private String logo=blank;

    @Lob
    private String whiteLogo=blank;

    @Lob
    private String favIcon=blank;

    @Lob
    private String panelIconWhite=blank;

    @Lob
    private String panelIconGray=blank;


    @Lob
    private String adminFaIcon=blank;


    @Lob
    private String googleLink="www.google.com";

    @Lob
    private String companyAddress1="-";

    @Lob
    private String companyAddress2="-";

    private String companyTel="-";

    private String companyFax="-";

    private String companyEmail="info@jvpars.com";

    private String siteTitle="-";

    private String siteAdress="www.jvpars.com";

    private String copyRight="-";


    private String startDateDomain;

    private String endDateDomain;

    private String startDateServer;

    private String endDateServer;

    private String startDateSupport;

    private String endDateSupport;

    private String mailProtocol="-";
    private String mailHost="-";
    private int mailPort=0;
    private Boolean mailSmtpStarttlsEnable=false;
    private String mailFrom="-";
    private String mailUsername="-";
    private String mailPassword="-";
    private String masterEmail="-";
    private String instagramLink="-";



    @Lob
    private String rule="-";

    @Lob
    private String about="-";


}
