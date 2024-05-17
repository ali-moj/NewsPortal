package com.jvpars.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.text.ParseException;

/**
 * Created by ali on 4/13/17.
 */
public class PersianDateConverter {

    public static class Serialize extends JsonSerializer<Long> {
        @Override
        public void serialize(Long value, JsonGenerator jgen, SerializerProvider provider) throws IOException {
            if (value == null) {
                jgen.writeNull();
            }
            else if(value<100000){
                jgen.writeNumber(value);
             }
            else {
               jgen.writeString(new java.text.SimpleDateFormat("dd.MM.yyyy").format(new java.util.Date (value)));
            }
        }
    }


    public static class Deserialize extends JsonDeserializer<Long> {
        @Override
        public Long deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
            String dateAsString = jp.getText();
            try {
                if (StringUtils.isEmpty(dateAsString)) {
                    return null;
                }
                else {
                    if(dateAsString.contains(".")) return Long.valueOf(dateAsString);
                    return  new java.text.SimpleDateFormat("dd.MM.yyyy").parse(dateAsString).getTime();
                }
            }
            catch (ParseException pe) {
                throw new RuntimeException(pe);
            }
        }
    }

}
