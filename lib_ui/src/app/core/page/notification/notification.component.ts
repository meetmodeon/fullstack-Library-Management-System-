import { Component, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { WebSocketServicProgramService } from '../../../services/socket/websocketProgram/web-socket-servic-program.service';
import { AnnouncementResponse } from '../../../services/models';
import { CommonModule } from '@angular/common';
import { markRead, MarkRead$Params } from '../../../services/functions';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../services/StateMangeSerivce/notification/notification.service';

export type AnnouncementType =
  | 'NEW_BOOK'
  | 'BOOK_DUE'
  | 'MEETING'
  | 'MILESTONE';

@Component({
  selector: 'app-notification',
  imports: [
    DrawerModule,
    ButtonModule,
    CommonModule,
    
],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  url=environment.apiUrl;
  visible=false;
  getAllNotification:AnnouncementResponse[]=[{
    "announcementId": 101,
  "title": "New Book Arrived",
  "message": "The book 'Clean Code' is now available in the library.",
  "type": "BOOK_DUE",
  "read": false,
  "createdAt": "2025-12-16T11:30:00"
  }];
  noticeType!:AnnouncementType;
  
  constructor(
    private httpClient:HttpClient,
    private noticeService:NotificationService
  ){}
  ngOnInit(){
    console.log("notification service: ")
    this.noticeService.loadAllNotification();
  }
  onShow(){
    this.visible=true;
  }
  getAllNewBookNotify(notice:AnnouncementType):AnnouncementResponse[]{
    return this.noticeService.getNotificationByType(notice);
  }
  markRead(announcementId:number|undefined){
    const params:MarkRead$Params={
      id:announcementId as number
    };
    markRead(this.httpClient,this.url,params,new HttpContext()).subscribe({
      next:(_HttpResponse:any)=>{
        const notifyData=_HttpResponse.body as AnnouncementResponse;
        
      },error:(HttpErrorResponse:any)=>{

      }
    })
  }
}
