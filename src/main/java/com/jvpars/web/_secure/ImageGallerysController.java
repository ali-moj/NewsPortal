package com.jvpars.web._secure;

import com.jvpars.domain.DocFile;
import com.jvpars.domain.DocFolder;
import com.jvpars.dto.ImageGalleryRequest;
import com.jvpars.security.LoggedIn;
import com.jvpars.service.api.DocFileService;
import com.jvpars.service.api.DocFolderService;
import com.jvpars.service.impl.DocFolderServiceImpl;
import com.jvpars.utils.*;

import com.jvpars.domain.ImageGallery;
import com.jvpars.service.api.ImageGalleryService;


import lombok.Data;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


import javax.validation.Valid;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

import static com.jvpars.domain.QDocFile.docFile;
import org.apache.commons.io.FileUtils;

@RequestMapping({"/_secure/image-galleries"})
@Controller
public class ImageGallerysController {


    @Autowired
    public ImageGalleryService imagegalleryService;

    @Autowired
    LoggedIn loggedIn;

    @Autowired
    DocFolderService docFolderService;

    @Autowired
    DocFileService docFileService;

    String filePathToGraphsDir = FindOS.getFileDirectory();

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(ImageGallery.class).drop("id").drop("version").html().build();
        return wrapper;
    }


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        return "/_secure/image-galleries/list";
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Page<ImageGallery> list(GlobalSearch search, Pageable pageable) {
        Page<ImageGallery> imagegallery = imagegalleryService.findAll(search, pageable);
        return imagegallery;
    }


    @RequestMapping(method = RequestMethod.GET, produces = "application/vnd.datatables+json")
    @ResponseBody
    public DatatablesData<ImageGallery> list(GlobalSearch search, DatatablesPageable pageable, @RequestParam("draw") Integer draw) {
        Page<ImageGallery> imagegallery = list(search, pageable);
        long allAvailableImageGallery = imagegalleryService.count();
        return new DatatablesData<ImageGallery>(imagegallery, allAvailableImageGallery, draw);
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String createForm(Model model) {
        populateForm(model, new ImageGallery());
        return "/_secure/image-galleries/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute ImageGallery imagegallery, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        MyArgUtils.print(result+"");
        if (result.hasErrors()) {
            MyArgUtils.print(result+"");
            populateForm(model, new ImageGallery());
            return "/_secure/image-galleries/create";
        }
        ImageGallery newImageGallery = imagegalleryService.save(imagegallery);
        redirectAttrs.addAttribute("id", newImageGallery.getId());
        return "redirect:/_secure/image-galleries/{id}";
    }


    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, imagegalleryService.findOne(id));
        return "/_secure/image-galleries/edit";
    }


    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute ImageGallery imagegallery, BindingResult result,
                         RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, imagegallery);
            return "/_secure/image-galleries/edit";
        }
        ImageGallery savedImageGallery = imagegalleryService.save(imagegallery);
        redirectAttrs.addAttribute("id", savedImageGallery.getId());
        return "redirect:/_secure/image-galleries/{id}";
    }


    @RequestMapping(value = "/del/{id}", method = RequestMethod.DELETE, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        imagegalleryService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/image-galleries";
    }

    @RequestMapping(value = "/deleteImage/{id}", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ResponseEntity deleteImage(@PathVariable("id") Long id, Model model) {
        try {
            DocFile docFile = docFileService.findOne(id);
            String fName = filePathToGraphsDir + docFile.getDocFolder().getFolderPath() + File.separator + docFile.getFileName();
            //MyArgUtils.print("filename=" + fName);
            new File(fName).delete();
            docFileService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        ImageGallery im = imagegalleryService.findOne(id);
         DocFolder docFolder = docFolderService.findOne(im.getDocFolder().getId());
        List<DocFile> li = docFileService.findByDocFolderOrderByIdDesc(docFolder);
        model.addAttribute("imagegallery", imagegalleryService.findOne(id));
       // MyArgUtils.print(">" + li.size());
        model.addAttribute("docFiles", li);
        return "/_secure/image-galleries/show";
    }


    void populateForm(Model uiModel, ImageGallery imagegallery) {
        uiModel.addAttribute("imagegallery", imagegallery);
    }


    //..................

    @RequestMapping(value = "/part-one", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> partOne(@RequestParam String title, @RequestParam String description) {
        MyArgUtils.print("call > " + title + "," + description);
        try {
            ImageGallery imageGallery = new ImageGallery();
            imageGallery.setTitle(title);
            imageGallery.setDescription(description);
            imageGallery.setSysUser(loggedIn.getUser());
            imageGallery.setCreatedDate(MyArgUtils.nowJalali());
            imageGallery.setMainImageUrl(String.format("/download/ImageGallery/%s/decor.jpg", imageGallery.getFinglisTitle()));
            ImageGallery savedImageGallery = imagegalleryService.save(imageGallery);

            DocFolder docFolder = new DocFolder();
            String imgGalleryPath = filePathToGraphsDir + File.separator + DocFolderServiceImpl.IMAGE_GALLERY + File.separator + imageGallery.getFinglisTitle();
            MyArgUtils.folderCreateIfNotExist(imgGalleryPath);
            DocFolder imageGalleryRoot = docFolderService.createImageGalleryDirectoryIfNotExist();
            docFolder.setFolderName(imageGallery.getFinglisTitle());

            docFolder.setFolderPath(DocFolderServiceImpl.IMAGE_GALLERY + File.separator + imageGallery.getFinglisTitle());
            docFolder.setParentFolder(imageGalleryRoot);
            docFolderService.save(docFolder);

            savedImageGallery.setDocFolder(docFolder);
            imagegalleryService.save(savedImageGallery); // add  image parent doc by saving again

            return new ResponseEntity<>(savedImageGallery, HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<Object>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @RequestMapping(value = "/part-two", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> partTwo(@RequestParam Long id, MultipartHttpServletRequest request) {
        ImageGallery im = imagegalleryService.findOne(id);
        String originalFileName="";
        Iterator<String> itr = request.getFileNames();
        MultipartFile mpf = null;
        String extension = "";
        String fName = "";
        try {
            while (itr.hasNext()) {
                mpf = request.getFile(itr.next());
                originalFileName = mpf.getOriginalFilename();
                int idxOfDot = originalFileName.lastIndexOf('.');
                extension = originalFileName.substring(idxOfDot + 1);
                originalFileName = "decor." + extension;
                fName = filePathToGraphsDir + File.separator + im.getDocFolder().getFolderPath() + File.separator + originalFileName;
                //MyArgUtils.print("filename=" + fName);
                new File(fName).delete();
                FileCopyUtils.copy(mpf.getBytes(), new FileOutputStream(fName));
                DocFile docFile = new DocFile();
                docFile.setFileExtension(extension);
                docFile.setDocFolder(im.getDocFolder());
                docFile.setFileName(originalFileName);
                docFile.setFileSize(mpf.getSize() / 1024 + " Kb");
                docFileService.save(docFile);
                //MyArgUtils.print("> uploaded!");

            }


            //MyArgUtils.print(mpf.getSize()+"");

            FileMeta fileMeta = new FileMeta();
            fileMeta.setFileName(originalFileName);
            fileMeta.setFileSize(mpf.getSize() / 1024 + " Kb");
            fileMeta.setFileType(mpf.getContentType());
            return new ResponseEntity<>(fileMeta, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //...................
    @RequestMapping(value = "/part-three", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> partThree(@RequestParam long id, MultipartHttpServletRequest request) {
        ImageGallery im = imagegalleryService.findOne(id);
        Iterator<String> itr = request.getFileNames();
        MultipartFile mpf = null;
        String extension = "";
        String fName = "";
        try {
            while (itr.hasNext()) {
                mpf = request.getFile(itr.next());
                String originalFileName = mpf.getOriginalFilename();
                int idxOfDot = originalFileName.lastIndexOf('.');
                extension = originalFileName.substring(idxOfDot + 1);
                originalFileName = MyArgUtils.nowEpoch() + "." + extension;
                fName = filePathToGraphsDir + File.separator + im.getDocFolder().getFolderPath() + File.separator + originalFileName;
            //   MyArgUtils.print("filename=" + fName);
                new File(fName).delete();
                FileCopyUtils.copy(mpf.getBytes(), new FileOutputStream(fName));
                DocFile docFile = new DocFile();
                docFile.setFileExtension(extension);
                docFile.setDocFolder(im.getDocFolder());
                docFile.setFileName(originalFileName);
                docFile.setFileSize(mpf.getSize() / 1024 + " Kb");
                docFileService.save(docFile);
                //MyArgUtils.print("> uploaded!");

            }
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<Object>(im, HttpStatus.OK);
    }



    //..................
    @RequestMapping(value = "/update-text/{id}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public ResponseEntity<Object> updateDescription(@PathVariable("id") Long id,@RequestBody ImageGalleryRequest b) {
      //  MyArgUtils.print("call > " + b.toString());
        try {
            ImageGallery im = imagegalleryService.findOne(id);
            if(b.getTitle()!=null)
            im.setTitle(b.getTitle());

            if(b.getDescription()!=null)
            im.setDescription(b.getDescription());

            imagegalleryService.save(im);
            return new ResponseEntity<>(im, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //......................
    @RequestMapping(value = "/delete-album/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String deleteAlbum(@PathVariable("id") Long id) {
        try {
            ImageGallery im=imagegalleryService.findOne(id);
            imagegalleryService.delete(id);
            String folderName = filePathToGraphsDir+File.separator +im.getDocFolder().getFolderPath() ;
            org.apache.commons.io.FileUtils.deleteDirectory(new File(folderName));
        }catch (Exception e){
            e.printStackTrace();
        }
        return "redirect:/_secure/image-galleries";
    }

}