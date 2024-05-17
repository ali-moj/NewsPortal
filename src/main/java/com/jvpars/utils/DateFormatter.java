package com.jvpars.utils;

import java.text.ParseException;



    public class DateFormatter  {

    public static String convertDateToPattern(long epoch){

       return new java.text.SimpleDateFormat("dd.MM.yyyy").format(new java.util.Date (epoch));

    }

    public static String convertDateToYearPattern(long epoch){

       return new java.text.SimpleDateFormat("yyyy").format(new java.util.Date (epoch));

    }

    public static long convertDateToEpoch(String date , String pattern) throws ParseException {
       return  new java.text.SimpleDateFormat(pattern).parse(date).getTime() ;
    }

    public static long nowEpoch(){
        return System.currentTimeMillis();
    }


    }

