package com.jvpars.utils;

/**
 * Created by ali on 5/24/17.
 */
public class LabelGather {

        public static String  invoke(String str){
            str= str.replaceAll(" ","");
            str=str.replaceAll("\\d","");
            return  str;
        }
}
