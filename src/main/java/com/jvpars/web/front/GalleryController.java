package com.jvpars.web.front;

import com.jvpars.domain.DocFile;
import com.jvpars.domain.DocFolder;
import com.jvpars.domain.ImageGallery;
import com.jvpars.domain.VideoGallery;
import com.jvpars.dto.GalleryDto;
import com.jvpars.dto.PageGalleryDto;
import com.jvpars.dto.PageVideoDto;
import com.jvpars.dto.VideoDto;
import com.jvpars.service.api.DocFileService;
import com.jvpars.service.api.DocFolderService;
import com.jvpars.service.api.ImageGalleryService;
import com.jvpars.service.api.VideoGalleryService;
import com.jvpars.utils.MyArgUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Controller
public class GalleryController {

    static Logger log = Logger.getLogger(GalleryController.class.getName());
    ImageGalleryService imageGalleryService;
    DocFolderService docFolderService;
    DocFileService docFileService;
    VideoGalleryService videoService;

    @Autowired
    GalleryController(ImageGalleryService imageGalleryService,
                      DocFolderService docFolderService,
                      DocFileService docFileService,
                      VideoGalleryService videoService) {
        this.docFileService = docFileService;
        this.docFolderService = docFolderService;
        this.imageGalleryService = imageGalleryService;
        this.videoService = videoService;
    }

    @RequestMapping(value = {"/gallery"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String gallery(Model model) {
        try {
            ImageGallery spec1 = null, spec2 = null, spec3 = null, spec4 = null, spec5 = null, spec6 = null, spec7 = null;
            List<ImageGallery> li = imageGalleryService.findTop7ByOrderByIdDesc();
            int size = li.size();
            //     MyArgUtils.print(">" + li.toString());
            if (size > 0) {
                spec1 = li.get(0);
                log.info(spec1.toString());
            }
            if (size > 1) {
                spec2 = li.get(1);
            }
            if (size > 2) {
                spec3 = li.get(2);
            }
            if (size > 3) {
                spec4 = li.get(3);
            }
            if (size > 4) {
                spec5 = li.get(4);
            }
            if (size > 5) {
                spec6 = li.get(5);
            }
            if (size > 6) {
                spec7 = li.get(6);
            }
            model.addAttribute("spec1", spec1);
            model.addAttribute("spec2", spec2);
            model.addAttribute("spec3", spec3);
            model.addAttribute("spec4", spec4);
            model.addAttribute("spec5", spec5);
            model.addAttribute("spec6", spec6);
            model.addAttribute("spec7", spec7);
            return "/front/gallery/gallery";
        } catch (Exception ex) {
            ex.printStackTrace();
            return "/error";
        }

    }

    @RequestMapping(value = {"/gallery/{id}"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getGallerySlider(@PathVariable("id") Long id, Model model) {
        try {
            ImageGallery im = imageGalleryService.findOne(id);
            DocFolder docFolder = im.getDocFolder();
            log.info(docFolder.getId() + "");
            List<DocFile> li = docFileService.findByDocFolderOrderByIdDesc(docFolder);
            model.addAttribute("imageGallery", im);
            //MyArgUtils.print(">" + li.size());
            model.addAttribute("docFiles", li);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        ///add new page link to return
        return "/front/gallery/galleryDetails";
    }

    @RequestMapping(value = {"/gallery-archive"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String galleryArchive() {
        return "/front/gallery/galleryArchive";
    }

    @RequestMapping(value = "/gallery-page-archive", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity archivePage(Pageable pageable) {
        Page<ImageGallery> galleries = imageGalleryService.findByPage(pageable);
        PageGalleryDto page = new PageGalleryDto();
        page.items = new ArrayList<>();
        page.currentPage = pageable.getPageNumber();
        page.pageCount = galleries.getTotalPages();
        page.total = galleries.getTotalElements();
        for (ImageGallery item : galleries.getContent()) {
            GalleryDto gallery = new GalleryDto(item);
            page.items.add(gallery);
        }
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @RequestMapping(value = {"/videos"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String videos(Model model) {
        //MyArgUtils.print("video callback");
        try {
            VideoGallery spec1 = null, spec2 = null, spec3 = null, spec4 = null, spec5 = null, spec6 = null, spec7 = null;
            List<VideoGallery> li = videoService.findTop7ByOrderByIdDesc();
            int size = li.size();
            if (size > 0) {
                spec1 = li.get(0);
                log.info(spec1.toString());
            }
            if (size > 1) {
                spec2 = li.get(1);
            }
            if (size > 2) {
                spec3 = li.get(2);
            }
            if (size > 3) {
                spec4 = li.get(3);
            }
            if (size > 4) {
                spec5 = li.get(4);
            }
            if (size > 5) {
                spec6 = li.get(5);
            }
            if (size > 6) {
                spec7 = li.get(6);
            }
            model.addAttribute("spec1", spec1);
            model.addAttribute("spec2", spec2);
            model.addAttribute("spec3", spec3);
            model.addAttribute("spec4", spec4);
            model.addAttribute("spec5", spec5);
            model.addAttribute("spec6", spec6);
            model.addAttribute("spec7", spec7);
            return "/front/gallery/videos";
        } catch (Exception ex) {
            ex.printStackTrace();
            return "/error";
        }

    }

    @RequestMapping(value = {"/video/{id}"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String videoDetail(@PathVariable("id") Long id, Model model) {
        try {
            VideoGallery video = videoService.findOne(id);
            model.addAttribute("video", video);
            return "/front/gallery/videoDetails";
        } catch (Exception ex) {
            return "/error";
        }
    }

    @RequestMapping(value = {"/video-archive"}, method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String videoArchive() {
        return "/front/gallery/videoArchive";
    }

    @RequestMapping(value = "/video-page-archive", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity videoArchivePage(Pageable pageable) {
        Page<VideoGallery> galleries = videoService.findByPage(pageable);
        PageVideoDto page = new PageVideoDto();
        page.items = new ArrayList<>();
        page.currentPage = pageable.getPageNumber();
        page.pageCount = galleries.getTotalPages();
        page.total = galleries.getTotalElements();
        for (VideoGallery item : galleries.getContent()) {
            VideoDto gallery = new VideoDto(item);
            page.items.add(gallery);
        }
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

}
