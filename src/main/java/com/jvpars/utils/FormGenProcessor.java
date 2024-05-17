package com.jvpars.utils;



import org.thymeleaf.IEngineConfiguration;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.engine.AttributeName;
import org.thymeleaf.model.IProcessableElementTag;
import org.thymeleaf.processor.element.AbstractAttributeTagProcessor;
import org.thymeleaf.processor.element.IElementTagStructureHandler;
import org.thymeleaf.standard.expression.IStandardExpression;
import org.thymeleaf.standard.expression.IStandardExpressionParser;
import org.thymeleaf.standard.expression.StandardExpressions;
import org.thymeleaf.templatemode.TemplateMode;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;


/**
 * Created by ali on 4/10/17.
 */
public class FormGenProcessor extends AbstractAttributeTagProcessor {

    private static final String ATTR_NAME = "show";
    private static final int PRECEDENCE = 10000;


    public FormGenProcessor(final String dialectPrefix) {
        super(
                TemplateMode.HTML, // This processor will apply only to HTML mode
                dialectPrefix,     // Prefix to be applied to name for matching
                null,              // No tag name: match any tag name
                false,             // No prefix to be applied to tag name
                ATTR_NAME,         // Name of the attribute that will be matched
                true,              // Apply dialect prefix to attribute name
                PRECEDENCE,        // Precedence (inside dialect's precedence)
                true);             // Remove the matched attribute afterwards
    }


    protected void doProcess(
            final ITemplateContext context, final IProcessableElementTag tag,
            final AttributeName attributeName, final String entityName,
            final IElementTagStructureHandler structureHandler) {

        final IEngineConfiguration configuration = context.getConfiguration();
        final IStandardExpressionParser parser =StandardExpressions.getExpressionParser(configuration);
        final IStandardExpression expression = parser.parseExpression(context, entityName);
        final String parted = (String) expression.execute(context);

       // MyArgUtils.print("..............................."+parted);


        Long id = Long.valueOf(parted.replaceAll("[^0-9]", "")); // returns 123
        String entity=parted.replace(id+"","");
        entity=entity.replace("/","");
        entity = entity.substring(0, entity.length()-1)+"";
        entity= org.apache.commons.lang3.StringUtils.capitalize(entity);


       // MyArgUtils.print("..............................."+entity+id);


        String pack="com.jvpars.domain";
        Class<?> clazz=null;
        try {
          //  MyArgUtils.print(pack+"."+entity);
            clazz = Class.forName(pack+"."+entity);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        String row = "";
        if(clazz!=null) {
            EntityGathering gathering = new EntityGathering();
            LinkedHashMap hm = gathering.getEntityProps(clazz);
            Set set = hm.entrySet();
            Iterator itr = set.iterator();
            String key, type;
            MapWrapper wrapper = new MapWrapper();
           // MyArgUtils.print(set.size() + "");


            while (itr.hasNext()) {
                Map.Entry me = (Map.Entry) itr.next();
                key = me.getKey() + "";
                type = me.getValue() + "";
            //    MyArgUtils.print(key + "=" + type);
                row=row+"<tr><td>"+type+"</td><td>"+key+"</td></tr>";
            }
        }



        structureHandler.setBody(

               "<table class=\"table table-striped table-hover table-bordered\">"
                       +row+
                      "</table>", false);

    }

}
