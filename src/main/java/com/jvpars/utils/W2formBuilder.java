package com.jvpars.utils;


import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by ali on 10/20/16.
 */
public class W2formBuilder {


    public String form;
    LinkedHashMap<String,String> fields = new LinkedHashMap<String,String>();


    public static class Builder {

        public String name;
        private String form;

        LinkedHashMap<String,String> fields = new LinkedHashMap<String,String>();

        public Builder() {

        }


        public Builder field(String  name,String value ) {
            fields.put(name,value);
             return this;
        }


        public Builder name(String  value) {
            this.name=value;
            return this;
        }







        public String build() {
            Set set = fields.entrySet();
            Iterator itr = set.iterator();
            String key,value;
            StringBuilder fields=new StringBuilder("fields : [");

            StringBuilder form=new StringBuilder().append( "name   : "+this.name+",");
            while(itr.hasNext()) {
                Map.Entry me = (Map.Entry)itr.next();
                key = me.getKey()+"";
                value=me.getValue()+"";


                StringBuilder field=new StringBuilder();
                field.append("{ name: '").append(key).append("','").append( "type: 'text'}");
                fields.append(field.toString()) .append(",");



//                { name: 'first_name', type: 'text', required: true },
//                { name: 'last_name',  type: 'text', required: true },
//                { name: 'comments',   type: 'text'}
//        ],




            }

            fields=fields.append("],\n" +
                    "\tactions: {\n" +
                    "\t\treset: function () {\n" +
                    "\t\t\tthis.clear();\n" +
                    "\t\t},\n" +
                    "\t\tsave: function () {\n" +
                    "\t\t\tvar obj = this;\n" +
                    "\t\t\tthis.save({}, function (data) { \n" +
                    "\t\t\t\tif (data.status == 'error') {\n" +
                    "\t\t\t\t\tconsole.log('ERROR: '+ data.message);\n" +
                    "\t\t\t\t\treturn;\n" +
                    "\t\t\t\t}\n" +
                    "\t\t\t\tobj.clear();\n" +
                    "\t\t\t});\n" +
                    "\t\t}\n" +
                    "\t}\n");



            form.append(fields.toString());
            return form.toString();

        }




    }

    private W2formBuilder(Builder builder) {
        fields  = builder.fields;
    }

}
