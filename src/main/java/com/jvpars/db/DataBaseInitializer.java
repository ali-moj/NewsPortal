package com.jvpars.db;


import org.springframework.context.annotation.Configuration;

@Configuration
public  class DataBaseInitializer {
//
//    @Bean(name = "dataSource")
//    public DriverManagerDataSource dataSource() {
//        DriverManagerDataSource dataSource = new DriverManagerDataSource();
//        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
//        dataSource.setUrl("jdbc:mysql://localhost:3306/incm?useUnicode=yes&characterEncoding=UTF-8&useSSL=false");
//        dataSource.setUsername("root");
//        dataSource.setPassword("barselon");
//
//        // schema init
//        Resource initSchema = new ClassPathResource("scripts/schema-mysql.sql");
//        Resource initData = new ClassPathResource("scripts/data-mysql.sql");
//        DatabasePopulator databasePopulator = new ResourceDatabasePopulator(initSchema, initData);
//        DatabasePopulatorUtils.execute(databasePopulator, dataSource);
//
//        return dataSource;
//    }
}
