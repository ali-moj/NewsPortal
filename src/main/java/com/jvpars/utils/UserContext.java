package com.jvpars.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.nio.charset.Charset;

/**
 * Created by ali on 11/12/16.
 */
public abstract class UserContext {
    private final static Charset charset = Charset.defaultCharset();
    public static String getLoggedInUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();

    }
}
