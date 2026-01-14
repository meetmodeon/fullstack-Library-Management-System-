package com.meet.library.LMS.service;

import reactor.core.publisher.Flux;

public interface ChatService {

    public Flux<String> askBookAi(String userPrompt);
}
