import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { AnnouncementResponse } from '../../models';




@Injectable({
  providedIn: 'root'
})
export class WebSocketServicProgramService {
  private client!:Client;
  private newNotificationSubject=new BehaviorSubject<AnnouncementResponse|null>(null);
  private allNotificationSubject=new BehaviorSubject<AnnouncementResponse[]>([]);
  private unreadCountSubject=new BehaviorSubject<number>(0);

  newNotification$=this.newNotificationSubject.asObservable();
  allNotification$=this.allNotificationSubject.asObservable();
  unreadCount$=this.unreadCountSubject.asObservable();

  constructor() { 
    this.connect();
  }

  private connect():void{
    this.client=new Client({
     brokerURL:'ws://localhost:8080/api/v1/ws',
     reconnectDelay:5000,
     debug:(str)=>console.log('[STOMP]',str),
    });

    this.client.onConnect=()=>{
      console.log('Connected to WebSocket');

      //Subscribe to new notifications
      this.client.subscribe('/topic/getNewNotification',(msg:IMessage)=>{
        if(msg.body){
          const data=JSON.parse(msg.body);
          this.newNotificationSubject.next(data.response);
          console.log('New Notification: ',data.response);
        }
      })

      //Subscribe to all notifications
      this.client.subscribe('/topic/getAllNotification',(msg:IMessage)=>{
        if(msg.body){
          const data=JSON.parse(msg.body);
          this.allNotificationSubject.next(data.listResponse);
          console.log('All Notification: ',data.listResponse);
        }
      })

      this.client.subscribe('/topic/getCount',(msg:IMessage)=>{
        if(msg.body){
          const data=JSON.parse(msg.body);
          this.unreadCountSubject.next(data.count);
          console.log('Unread Count:',data.count);
        }
      })
    }
     this.client.activate();
  }
 

  disconnect():void{
    this.client.deactivate();
    console.log('WebSocket disconnected');
  }
}
