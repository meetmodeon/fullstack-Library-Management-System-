package com.meet.library.LMS.storage;

import com.meet.library.LMS.dto.request.StoredFile;
import com.meet.library.LMS.enums.FileType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.upload-dir}")
    private String uploadDir;

    //Upload

    public StoredFile upload(
            MultipartFile file,
            FileType type,
            String oldFilePath)
    {
        validate(file,type);

        try {
            Path basePath =Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();
            Path targetDir=basePath.resolve(type.getFolder());
            Files.createDirectories(targetDir);

            delete(oldFilePath);

            String fileName=generateFileName(file.getOriginalFilename());
            Path targetPath = targetDir.resolve(fileName);

            file.transferTo(targetPath.toFile());

            return new StoredFile(
                    type.getFolder()+"/"+fileName,
                    fileName,
                    file.getSize());
        } catch (IOException e) {
            throw new RuntimeException("Unable to upload file: "+e.getMessage());
        }

    }



    private void validate(MultipartFile file,FileType type){
        if(file==null || file.isEmpty()){
            throw new RuntimeException("File is empty");
        }
        if(file.getSize()>type.getMaxSize())
            throw new RuntimeException("File too large");

        if(!type.getContentTypes().contains(file.getContentType()))
            throw new RuntimeException("Invalid file type");

    }

    @Async("taskExecutor")
    private void delete(String oldFilePath){
        if(oldFilePath==null || oldFilePath.isBlank()) return;

        try {
            Path path=Paths.get(uploadDir)
                    .resolve(oldFilePath)
                    .normalize();
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new RuntimeException("Not deleted some error occur: "+e.getMessage());
        }
    }

    private String generateFileName(String originalFilename) {
        return UUID.randomUUID()+"_"+
                originalFilename.replaceAll("\\s+","_");
    }
}
