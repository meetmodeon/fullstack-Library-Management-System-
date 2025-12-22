import { Component, signal, Signal, ViewChild } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { NotificationComponent } from '../../notification/notification.component';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { ProfileSettingComponent } from "../../profile-setting/profile-setting.component";
import { Router} from '@angular/router';
import { WebSocketServicProgramService } from '../../../../services/socket/websocketProgram/web-socket-servic-program.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserResponse } from '../../../../services/models';
import { AuthServiceService } from '../../../../services/auth/auth-service.service';


@Component({
  selector: 'app-header',
  imports: [
    DividerModule,
    NotificationComponent,
    Menu,
    ButtonModule,
    CommonModule,

],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  url=environment.apiUrl;
  @ViewChild('notify') notify!:NotificationComponent;
  @ViewChild('profile') profile!:ProfileSettingComponent;
  unreadCount=signal<number>(0);
  userData!:UserResponse;
  onShowNotification(){
    this.notify.onShow();
  }
  constructor(
    private router:Router,
    private webService:WebSocketServicProgramService,
    private http:HttpClient,
    private authSerivce:AuthServiceService
  ){}
  
  items=[{}];
  
  ngOnInit(){
    this.webService.unreadCount$.subscribe(data=>{
      if(data){
        this.unreadCount.set(data);
      }
    })
    console.log("The user name is:: "+this.authSerivce.getUserName());
    this.items = [
            {
                label: 'Student Profile',
                items: [
                    {
                        label: 'Name'+' :'+this.authSerivce.getUserName(),
                       
                    },
                    {
                        label: 'Email'+" :"+"hiralal@gmail.com", 
                    },
                    {
                      label:"Book Recycle :"+"12 books"
                    },
                    {
                      label:"Log out",
                      icon:'pi pi-sign-out',
                      command:(()=>{
                        this.authSerivce.logout();
                        this.router.navigateByUrl('/');
                      })
                    }
                ]
            }
        ];
  }



}
