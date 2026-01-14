package com.meet.library.LMS.enums;

import java.util.List;

public enum FileType {
    USER_IMAGE(
            "users",
            List.of("image/png","image/jpeg"),
            2*1024*1024
    ),
    BOOK_IMAGE(
            "books/images",
            List.of("image/png","image/jpeg"),
            2*1024*1024
    ),
    BOOK_PDF(
            "books/image",
            List.of("application/pdf"),
            20*1024*1024
    );


    private final String folder;
    private final List<String> contentTypes;
    private final long maxSize;

    FileType(String folder,List<String> contentTypes,long maxSize){
        this.folder=folder;
        this.contentTypes=contentTypes;
        this.maxSize=maxSize;
    }

    public String getFolder() {
        return folder;
    }

    public List<String> getContentTypes() {
        return contentTypes;
    }

    public long getMaxSize() {
        return maxSize;
    }
}
