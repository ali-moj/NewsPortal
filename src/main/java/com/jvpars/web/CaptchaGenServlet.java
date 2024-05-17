package com.jvpars.web;

import com.jvpars.utils.CaptchaUtil;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;

public class CaptchaGenServlet extends HttpServlet {

    public static final String FILE_TYPE = "jpg";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {

        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Max-Age", 0);

        String captchaStr="";

        //captchaStr=Util.generateCaptchaTextMethod();

        captchaStr= CaptchaUtil.generateCaptchaTextMethod2(4);
        captchaStr= captchaStr.toUpperCase();

        try {

            int width=75;     	int height=40;

            Color bg = new Color(21, 138, 65);
            Color fg = new Color(250, 250, 250);

            Font font = new Font("Arial", Font.BOLD, 20);
            BufferedImage cpimg =new BufferedImage(width,height,BufferedImage.OPAQUE);
            Graphics g = cpimg.createGraphics();

            g.setFont(font);
            g.setColor(bg);
            g.fillRect(0, 0, width, height);
            g.setColor(fg);
            g.drawString(captchaStr,10,25);

            HttpSession session = request.getSession(true);
            session.setAttribute("CAPTCHA", captchaStr);

            OutputStream outputStream = response.getOutputStream();

            ImageIO.write(cpimg, FILE_TYPE, outputStream);
            outputStream.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }

}
