package com.jvpars.web._secure;

import com.jvpars.domain.DocFolder;
import com.jvpars.service.api.DocFolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.util.List;

@RequestMapping("/_secure/folders")
@Controller
public class FolderController {


    DocFolderService service;

    @Autowired
    public FolderController(DocFolderService service) {
        this.service = service;
    }




    @RequestMapping(value = "/", method = RequestMethod.POST , produces =  MediaType.APPLICATION_JSON_VALUE)

    public String get(DocFolder docFolder) {
        List<DocFolder> rootFolders = service.findAllByParentFolderIsNull();


        return "edit";
    }

    @RequestMapping(value = "/create-folder", method = RequestMethod.POST , produces =  MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String editForm(DocFolder docFolder) {

        File theDir = new File(docFolder.getFolderName());

// if the directory does not exist, create it
        if (!theDir.exists()) {
            boolean result = false;
            try{
                theDir.mkdir();
                result = true;
            }
            catch(SecurityException se){
                //handle it
            }
            if(result) {
                System.out.println("DIR created");
            }
        }
        return "_secure/contents/edit";
    }
}
