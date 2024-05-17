package com.jvpars.utils;


import java.util.*;

/**
 * Created by ali on 10/20/17.
 */
public class HtmlBuilder {

    public  HashMap dropAble;
    public MapWrapper wrapper;


    public static class Builder {
        //Required
        Class clazz;
        //optional
        HashMap dropAble = new HashMap();
        public MapWrapper wrapper;



        public Builder(Class clazz) {
            this.clazz = clazz; // Required
        }


        public Builder drop(String  value) {
            dropAble.put(value,"");
            this.dropAble=dropAble;
            return this;
        }


        public Builder html() {
            Class clazz=this.clazz;
            EntityGathering entityGathering = new EntityGathering();
            LinkedHashMap hm = entityGathering.getEntityProps(clazz);
            Set set = hm.entrySet();
            Iterator itr = set.iterator();
            String key,type;
            MapWrapper wrapper = new MapWrapper();
            String typeHolder,safeType;


            while(itr.hasNext()) {
                Map.Entry me = (Map.Entry)itr.next();
                key = me.getKey()+"";
                type=me.getValue()+"";
             //   MyArgUtils.print(key+"="+type);
                int indexOfPoint = type.lastIndexOf('.');
                safeType = type.substring(indexOfPoint + 1);
                typeHolder=safeType;

                safeType=Select2Chooser.requiredFields(safeType);
                if(! this.dropAble.containsKey(key)) {
                    wrapper.getProperties().put(key, decapitalize(safeType));
                }
            }
            this.wrapper=wrapper;
            return this;
        }


        public MapWrapper build() {
            return this.wrapper;
        }

        public  String decapitalize(String string){
            if (string == null || string.length() == 0) {
                return string;
            }
            char c[] = string.toCharArray();
            c[0] = Character.toLowerCase(c[0]);
            return new String(c);
        }


    }

    private HtmlBuilder(Builder builder) {
        dropAble  = builder.dropAble;
    }

}
