package com.jvpars.web._secure;

import com.jvpars.domain.Setting;
import com.jvpars.selection.Status;
import com.jvpars.service.api.SettingService;
import com.jvpars.utils.BeanCopy;
import com.jvpars.utils.MyArgUtils;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

@RequestMapping("/_secure/settings")
@Controller
@Secured("ROLE_SUPER_ADMIN")
public class SettingsController {



    public SettingService settingService;


    @Autowired
    public SettingsController(SettingService settingService) {
        this.settingService = settingService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String list(Model model) {
        Setting setting=null;
        List<Setting> li = (List<Setting>) settingService.findAll();
        if(li.size()==0){
            setting=new Setting();
            setting=settingService.save(setting);
        }
        else setting=li.get(0);
        model.addAttribute("setting", setting);
        model.addAttribute("statuses", Arrays.asList(Status.values()));

        return "_secure/settings/create";
    }


    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute Setting setting, BindingResult result) {
        if (result.hasErrors()) {
            MyArgUtils.print("errr");
            return "redirect:/_secure/settings";
        }

        List<Setting> li = (List<Setting>) settingService.findAll();
        Setting originalSetting = li.get(0);

        BeanCopy bc = new BeanCopy(false, true);
        bc.copyProperties(originalSetting, setting);
        try {

            setting.setId(li.get(0).getId());
            setting.setVersion(li.get(0).getVersion());
            settingService.save(setting);
        } catch (Exception ex) {
            ex.printStackTrace();
     //       MyArgUtils.print(">>" + ex.getMessage());
        }


        return "redirect:/_secure/settings";

    }


    @RequestMapping(value = "/contacts-list", method = RequestMethod.POST)
    @ResponseBody
    public void saveContactsList(
            @RequestParam(value = "googleLink", required = false) String googleLink,
            @RequestParam(value = "companyAddress1", required = false) String companyAddress1,
            @RequestParam(value = "companyAddress2", required = false) String companyAddress2,
            @RequestParam(value = "companyTel", required = false) String companyTel,
            @RequestParam(value = "companyFax", required = false) String companyFax,
            @RequestParam(value = "companyEmail", required = false) String companyEmail,
            @RequestParam(value = "instagramLink", required = false) String instagramLink
    ) {
        List<Setting> li = (List<Setting>) settingService.findAll();
        Setting setting = li.get(0);

        setting.setGoogleLink(googleLink);
        setting.setInstagramLink(instagramLink);
        setting.setCompanyAddress1(companyAddress1);
        setting.setCompanyAddress2(companyAddress2);
        setting.setCompanyTel(companyTel);
        setting.setCompanyFax(companyFax);
        setting.setCompanyEmail(companyEmail);
        settingService.save(setting);
    }


    @RequestMapping(value = "/site-info", method = RequestMethod.POST)
    @ResponseBody
    public void saveSiteInfo(
            @RequestParam(value = "siteTitle", required = false) String siteTitle,
            @RequestParam(value = "siteAdress", required = false) String siteAdress,
            @RequestParam(value = "mainPageUrl", required = false) String mainPageUrl,
            @RequestParam(value = "copyRight", required = false) String copyRight
    ) {
        List<Setting> li = (List<Setting>) settingService.findAll();
        Setting setting = li.get(0);
        setting.setSiteTitle(siteTitle);
        setting.setSiteAdress(siteAdress);
        setting.setMainPageUrl(mainPageUrl);
        setting.setCopyRight(copyRight);
        settingService.save(setting);
    }


    @RequestMapping(value = "/dates-list", method = RequestMethod.POST)
    @ResponseBody
    public void saveDatesList(
            @RequestParam(value = "startDateDomain", required = false) String startDateDomain,
            @RequestParam(value = "endDateDomain", required = false) String endDateDomain,
            @RequestParam(value = "startDateServer", required = false) String startDateServer,
            @RequestParam(value = "endDateServer", required = false) String endDateServer,
            @RequestParam(value = "startDateSupport", required = false) String startDateSupport,
            @RequestParam(value = "endDateSupport", required = false) String endDateSupport
    ) {
        List<Setting> li = (List<Setting>) settingService.findAll();
        Setting setting = li.get(0);
        setting.setStartDateDomain(startDateDomain);
        setting.setEndDateDomain(endDateDomain);
        setting.setStartDateServer(startDateServer);
        setting.setEndDateServer(endDateServer);
        setting.setStartDateSupport(startDateSupport);
        setting.setEndDateSupport(endDateSupport);
        settingService.save(setting);
    }


    @RequestMapping(value = "/logos", method = RequestMethod.POST)
    @ResponseBody
    public void saveLogos(
            @RequestParam(value = "logo", required = false) String logo,
            @RequestParam(value = "whiteLogo", required = false) String whiteLogo,
            @RequestParam(value = "favIcon", required = false) String favIcon,
            @RequestParam(value = "panelIconWhite", required = false) String panelIconWhite,
            @RequestParam(value = "adminFaIcon", required = false) String adminFaIcon,
            @RequestParam(value = "panelIconGray", required = false) String panelIconGray
    ) {
        List<Setting> li = (List<Setting>) settingService.findAll();
        Setting setting = li.get(0);
        setting.setLogo(logo);
        setting.setWhiteLogo(whiteLogo);
        setting.setFavIcon(favIcon);
        setting.setPanelIconWhite(panelIconWhite);
        setting.setPanelIconGray(panelIconGray);
        setting.setAdminFaIcon(adminFaIcon);
        settingService.save(setting);
    }


    @RequestMapping(value = "/rules", method = RequestMethod.POST)
    @ResponseBody
    public void saveRules(@RequestParam(value = "rule", required = false) String rule) {
        List<Setting> li = (List<Setting>) settingService.findAll();
        Setting setting = li.get(0);
        setting.setRule(rule);
        settingService.save(setting);
    }

    @RequestMapping(value = "/about-us", method = RequestMethod.POST)
    @ResponseBody
    public void saveAbout(@RequestParam(value = "about", required = false) String about) {
        List<Setting> li = (List<Setting>) settingService.findAll();
        Setting setting = li.get(0);
        setting.setAbout(about);
        settingService.save(setting);
    }
    //about

    @RequestMapping(value = "/status/show",method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String showOnlyRemainingDates(Model model) {
        Setting setting=null;
        setting= settingService.findOne(1L);
        model.addAttribute("setting", setting);
        model.addAttribute("remainingDomain",setting.getEndDateDomain());
        model.addAttribute("remainingServer",setting.getEndDateServer());
        model.addAttribute("remainingSupport",setting.getEndDateSupport());
        return "_secure/status/show";

    }



}
