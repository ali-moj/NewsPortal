package com.jvpars.dto;
import java.util.List;

public class MenuDto {

    private Long id;

    private String title;

    public MenuDto(){

    }

    public MenuDto(Long id, String title,  Integer arrangment,  List<MenuDto> children) {
        this.id = id;
        this.title = title;
        this.arrangment = arrangment;
        this.children = children;
    }



    private Integer arrangment ;

    private List<MenuDto> children;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getArrangment() {
        return arrangment;
    }

    public void setArrangment(Integer arrangment) {
        this.arrangment = arrangment;
    }

    public List<MenuDto> getChildren() {
        return children;
    }

    public void setChildren(List<MenuDto> children) {
        this.children = children;
    }

    @Override
    public String toString() {
        return "MenuDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", arrangment=" + arrangment +
                ", children=" + children +
                '}';
    }
}
