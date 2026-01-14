import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { environment } from '../../../../environments/environment';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

@Component({
  selector: 'app-chat-ai',
  imports: [CommonModule, FormsModule, Dialog],
  templateUrl: './chat-ai.component.html',
  styleUrl: './chat-ai.component.scss',
})
export class ChatAiComponent {
  basicUrl = environment.apiUrl;

  messages: ChatMessage[] = [];
  prompt = '';
  loading = false;
  visible: boolean = false;

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(private http: HttpClient) {}

  showDialog() {
    this.visible = true;
  }
  resetChat() {
    this.messages = [];
    this.prompt = '';
    this.loading = false;
  }
  sendMessage() {
    if (!this.prompt.trim()) return;

    // user message
    this.messages.push({
      role: 'user',
      content: this.prompt,
    });

    const userPrompt = this.prompt;
    this.prompt = '';
    this.loading = true;
    this.scrollBottom();
    const eventSource = new EventSource(
      `${this.basicUrl}api/v1/books/book-chat?prompt=${userPrompt}`
    );
    eventSource.onmessage = (res) => {
      try{
        const msg = JSON.parse(res.data);
      this.messages.push({
        role: 'ai',
        content: msg.content,
      });
      this.loading = false;
      this.scrollBottom();
      }catch(err){
        console.error("Failed to parse AI message:", err);
      }
    };
     eventSource.onopen=()=>{
        console.log("Connected to AI streaming server");
      }

      eventSource.onerror=(err)=>{
        console.error('Stream connection failed: ',err);
        this.messages.push({
        role: 'ai',
        content: "\n[Error: Unable to fetch AI response. Please try again.]",
      });
      eventSource.close();
      }
  }

  scrollBottom() {
    setTimeout(() => {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    }, 50);
  }
}
