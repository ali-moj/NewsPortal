package com.jvpars.dto;

public class FolderDto {

    Long parentFolderId;
    String folderName;

    public Long getParentFolderId() {
        return parentFolderId;
    }

    public void setParentFolderId(Long parentFolderId) {
        this.parentFolderId = parentFolderId;
    }

    public String getFolderName() {
        return folderName;
    }

    public void setFolderName(String folderName) {
        this.folderName = folderName;
    }

    @Override
    public String toString() {
        return "FolderDto{" +
                "parentFolderId=" + parentFolderId +
                ", folderName='" + folderName + '\'' +
                '}';
    }
}
