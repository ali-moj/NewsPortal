package com.jvpars.repository;

import com.jvpars.domain.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {
    List<Setting> findTop1ByOrderByIdAsc();
    Setting findFirstByOrderByIdAsc();

}
