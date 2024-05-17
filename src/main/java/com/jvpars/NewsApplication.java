package com.jvpars;

import com.jvpars.service.api.SettingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class NewsApplication {

	public static void main(String[] args) {
		SpringApplication.run(NewsApplication.class, args);
	}


	@Bean
	public CommandLineRunner loadData(SettingService settingService) {
		return (args) -> {
		};
	}


}
