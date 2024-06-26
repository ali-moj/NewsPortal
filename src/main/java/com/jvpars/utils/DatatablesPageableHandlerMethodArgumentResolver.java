package com.jvpars.utils;

import org.springframework.core.MethodParameter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.ModelAndViewContainer;


public class DatatablesPageableHandlerMethodArgumentResolver
    extends PageableHandlerMethodArgumentResolver {

  public DatatablesPageableHandlerMethodArgumentResolver() {
    super(new DatatablesSortHandlerMethodArgumentResolver());
    setPageParameterName("start");
    setSizeParameterName("length");
  }

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return DatatablesPageable.class.equals(parameter.getParameterType());
  }

  @Override
  public DatatablesPageable resolveArgument(MethodParameter methodParameter,
                                            ModelAndViewContainer mavContainer, NativeWebRequest webRequest,
                                            WebDataBinderFactory binderFactory) {
    Pageable pageable =
        super.resolveArgument(methodParameter, mavContainer, webRequest, binderFactory);

    return new DatatablesPageable(pageable);
  }

}