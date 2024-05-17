package com.jvpars.config;
import com.jvpars.web.CaptchaGenServlet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.util.Arrays;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public UserDetailsService userDetailsService() {
        return super.userDetailsService();
    }


    @Bean
    ServletRegistrationBean myServletRegistration () {
        ServletRegistrationBean srb = new ServletRegistrationBean();
        srb.setServlet(new CaptchaGenServlet());
        srb.setUrlMappings(Arrays.asList("/captcha.jpg"));
        return srb;
    }




    @Override
    public void configure(WebSecurity web) {
        web.ignoring().antMatchers("/js/**", "/css/**", "/public/**","/resources/**","/assets/**","/fonts/**","/img/**","/skarla/**" ,"maps/**" ,"maps.googleapis.com");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

    /*    http.addFilterAfter(ajaxFilter(), ExceptionTranslationFilter.class);*/

        http
                .csrf().disable()
                .sessionManagement().maximumSessions(1).sessionRegistry(sessionRegistry())
                .expiredUrl("/_secure/login");

        http.authorizeRequests()

                .antMatchers("/_secure/**").authenticated()
                .antMatchers("/_secure/login").permitAll()
                .anyRequest().permitAll()



                .and()
                .formLogin().loginPage("/_secure/login").defaultSuccessUrl("/_secure/admin",true).permitAll()
                .and()
                .logout().logoutRequestMatcher(new AntPathRequestMatcher("/_secure/logout", "GET")).invalidateHttpSession(true).deleteCookies("JSESSIONID").permitAll();


    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {

        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());

    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

/*    @Bean
    public GenericFilterBean ajaxFilter() {
        JsfAjaxFilter ajaxFilter = new JsfAjaxFilter();
        return ajaxFilter;
    }*/
}
