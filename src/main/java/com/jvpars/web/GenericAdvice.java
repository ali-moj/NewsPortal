package com.jvpars.web;

import com.jvpars.domain.Bulletin;
import com.jvpars.domain.DocFolder;
import com.jvpars.domain.Menu;
import com.jvpars.domain.Setting;
import com.jvpars.dto.MenuDto;
import com.jvpars.service.api.BulletinService;
import com.jvpars.service.api.DocFolderService;
import com.jvpars.service.api.MenuService;
import com.jvpars.service.api.SettingService;
import com.jvpars.utils.MyArgUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class GenericAdvice {

    private DocFolderService folderService;

    private final SettingService settingService;

    private BulletinService bulletinService;
    private MenuService menuService;

    @Autowired
    public GenericAdvice(DocFolderService folderService,
                         SettingService settingService,
                         BulletinService bulletinService,
                         MenuService menuService) {
        this.folderService = folderService;
        this.settingService = settingService;
        this.bulletinService = bulletinService;
        this.menuService = menuService;
    }

    @ModelAttribute("folders")
    public List<DocFolder> getRootFolders() {
        return folderService.findAllByParentFolderIsNull();
    }

    @ModelAttribute("setting")
    public Setting getSetting(Model model) {

        List<Setting> settings = settingService.findTop1ByOrderByIdAsc();
        if (settings.size() > 0){
            return settings.get(0);
        }
        else{
            Setting resetting = new Setting();
            return settingService.save(resetting);
        }
    }

    @ModelAttribute("trandingNows")
    public List<Bulletin> getTrandingNow() {
        return bulletinService.findTop10ByOrderByIdDesc();
    }

    @ModelAttribute("menus")
    List<MenuDto> getMenus() {
        List<Menu> parents = menuService.findAllByParentIsNull();
        return menuMapper(parents);
    }


    @ModelAttribute("principal")
    Principal getp(Principal principal) {

        return principal;
    }

    private List<MenuDto> menuMapper(List<Menu> menus) {

        List<MenuDto> list = new ArrayList<>();
        for (Menu menu : menus) {
            MenuDto dto = new MenuDto(menu.getId(), menu.getTitle(), menu.getArrangment(), menuMapper(menu.getChildren()));
           // MyArgUtils.print(dto.toString());
            list.add(dto);
        }
        return list;
    }
}
