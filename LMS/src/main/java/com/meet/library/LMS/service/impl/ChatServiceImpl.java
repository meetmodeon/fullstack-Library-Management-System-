package com.meet.library.LMS.service.impl;


import com.meet.library.LMS.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
@Slf4j
public class ChatServiceImpl implements ChatService {
    private final ChatClient chatClient;
    public ChatServiceImpl(ChatClient.Builder chat){
        this.chatClient=chat.build();
    }

    @Override
    public Flux<String> askBookAi(String userPrompt){
        String systemIns= """
                You are a strict book-information assistant.
                
                Rules:
                1.Answer ONLY questions related to books.
                2.Allowed topics: book summaries, authors, genres, publication info,recommendations.
                3.If the question is NOT about books, reply exactly:
                "I only provide book Information."
                4. Do not answer anything outside book-related topics.
                5. Keep answers short and clear.
                """;

        return  chatClient.prompt()
                .system(systemIns)
                .user(userPrompt)
                .stream()
                .content();
    }
}
