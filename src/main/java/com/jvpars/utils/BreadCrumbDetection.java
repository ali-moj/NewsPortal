package com.jvpars.utils;

/**
 * Created by ali on 5/21/17.
 */
public class BreadCrumbDetection {

    public static String  currentPage(String url){
        url= url.replaceAll(" ","");
        url=url.replaceAll("\\d","");
        return  url;
    }

    public static String  pageName(String url){
        url= url.replaceAll(" ","");
        url= url.replaceAll("/","");
        url=url.replaceAll("\\d","");

        if(url.contains("show")) return "show";
        if(url.contains("create")) return "create";
        if(url.contains("edit")) return "edit";


        return  url;
    }


    public static String  basePage(String url){
        url=url.replaceAll("show","").replaceAll("create-form","").replaceAll("edit-form","").replaceAll(" ","") .replaceAll("\\d","");
        return  url;
    }
    public static String basePageName(String url){
        url =basePage(url).replaceAll("/","");
        return url;
    }

    public static boolean check(String url){

        if(url.contains("show")) return true;
        if(url.contains("create")) return true;
        return url.contains("edit");

    }
}
