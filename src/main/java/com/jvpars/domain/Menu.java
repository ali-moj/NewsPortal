package com.jvpars.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;


    @Version
    @Column(name = "version")
    @JsonIgnore
    private Integer version;


    @JsonIgnore
    private boolean deleted;

    @NotNull
    private String title;

    @NotNull
    private String acl;

    private boolean mainPage;

    @NotNull
    private Integer arrangment;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Menu parent;


    @JsonIgnore
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Menu> children;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        Menu menu = (Menu) o;

        if (deleted != menu.deleted) return false;
        if (title != null ? !title.equals(menu.title) : menu.title != null) return false;
        return arrangment != null ? arrangment.equals(menu.arrangment) : menu.arrangment == null;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (deleted ? 1 : 0);
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (arrangment != null ? arrangment.hashCode() : 0);
        return result;
    }

    private String select2;

    @Override
    public String toString() {
        return this.title;
    }

    @PostLoad
    public void select2Chooser() {
        this.select2 = this.toString();
    }
}
