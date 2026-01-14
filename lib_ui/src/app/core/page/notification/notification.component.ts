import { Component, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { WebSocketServicProgramService } from '../../../services/socket/websocketProgram/web-socket-servic-program.service';
import { CommonModule } from '@angular/common';
import {  MakeUnRead$Params } from '../../../services/functions';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { markRead, MarkRead$Params } from '../../../services/fn/post-notification/mark-read';
import { AnnouncementResponse } from '../../../services/models';

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
  getAllNotification:AnnouncementResponse[]=[];
  noticeType!:AnnouncementType;
   groupedByType: Record<AnnouncementType, AnnouncementResponse[]> = {
      NEW_BOOK: [],
      BOOK_DUE: [],
      MEETING: [],
      MILESTONE: [],
    };
  constructor(
    private httpClient:HttpClient,
    private socketService:WebSocketServicProgramService
  ){}
  ngOnInit(){
    this.socketService.connectIfNeeded();
    this.socketService.allNotification$.subscribe(data => {
    if (data) {
      this.getAllNotification = data;
    }
  });
  }
  onShow(){
    this.visible=true;
  }
  getAllNewBookNotify(notice:AnnouncementType):AnnouncementResponse[]{
    this.groupedByType = {
        NEW_BOOK: [],
        BOOK_DUE: [],
        MEETING: [],
        MILESTONE: [],
      };
      this.getAllNotification.forEach((n) => {
        if (!this.groupedByType[n.type as AnnouncementType]) {
          this.groupedByType[n.title as AnnouncementType] = [];
        }
        this.groupedByType[n.type as AnnouncementType].push(n);
      });
    return this.groupedByType[notice]??[];
  }
  markRead(announcementId:number|undefined){
    const params:MarkRead$Params={
      id:announcementId as number
    };
    markRead(this.httpClient,this.url,params,new HttpContext()).subscribe({
      next:(_HttpResponse:any)=>{
        // const index=this.getAllNotification.findIndex(notic=>notic.announcementId===announcementId);
        this.getAllNotification.forEach(n=>{
          if(n.announcementId===announcementId){
            n.read=true
          }
        });
      },error:(HttpErrorResponse:any)=>{

      }
    })
  }
}
