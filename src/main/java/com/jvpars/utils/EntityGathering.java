package com.jvpars.utils;


import com.jvpars.utils.ViewType.types.RichTextType;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.LinkedHashMap;

/**
 * Created by ali on 10/19/16.
 */
public class EntityGathering {

    public LinkedHashMap getEntityProps(Class clazz) {
        LinkedHashMap hm = new LinkedHashMap();
        Field[] fields = clazz.getDeclaredFields();
        for (Field f : fields) {
            Annotation[] annotations = f.getDeclaredAnnotations();
            Class<?> type = f.getType();


            for(Annotation annotation : annotations){
                if(annotation.annotationType().getName().toLowerCase().contains("RichTextType".toLowerCase())) {
                    type = RichTextType.class;
                  //  System.out.println("field name : " + f.getName() + " , type : " + type.getSimpleName());
                }
            }

            hm.put(f.getName(), type.getSimpleName());

        }
        return hm;
    }
}