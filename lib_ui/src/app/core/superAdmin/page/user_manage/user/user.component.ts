import { Component } from '@angular/core';
import { TableModule } from "primeng/table";
import { UserResponse } from '../../../../../services/models';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UserServiceService } from '../../../../../services/StateMangeSerivce/User/user-service.service';

@Component({
  selector: 'app-user',
  imports: [TableModule,
    TooltipModule,
    ChipModule,
    CommonModule,
     IconFieldModule, InputIconModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  userResponseData!:UserResponse;
  listOfUserResponseData!:UserResponse[];

  constructor(private userService:UserServiceService){}
  ngOnInit(){
    this.userService.onLoadAllUserOnce();
    this.userService.user$.subscribe({
      next:(value)=>{
        this.listOfUserResponseData=value;
      },
      error:()=>{
        console.error('Error in fetch user data');
      }
    })

  }
  getUserImage(email:string):string{
    return this.userService.getUserImage(email);
  }
}
