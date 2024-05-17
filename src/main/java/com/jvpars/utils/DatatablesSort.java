package com.jvpars.utils;

import org.springframework.data.domain.Sort;

import java.util.List;

public class DatatablesSort extends Sort {

  private static final long serialVersionUID = 5938901146261470479L;

  public DatatablesSort(List<Order> orders) {
    super(orders);
  }

}