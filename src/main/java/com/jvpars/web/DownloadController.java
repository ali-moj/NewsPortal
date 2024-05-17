package com.jvpars.web;

import com.jvpars.utils.FileMeta;
import com.jvpars.utils.FindOS;
import com.jvpars.utils.ImageResize;
import com.jvpars.utils.MyArgUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.activation.MimetypesFileTypeMap;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.security.Principal;

/**
 * Created by JVPARS on 17/05/2018.
 */

@Controller
public class DownloadController {

    FileMeta fileMeta = null;

    String filePathToGraphsDir = FindOS.getFileDirectory();

    @RequestMapping(value = "/docs/down/{folder}/{fileName:.+}", method = RequestMethod.GET)
    public void download(@PathVariable String folder, @PathVariable String fileName,
                         HttpServletResponse response, HttpServletRequest request) throws IOException {


        FileInputStream in = null;
        String fname = filePathToGraphsDir + File.separator + folder + File.separator + fileName;

        File targetFile = new File(fname);
        ex(targetFile);
        down(response, in, targetFile);
    }

//....................................................

    @RequestMapping(value = "/download-resize/**", method = RequestMethod.GET)
    public ResponseEntity<byte[]> downloadResize(HttpServletResponse response,
                  HttpServletRequest request , @RequestParam Integer ratio) throws IOException {

        String filePath = String.valueOf(request.getRequestURL());
        filePath = filePath.substring(filePath.lastIndexOf("download-resize/") + 15);

        String fName = filePathToGraphsDir + File.separator + filePath.replace("/", File.separator);

        byte[] media = ImageResize.Resize(fName, ratio);
        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.noCache().getHeaderValue());
        headers.setContentType(MediaType.IMAGE_JPEG);
        return new ResponseEntity<>(media, headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/download/**", method = RequestMethod.GET)
    public void d(HttpServletResponse response,
                  HttpServletRequest request) throws IOException {
        //   MyArgUtils.print("Call Back : " + request.getRequestURL());
        String filePath = String.valueOf(request.getRequestURL());
        filePath = filePath.substring(filePath.lastIndexOf("download/") + 8);
        FileInputStream in = null;
        String fName = filePathToGraphsDir + File.separator + filePath.replace("/", File.separator);
    //    MyArgUtils.print("request : " + fName);
        File targetFile = new File(fName);
        ex(targetFile);
        down(response, in, targetFile);
    }

    private void down(HttpServletResponse response, FileInputStream in, File targetFile) {
        try {

            in = new FileInputStream(targetFile);
            response.setHeader("Content-Disposition", "attachment;filename=\"" + targetFile.getName() + "\"");
            OutputStream out = response.getOutputStream();

            String mimeType;
            mimeType = new MimetypesFileTypeMap().getContentType(targetFile);
       //     MyArgUtils.print(mimeType);
            if (mimeType == null | mimeType.isEmpty()) {
                mimeType = "application/octet-stream";

            }
            response.setContentType(mimeType);
            IOUtils.copy(in, out);
            out.flush();
            out.close();

        } catch (IOException e) {
            e.printStackTrace();
            // return new ModelAndView("resourceNotFound");
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
    }

    private void ex(File targetFile) throws IOException {
        if (!targetFile.exists()) {
            ClassPathResource classPathResource = new ClassPathResource("/static/public/admin/assets/img/no-image.png");
            InputStream inputStream = classPathResource.getInputStream();
            try {
                FileUtils.copyInputStreamToFile(inputStream, targetFile);
            } finally {
                IOUtils.closeQuietly(inputStream);
            }

        }
    }

    //..................................................


    @RequestMapping(value = "/getAudio/**", method = RequestMethod.GET, produces = "audio/mpeg")
    public @ResponseBody
    byte[] getFile(HttpServletRequest request) throws IOException {
        String filePath = String.valueOf(request.getRequestURL());
        filePath = filePath.substring(filePath.lastIndexOf("getAudio/") + 9);
     //   MyArgUtils.print("file path in get file : " + filePath);
        FileInputStream in = null;
        in = new FileInputStream(filePathToGraphsDir + File.separator + filePath.replace("/", File.separator));
    //    MyArgUtils.print("file path in get file : " + filePathToGraphsDir + File.separator + filePath.replace("/", File.separator));
        return IOUtils.toByteArray(in);
    }

}
