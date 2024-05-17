package com.jvpars.utils;

/**
 * Created by ali on 4/4/17.
 */
public  class Select2Chooser {



    public static String requiredFields(String ObjectType){

        if(ObjectType.toLowerCase().contains("integer")){
            return ObjectType;

        }

        if(ObjectType.toLowerCase().contains("long")){
            return ObjectType;

        }

        if(ObjectType.toLowerCase().contains("double")){
            return ObjectType;

        }


        if(ObjectType.toLowerCase().contains("string")){
            return ObjectType;

        }


        if(ObjectType.toLowerCase().contains("richtext")){
            return "richTextType";

        }

        if(ObjectType.toLowerCase().contains("bigdecimal")){
            return ObjectType;

        }

        if(ObjectType.toLowerCase().contains("boolean")){
            return ObjectType;

        }

        if(ObjectType.toLowerCase().contains("textarea")){
            return "textArea";

        }


        if(ObjectType.toLowerCase().contains("sysusers")){
            return "name,email";

        }

        if(ObjectType.toLowerCase().contains("box")){
            return "select2";

        }

        if(ObjectType.toLowerCase().contains("menu")){
            return "title";
        }



        return "id";


    }
}
