package com.jvpars.utils;

/**
 * Created by ali on 4/10/17.
 */

import org.thymeleaf.dialect.AbstractProcessorDialect;
import org.thymeleaf.processor.IProcessor;
import org.thymeleaf.standard.processor.StandardXmlNsTagProcessor;
import org.thymeleaf.templatemode.TemplateMode;

import java.util.HashSet;
import java.util.Set;

public class FormDialect extends AbstractProcessorDialect {


    public FormDialect() {
        super(
                "Form Dialect",    // Dialect name
                "DynForm",            // Dialect prefix (hello:*)
                1000);              // Dialect precedence
    }


    public Set<IProcessor> getProcessors(final String dialectPrefix) {
        final Set<IProcessor> processors = new HashSet<IProcessor>();
        processors.add(new FormGenProcessor(dialectPrefix));

        // This will remove the xmlns:hello attributes we might add for IDE validation
        processors.add(new StandardXmlNsTagProcessor(TemplateMode.HTML, dialectPrefix));
        return processors;
    }
}
