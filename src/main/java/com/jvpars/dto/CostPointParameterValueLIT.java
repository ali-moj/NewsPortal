package com.jvpars.dto;

import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.annotate.JsonPropertyOrder;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
@JsonPropertyOrder({
        "mandatory",
        "code",
        "suffix",
        "title",
        "value"
})
public class CostPointParameterValueLIT {

    @JsonProperty("mandatory")
    public Boolean mandatory;
    @JsonProperty("code")
    public String code;
    @JsonProperty("suffix")
    public String suffix;
    @JsonProperty("title")
    public String title;
    @JsonProperty("value")
    public String value;

}
