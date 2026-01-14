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
import { HttpClient, HttpContext } from '@angular/common/http';
import { UserResponse } from '../../../../services/models';
import { AuthServiceService } from '../../../../services/auth/auth-service.service';
import { UserServiceService } from '../../../../services/StateMangeSerivce/User/user-service.service';
import { getUserByEmail, GetUserByEmail$Params } from '../../../../services/functions';
import { CapitalizationPipe } from '../../../../pipe/capitalization.pipe';
import { ChatAiComponent } from "../../chat-ai/chat-ai.component";
@Component({
  selector: 'app-header',
  imports: [
    DividerModule,
    NotificationComponent,
    Menu,
    ButtonModule,
    CommonModule,
    CapitalizationPipe,
    ChatAiComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private apiUrl=environment.apiUrl;
  @ViewChild('notify') notify!:NotificationComponent;
  @ViewChild('profile') profile!:ProfileSettingComponent;
  @ViewChild('chat') chat!:ChatAiComponent;
  unreadCount=signal<number>(0);
  userData!:UserResponse;
  
  constructor(
    private router:Router,
    private webService:WebSocketServicProgramService,
    private http:HttpClient,
    private authSerivce:AuthServiceService,
    private userService:UserServiceService
  ){}

  onShowNotification(){
    this.notify.onShow();
  
  }
  showChat(){
    this.chat.showDialog();
  }
  
  items=[{}];
  
  ngOnInit(){
    this.webService.connectIfNeeded();
     this.getCount();
    if(this.authSerivce.isLoggedIn()){
      const params:GetUserByEmail$Params={
        email:this.authSerivce.getUserName() as string
      }
      getUserByEmail(this.http,this.apiUrl,params,new HttpContext()).subscribe({
        next:(value)=>{
          if(value.body){
            this.userData=value.body as UserResponse;
            console.log("User Data is: ",this.userData);
            this.items = [
            {
                label: 'Student Profile',
                items: [
                    {
                        label: `Name: ${this.userData.name?.toUpperCase()}`,
                       
                    },
                    {
                        label: `Email: ${this.userData.email}`, 
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
        },
        error:(error)=>{
          alert('something went wrong to fetch user'+error.error);
        }
      })
    }
  }

  // ngOnChanges(){
  //    this.getCount();
  // }

  getCount(){
    this.webService.unreadCount$.subscribe((value)=>{
      console.log("count unread msg: ",value)
      this.unreadCount.set(value);
    })
  }
  
}
