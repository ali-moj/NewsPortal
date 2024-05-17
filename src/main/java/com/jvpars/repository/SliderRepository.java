package com.jvpars.repository;

import com.jvpars.domain.Slider;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SliderRepository extends CrudRepository<Slider ,Long>  {
}
