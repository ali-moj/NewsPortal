package com.jvpars.web._secure;
import com.jvpars.domain.DocFile;
import com.jvpars.domain.DocFolder;
import com.jvpars.domain.Menu;
import com.jvpars.dto.FolderDto;
import com.jvpars.service.api.DocFileService;
import com.jvpars.service.api.DocFolderService;
import com.jvpars.service.api.MenuService;
import com.jvpars.utils.FileMeta;
import com.jvpars.utils.FindOS;
import com.jvpars.utils.MyArgUtils;
import lombok.val;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.name.Rename;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;


@Controller
public class FileManagerController {

    @Autowired
    DocFolderService docFolderService;

    @Autowired
    DocFileService docFileService;

    @Autowired
    MenuService menuService;



    String filePathToGraphsDir= FindOS.getFileDirectory();



    @RequestMapping(value = "/_secure/upload",method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity upload(MultipartHttpServletRequest request,
                                @RequestParam(value = "folderId", required = true)  Long folderId,
                                 HttpServletResponse response) {

        FileMeta fileMeta = null;

        //MyArgUtils.print("File Upload =>folderId : " + folderId);
        val docFolder = docFolderService.findOne(folderId);
        String folderPath=docFolder.getFolderPath();
        folderPath=folderPath.replace("-", File.separator);
        //MyArgUtils.print("folderPath="+folderPath);

        String fPath = filePathToGraphsDir + File.separator +  folderPath;
        //MyArgUtils.print("folderPath with system ="+fPath);
        MyArgUtils.folderCreateIfNotExist(fPath);


        Iterator<String> itr = request.getFileNames();
        MultipartFile mpf = null;
        String extension = "";
        String fName = "";


        while (itr.hasNext()) {

            mpf = request.getFile(itr.next());
            String originalFileName=mpf.getOriginalFilename();


            originalFileName=originalFileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

            int idxOfDot = originalFileName.lastIndexOf('.');
            extension = originalFileName.substring(idxOfDot + 1);

           // long epoch = Instant.now().getMillis();
            // originalFileName = originalFileName.replaceAll("[^\\x20-\\x7e]", "");
            // originalFileName = originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");



            String name = "";

             //Get the last index of . to separate extension

            name = originalFileName.substring(0, idxOfDot);

            Path path = Paths.get(originalFileName);
            int counter = 1;
            File file = null;
            while(Files.exists(path)){
                originalFileName = name+"("+counter+")."+extension;
                path = Paths.get(originalFileName);
                counter++;
            }

            fName =fPath+File.separator+originalFileName;
      //      MyArgUtils.print("filename="+fName);
            new File(fName).delete();
            try {
                FileCopyUtils.copy(mpf.getBytes(), new FileOutputStream(fName));
                DocFile docFile=new DocFile();
                docFile.setFileExtension(extension);
                docFile.setDocFolder(docFolder);
                docFile.setFileName(originalFileName);
                docFile.setFileSize(mpf.getSize() / 1024 + " Kb");

                fileMeta = new FileMeta();
                fileMeta.setFileName(originalFileName);
                fileMeta.setFileSize(mpf.getSize() / 1024 + " Kb");
                fileMeta.setFileType(mpf.getContentType());

                docFileService.save(docFile);

            } catch (IOException e) {
                e.printStackTrace();

            }finally {
                MyArgUtils.print(originalFileName + "> uploaded!");
            }


            String MediumName=name+"_medium";
             //MyArgUtils.print("MediumName : " + MediumName);
            if( extension.equals("jpg")) {
                createThumb(fName, fPath);
                createMedium(originalFileName,fPath);
               }

        }



        return new ResponseEntity(fileMeta, HttpStatus.OK);

    }

    //..............................

    private void createThumb(String  Oname,String dir){
        try {
            File destinationDir = new File(dir);
            Thumbnails.of(Oname)
                    .forceSize(400, 250)
                    .toFiles(destinationDir, Rename.PREFIX_HYPHEN_THUMBNAIL);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    @ResponseBody
    @RequestMapping(value ="/_secure/get-file", method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    public
    ResponseEntity deleteFile(@RequestParam Long fileId) {
        try{
            DocFile docFile = docFileService.findOne(fileId);
            //docFileService.delete(fileId);
            return new ResponseEntity(docFile, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    @ResponseBody
    @RequestMapping(value ="/_secure/delete-file", method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    public
    ResponseEntity getFile(@RequestParam Long fileId) {
        try{
            DocFile docFile = docFileService.findOne(fileId);
            //MyArgUtils.print(docFile.getDocFolder().getFolderPath() + "-" + docFile.getFileName());

            String folderPath=docFile.getDocFolder().getFolderPath();
            folderPath=folderPath.replace("-", File.separator);
            //MyArgUtils.print("folderPath="+folderPath);

            String filePath = filePathToGraphsDir + File.separator +  folderPath+File.separator+docFile.getFileName();

            try {
                new File(filePath).delete();
                if (docFile.getFileExtension().equals("jpg")) {
                    //delete & thumb medium

                }

            }catch (Exception ex){
                ex.printStackTrace();
            }

            docFileService.delete(fileId);
            return new ResponseEntity(true, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    @ResponseBody
    @RequestMapping(value ="/_secure/folderlist", method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    public
    ResponseEntity getFoldersTree() {
        try{
            Iterable<DocFolder> folderList = docFolderService.findAll();
            return new ResponseEntity(folderList, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    @ResponseBody
    @RequestMapping(value ="/_secure/menulist", method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    public
    ResponseEntity getMenuList() {
        try{
            Iterable<Menu> menus = menuService.findAllByParentIsNull();
            return new ResponseEntity(menus, HttpStatus.OK);

        } catch (Exception ex) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

//...................................
    private void createMedium(String  Oname,String dir){
        try{
            Thumbnails.of(new File(dir + File.separator + Oname))
                    .forceSize(160, 100)
                    .toFile(new File(dir + File.separator + "medium_" + Oname));
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    @ResponseBody
    @RequestMapping(value ="/_secure/createFolder", method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createFolder( FolderDto folderDto) {
        //MyArgUtils.print("folderDto:" +folderDto.toString());
        try {
            String folderName = MyArgUtils.toPrettyURLWithPersianScape(folderDto.getFolderName());
            Long parentFolderId = folderDto.getParentFolderId();

            DocFolder docFolder = new DocFolder();
            DocFolder parentFolder;
            String folderPath, folderPathImmutable;


            if (parentFolderId == -1) {
                parentFolder = null;
                folderPathImmutable = FindOS.getFileDirectory() + File.separator + folderName;
                folderPath = folderName;
            } else {
                parentFolder = docFolderService.findOne(parentFolderId);
                String safeParentFolder = parentFolder.getFolderPath();
                safeParentFolder = safeParentFolder.replace("-", File.separator);
                //MyArgUtils.print("dir create error " + safeParentFolder);

                folderPathImmutable = FindOS.getFileDirectory() + File.separator + safeParentFolder + File.separator + folderName;
                folderPath = parentFolder.getFolderPath() + "-" + folderName;
            }
            MyArgUtils.folderCreateIfNotExist(folderPathImmutable);
            docFolder.setFolderPath(folderPath);
            docFolder.setFolderName(folderName);
            docFolder.setParentFolder(parentFolder);
            DocFolder savedDocFolder = docFolderService.save(docFolder);
            return new ResponseEntity(savedDocFolder, HttpStatus.OK);
        }catch (Exception ex){
            ex.printStackTrace();
            //MyArgUtils.print("dir create erorr " + ex.getMessage());
             return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }



    }


    //....................
    @ResponseBody
    @RequestMapping(value ="/_secure/folderFiles", method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    public
    ResponseEntity folders(@RequestParam Long folderId) {
       try{
           val docFolder = docFolderService.findOne(folderId);
           List<DocFile> files = docFileService.findByDocFolderOrderByIdDesc(docFolder);
           return new ResponseEntity(files, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }




    }
