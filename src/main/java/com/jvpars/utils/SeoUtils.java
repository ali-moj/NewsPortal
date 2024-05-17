package com.jvpars.utils;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;

public abstract class SeoUtils {

    public static String urlFriendly(String str){
        str= str.replaceAll("\\.", "-");
        str= str.replaceAll("[()]","-");
        str= str.replaceAll("/","");
        str= str.replaceAll("[{}]","-");
        str= str.replaceAll("؟","");
        str=str.replaceAll(" ?- ?","-"); // remove spaces around hyphens
        str=str.replaceAll("[ ']","-") ;// turn spaces and quotes into hyphens
        return str.replaceAll(" ","-").trim();
    }

    public static String repBackSlash(String str){
        return str.replaceAll("\\\\","/").trim();
    }

    public static String convertToDate(Long epoch){
       return new DateTime(epoch).toString(DateTimeFormat.forPattern("yyyy-MM-dd"));
    }
}
