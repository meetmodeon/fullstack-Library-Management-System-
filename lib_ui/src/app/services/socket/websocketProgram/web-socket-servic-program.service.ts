import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { AnnouncementRequest, AnnouncementResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class WebSocketServicProgramService {
  private client!: Client;
  private newNotificationSubject =
    new BehaviorSubject<AnnouncementResponse | null>(null);
  private allNotificationSubject = new BehaviorSubject<AnnouncementResponse[]>(
    []
  );
  private unreadCountSubject = new BehaviorSubject<number>(0);

  readonly newNotification$ = this.newNotificationSubject.asObservable();
  readonly allNotification$ = this.allNotificationSubject.asObservable();
  readonly unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    
  }
 connectIfNeeded() {
  if (!this.client || !this.client.active) {
    this.connect();
  }
}
  private connect(): void {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/api/v1/ws',
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      this.unreadCount();
      this.client.subscribe('/topic/getAllNotification', (msg: IMessage) => {
        if (msg.body) {
          const data = JSON.parse(msg.body);
          this.allNotificationSubject.next(data.listResponse);
        }
      });
      //Subscribe to new notifications
      this.client.subscribe('/topic/getNewNotification', (msg: IMessage) => {
        if (msg.body) {
          const data = JSON.parse(msg.body);
          const newNotification: AnnouncementResponse = data.response;

          this.newNotificationSubject.next(newNotification);

          const currentList = this.allNotificationSubject.getValue();
          this.allNotificationSubject.next([newNotification, ...currentList]);
        }
      });

      this.sendUnreadCount();
      this.getAllNotification();
    };
    this.client.activate();
  }
  unreadCount() {
    this.client.subscribe('/topic/getCount', (msg: IMessage) => {
      if (msg.body) {
        const data = JSON.parse(msg.body);
        this.unreadCountSubject.next(data.count);
      }
    });
  }
  sendUnreadCount() {
    this.client.publish({
      destination: '/app/send/unReadCount',
      body: '',
    });
  }

  sendAnnouncement(data: AnnouncementRequest) {
    this.client.publish({
      destination: '/app/send/notification',
      body: JSON.stringify(data),
    });
  }

  getAllNotification() {
    this.client.publish({
      destination: '/app/send/allNotification',
      body: '',
    });
  }

  disconnect(): void {
    this.client.deactivate();
    console.log('WebSocket disconnected');
  }
}
