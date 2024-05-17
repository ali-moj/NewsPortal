package com.jvpars.web._secure;

import com.jvpars.domain.Slider;
import com.jvpars.service.api.SliderService;
import com.jvpars.utils.HtmlBuilder;
import com.jvpars.utils.MapWrapper;
import com.jvpars.utils.MyArgUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.List;

@RequestMapping("/_secure/sliders")
@Controller
@Secured("ROLE_ADMIN")
public class SlidersController {


    private SliderService sliderService;

    @Autowired
    public SlidersController(SliderService sliderService) {
        this.sliderService = sliderService;
    }

    @ModelAttribute("wrapper")
    private MapWrapper wrapper() {
        MapWrapper wrapper;
        wrapper = new HtmlBuilder.Builder(Slider.class).drop("id").drop("version").html().build();
        return wrapper;
    }

    @RequestMapping(method = RequestMethod.GET, produces = "text/html")
    public String getList(Model model) {
        List<Slider> sliders = (List<Slider>) sliderService.findAll();
        //MyArgUtils.print("list = " + sliders.size());
        model.addAttribute("sliders", sliders);
        return "_secure/sliders/list";
    }

    @RequestMapping(value = "/create-form", method = RequestMethod.GET, produces = "text/html")
    public String createMenu(Model model) {
        populateForm(model, new Slider());
        return "_secure/sliders/create";
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    public String create(@Valid @ModelAttribute Slider slider, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, new Slider());
            return "sliders/create";
        }
        Slider newslider = sliderService.save(slider);
        redirectAttrs.addAttribute("id", newslider.getId());
        return "redirect:/_secure/sliders/{id}";
    }

    @RequestMapping(value = "/edit-form/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String editForm(@PathVariable("id") Long id, Model model) {
        populateForm(model, sliderService.findOne(id));
        return "_secure/sliders/edit";
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_HTML_VALUE)
    public String update(@Valid @ModelAttribute Slider slider, BindingResult result, RedirectAttributes redirectAttrs, Model model) {
        if (result.hasErrors()) {
            populateForm(model, slider);
            return "_secure/sliders/edit";
        }

        Slider newSlider = sliderService.save(slider);
        redirectAttrs.addAttribute("id", newSlider.getId());
        return "redirect:/_secure/sliders/{id}";
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.TEXT_HTML_VALUE)
    public String delete(@PathVariable("id") Long id, Model model) {
        sliderService.delete(id);
        model.asMap().clear();
        return "redirect:/_secure/sliders";
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("slider",  sliderService.findOne(id));
        return "_secure/sliders/show";
    }


    void populateForm(Model uiModel, Slider slider) {
        uiModel.addAttribute("slider", slider);
    }
}
