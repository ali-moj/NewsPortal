package com.jvpars.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DocFile {

    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    @Column(name = "id")
    private Long id;


    @Version
    @Column(name = "version")
    private Integer version;


    @NotNull
    private String fileName;


    @NotNull
    private String fileExtension;


    @NotNull
    private String fileSize;


    @Override
    public String toString() {
        return  this.fileName ;
    }

    @ManyToOne
    DocFolder docFolder;

}
