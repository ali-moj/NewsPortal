package com.jvpars.utils;

import org.joda.time.*;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import java.io.File;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.text.ParseException;
import java.text.SimpleDateFormat;


/**
 * Created by ali on 2/4/2018.
 */
public abstract class MyArgUtils {

    public static String convertEpochToPersian(long epoch) {
        DateTime date = new DateTime(epoch).withZone(DateTimeZone.forID("Asia/Tehran"));
        JalaliCalendar.YearMonthDate pdate = JalaliCalendar.gregorianToJalali(new JalaliCalendar.YearMonthDate(date.getYear(), date.getMonthOfYear(), date.getDayOfMonth()));
        //MyArgUtils.print("date : " + pdate);
        return pdate.getYear() + "/" + pdate.getMonth() + "/" + pdate.getDate();
    }

    public static long convertPersianDateToEpoch(String date) {


        if (date != null) {
            String[] parts = date.split("/");
            int year = Integer.parseInt(parts[0]); // 1396
            int month = Integer.parseInt(parts[1]); // 01
            int day = Integer.parseInt(parts[2]); // 05
            Long millis = 0L;
            String gregorian = JalaliCalendar.jalaliToGregorian(new JalaliCalendar.YearMonthDate(year, month, day)).toString();
            try {
                millis = new SimpleDateFormat("yyyy/MM/dd").parse(gregorian).getTime();
            } catch (ParseException e) {
                e.printStackTrace();
            }
            return millis;
        }
        return nowEpoch();
    }

    public static long nowEpoch() {
        return System.currentTimeMillis();
    }

    public static void print(String reference) {
        System.out.println("==================" + reference);
    }


    public static int daysBetween(Long min, Long max) {
        MutableDateTime start = new MutableDateTime();
        start.setDate(min);
        MutableDateTime finish = new MutableDateTime();
        finish.setDate(max);
        Days days = Days.daysBetween(start, finish);
        return days.getDays();

    }


    public static String safeUrlString(String str) {
        if (str == null) return "undef";
        if (str.length() == 0) return "undef";
        return str.replaceAll("[^a-zA-Z0-9\\.\\-\\_\\&\\'\\)\\(\\{\\}\\[\\]]", "").replaceAll("/", "").replaceAll("\\.", "").replaceAll("\\&", "");
    }

    public static String toPrettyURL(String string) {
        return Normalizer.normalize(string.toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

    }

    public static String toPrettyURLWithPersianScape(String name) {

        name = name.toLowerCase();
        name=name.replaceAll("ş", "s")
                .replaceAll("ü" , "u")
                .replaceAll("" , "")
                .replaceAll("ı" , "i")
                .replaceAll("ç" , "c")
                .replaceAll("ğ" , "g");

        return Normalizer.normalize(name.toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replaceAll("[^\\p{Alnum}]+", "-");
    }


    public static BigDecimal toCurrency(String str) {
        str = str.replaceAll("[^\\d.]", "");
        return new BigDecimal(str);

    }

    public static void  folderCreateIfNotExist(String folderPath){
        File theDir = new File(folderPath);
        // if the directory does not exist, create it
        if (!theDir.exists()) {
            System.out.println("=====creating directory: " + folderPath);
            boolean result = false;

            try{
                theDir.mkdirs();
                result = true;
            }
            catch(SecurityException se){
                //handle it
            }
            if(result) {
                System.out.println("DIR created");
            }
        }
    }


   public static void bindingResultErrorPrint(BindingResult bindingResult){

        for (Object object : bindingResult.getFieldErrors()) {
            if(object instanceof FieldError) {
                FieldError fieldError = (FieldError) object;

                System.out.println("error binding: "+fieldError.getDefaultMessage());
            }
            else {
                ObjectError objectError = (ObjectError) object;
                System.out.println(objectError.getCode());
            }
        }
    }

    public static String nowJalali() {
        long time = System.currentTimeMillis();
        return convertEpochToPersian(time);
    }
}
