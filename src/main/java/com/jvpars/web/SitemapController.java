package com.jvpars.web;

import com.jvpars.domain.*;
import com.jvpars.service.api.*;
import com.jvpars.utils.*;
import com.jvpars.utils.sitemap.XmlImageElement;
import com.jvpars.utils.sitemap.XmlImageUrl;
import com.jvpars.utils.sitemap.XmlImageUrlSet;
import com.redfin.sitemapgenerator.*;
import org.apache.commons.io.IOUtils;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBContext;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by ali
 */

@Controller
@PropertySource("classpath:messages.properties")
public class SitemapController {


    ContentService contentService;
    MenuService menuService;
    ImageGalleryService imageGalleryService;
    VideoGalleryService videoGalleryService;
    DocFileService docFileService ;
    private MessageSource messageSource;
    private JAXBContext jaxbContext;
    String filePathToGraphsDir = FindOS.getFileDirectory();

    @Autowired
    public SitemapController(ContentService contentService, MessageSource messageSource, MenuService menuService, ImageGalleryService imageGalleryService, VideoGalleryService videoGalleryService , DocFileService docFileService) {
        this.contentService = contentService;
        this.messageSource = messageSource;
        this.menuService = menuService;
        this.imageGalleryService = imageGalleryService;
        this.videoGalleryService = videoGalleryService;
        this.docFileService = docFileService;
    }

    @Value("${domain}")
    private String BaseSiteUrl;

    @Value("${image_sitemap}")
    private String ImageSitemap;

    @Value("${video_sitemap}")
    private String VideoSitemap;

    @Value("${publication_sitemap}")
    private String PublicationSitemap;

    @Value("${sitename}")
    private String SiteName;


    //...........................

    @RequestMapping(value = "/sitemap", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String sitemap(Model model) {
        model.addAttribute("contents", contentService.findAllByPublishedIsTrue());
        model.addAttribute("pages", menuService.findAll());
        return "/sitemap";
    }

    @RequestMapping(value = "/sitemap.xml", method = RequestMethod.GET)
    @ResponseBody
    public SiteMapIndexSet sitemap() {
        SiteMapIndexSet siteMapIndexSet = new SiteMapIndexSet();
        createIndex(siteMapIndexSet, "/sitemap/pages_sitemap.xml", new DateTime().toString(DateTimeFormat.forPattern("yyyy-MM-dd")));
        createIndex(siteMapIndexSet, "/sitemap/news_sitemap.xml", new DateTime().toString(DateTimeFormat.forPattern("yyyy-MM-dd")));
        createIndex(siteMapIndexSet, "/sitemap/publication_sitemap.xml", new DateTime().toString(DateTimeFormat.forPattern("yyyy-MM-dd")));
        createIndex(siteMapIndexSet, "/sitemap/images_sitemap.xml", new DateTime().toString(DateTimeFormat.forPattern("yyyy-MM-dd")));
        createIndex(siteMapIndexSet, "/sitemap/videos_sitemap.xml", new DateTime().toString(DateTimeFormat.forPattern("yyyy-MM-dd")));
        return siteMapIndexSet;
    }

    //....................................................
    @RequestMapping(value = "/sitemap/pages_sitemap.xml", method = RequestMethod.GET)
    @ResponseBody
    public XmlUrlSet pages() {
        XmlUrlSet xmlUrlSet = new XmlUrlSet();

        Iterable<Menu> menus = menuService.findAll();
        for (Menu menu : menus) {
            create(xmlUrlSet, String.format("/page/%d/%s", menu.getId(), menu.getTitle()), new DateTime().toString(DateTimeFormat.forPattern("yyyy-MM-dd")));
        }

        return xmlUrlSet;
    }

    //...........................

    @RequestMapping(value = "/sitemap/news_sitemap.xml", method = RequestMethod.GET)
    @ResponseBody
    public XmlUrlSet news() {
        XmlUrlSet xmlUrlSet = new XmlUrlSet();

        Iterable<Content> news = contentService.findAllByPublishedIsTrue();
        for (Content item : news) {
            create(xmlUrlSet, "/contents/news/" + item.getCreatedDateL() + "/" + SeoUtils.urlFriendly(item.getTitle()), DateFormatter.convertDateToPattern(item.getCreatedDateL()));
        }

        return xmlUrlSet;
    }

    //...........................

    @RequestMapping(value = "/sitemap/publication_sitemap.xml", method = RequestMethod.GET)
    @ResponseBody
    public String publication() throws MalformedURLException {
        File path = new File(filePathToGraphsDir);
        GoogleNewsSitemapGenerator wsg = GoogleNewsSitemapGenerator.builder(BaseSiteUrl, path)
                .fileNamePrefix(PublicationSitemap)
                .build();

        Iterable<Content> news = contentService.findAllByPublishedIsTrue();
        for (Content item : news) {
            GoogleNewsSitemapUrl newsElement = new GoogleNewsSitemapUrl(
                    String.format("%s/contents/news/%d/%s", BaseSiteUrl, item.getCreatedDateL(), SeoUtils.urlFriendly(item.getTitle())),
                    new Date(item.getCreatedDateL()),
                    item.getTitle(),
                    SiteName,
                    "tr");
            wsg.addUrl(newsElement);
        }
        try {
            wsg.write();
            String content = new String(Files.readAllBytes(Paths.get(path.getPath() + "/" + PublicationSitemap + ".xml")));
            return content;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    //...........................

    @RequestMapping(value = "/sitemap/images_sitemap.xml", method = RequestMethod.GET)
    @ResponseBody
    public String images() throws IOException {
        File path = new File(filePathToGraphsDir);
        GoogleImageSitemapGenerator wsg = GoogleImageSitemapGenerator.builder(BaseSiteUrl, path)
                .fileNamePrefix(ImageSitemap)
                .build();

        Iterable<ImageGallery> images = imageGalleryService.findAll();
        for (ImageGallery item : images) {
            DocFolder docFolder = item.getDocFolder();
            List<DocFile> files = docFileService.findByDocFolderOrderByIdDesc(docFolder);
            List<Image> imageList = new ArrayList<>();
            for (DocFile file : files){
                String url = SeoUtils.repBackSlash(item.getDocFolder().getFolderPath());
                Image image = new Image(String.format("%s/download/%s/%s", BaseSiteUrl,url, file.getFileName()));
                imageList.add(image);
            }
            GoogleImageSitemapUrl imgElement = new GoogleImageSitemapUrl.Options(String.format("%s/gallery/%s", BaseSiteUrl, item.getId())).images(imageList).build();
            wsg.addUrl(imgElement);
        }
        try {
            wsg.write();
            String content = new String(Files.readAllBytes(Paths.get(path.getPath() + "/" + ImageSitemap + ".xml")));
            return content;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    //...........................

    @RequestMapping(value = "/sitemap/videos_sitemap.xml", method = RequestMethod.GET)
    @ResponseBody
    public String videos() throws MalformedURLException {
        File path = new File(filePathToGraphsDir);
        GoogleVideoSitemapGenerator wsg = GoogleVideoSitemapGenerator.builder(BaseSiteUrl, path)
                .fileNamePrefix(VideoSitemap)
                .build();

        Iterable<VideoGallery> videos = videoGalleryService.findAll();
        for (VideoGallery item : videos) {
            GoogleVideoSitemapUrl videoElement = new GoogleVideoSitemapUrl.Options(new URL(BaseSiteUrl + "/video/" + item.getId()), new URL(item.getVideoUrl()))
                    .thumbnailUrl(new URL(BaseSiteUrl + item.getMainImageUrl().replace("download","download-resize")+ "?ratio=500"))
                    .title(item.getTitle())
                    .description(item.getTitle())
                    .build();
            wsg.addUrl(videoElement);
        }
        try {
            wsg.write();
            String content = new String(Files.readAllBytes(Paths.get(path.getPath() + "/" + VideoSitemap + ".xml")));
            return content;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    //...........................


    @RequestMapping(value = {"/robots", "/robot", "/robot.txt", "/robots.txt", "/null"})
    public void robot(HttpServletResponse response) {

        InputStream resourceAsStream = null;
        try {

            ClassLoader classLoader = getClass().getClassLoader();
            resourceAsStream = classLoader.getResourceAsStream("robot.txt");

            response.addHeader("Content-disposition", "filename=robot.txt");
            response.setContentType("text/plain");
            IOUtils.copy(resourceAsStream, response.getOutputStream());
            response.flushBuffer();
        } catch (Exception e) {
            MyArgUtils.print(e.getMessage());
        } finally {
            {
                if (resourceAsStream != null) try {
                    resourceAsStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
    }

    private void createImageElement(String link) {

    }
    //............................

    private void create(XmlUrlSet xmlUrlSet, String link, String date) {
        xmlUrlSet.addUrl(new XmlUrl(BaseSiteUrl + link, date));
    }

    private void createIndex(SiteMapIndexSet siteMapIndexSet, String link, String date) {
        siteMapIndexSet.addUrl(new XmlUrl(BaseSiteUrl + link, date));
    }
}