package com.meet.library.LMS.async;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class FileAsyncService {

    @Async
    public void deleteAsync(Path path){
        try {
            {
                if(Files.exists(path)){
                    Files.delete(path);;
                }
            }
        }catch (IOException e){
           e.getMessage();
        }
    }
}
