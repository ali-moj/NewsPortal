package com.jvpars.web._secure;

import com.jvpars.domain.SysUser;
import com.jvpars.domain.VideoGallery;
import com.jvpars.security.LoggedIn;
import com.jvpars.service.api.VideoGalleryService;
import com.jvpars.utils.*;
import com.jvpars.web.errors.JvparsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;

@RequestMapping({"/_secure/video-galleries"})
@Controller
public class VideoGalleryController {
    @Autowired
    public VideoGalleryService videoGalleryService;

    @Autowired
    LoggedIn loggedIn;

    String filePathToGraphsDir = FindOS.getFileDirectory();

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(VideoGallery.class).drop("id").drop("version").drop("deleted").drop("createdDateL").drop("sysUser").html().build();
        return wrapper;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "/_secure/video-galleries/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<VideoGallery> list(GlobalSearch search, Pageable pageable) {
        Page<VideoGallery> videoGallery = videoGalleryService.findAll(search, pageable);
        return videoGallery;
    }

    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<VideoGallery> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<VideoGallery> videoGallery = list(search, pageable);
        long allAvailableVideoGallery = videoGalleryService.count();
        return new DatatablesData<VideoGallery>(videoGallery, allAvailableVideoGallery, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new VideoGallery());
        return "/_secure/video-galleries/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute VideoGallery videoGallery, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new VideoGallery());
            return "/_secure/video-galleries/create";
        }
        if(loggedIn.getEmail().equals("support@jvpars.com")){
            throw new JvparsException("user support can not add content ! ");
        }

        SysUser user = loggedIn.getUser();
        videoGallery.setSysUser(user);
        VideoGallery newVideoGallery = videoGalleryService.save(videoGallery);
        redirectAttrs.addAttribute("id", newVideoGallery.getId());
        return "redirect:/_secure/video-galleries/{id}";
    }

    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, videoGalleryService.findOne(id));
        return "/_secure/video-galleries/edit";
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute VideoGallery videoGallery, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, videoGallery);
            return "/_secure/video-galleries/edit";
        }
        VideoGallery savedImageGallery = videoGalleryService.save(videoGallery);
        redirectAttrs.addAttribute("id", savedImageGallery.getId());
        return "redirect:/_secure/video-galleries/{id}";
    }

    @RequestMapping(value = "/del/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        videoGalleryService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/video-galleries";
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        VideoGallery im = videoGalleryService.findOne(id);
        model.addAttribute("videoGallery", videoGalleryService.findOne(id));
        // MyArgUtils.print(">" + li.size());
        return "/_secure/video-galleries/show";
    }


    void populateForm(Model uiModel, VideoGallery videoGallery) {
        uiModel.addAttribute("videoGallery", videoGallery);
    }
}
