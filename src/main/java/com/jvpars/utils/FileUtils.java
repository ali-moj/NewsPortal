package com.jvpars.utils;

import java.text.Normalizer;

/**
 * Created by ali on 6/17/17.
 */
public class FileUtils {


    //......................

    public static String charSafeFileName(String originalFilename) {
        String replicatedFileName = Normalizer.normalize(originalFilename, Normalizer.Form.NFD);
        return replicatedFileName.replaceAll("[^\\x00-\\x7F]", "");

    }

}
