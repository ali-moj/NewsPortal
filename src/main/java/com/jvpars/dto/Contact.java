package com.jvpars.dto;

import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.annotate.JsonPropertyOrder;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
@JsonPropertyOrder({
        "cellPhone",
        "telephone",
        "postCode",
        "fax",
        "jobTel",
        "jobAddress",
        "postBox",
        "email",
        "address"
})
public class Contact {

    @JsonProperty("cellPhone")
    public String cellPhone;
    @JsonProperty("telephone")
    public String telephone;
    @JsonProperty("postCode")
    public Object postCode;
    @JsonProperty("fax")
    public String fax;
    @JsonProperty("jobTel")
    public Object jobTel;
    @JsonProperty("jobAddress")
    public Object jobAddress;
    @JsonProperty("postBox")
    public Object postBox;
    @JsonProperty("email")
    public Object email;
    @JsonProperty("address")
    public String address;

}
