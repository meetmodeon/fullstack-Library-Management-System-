import { Component } from '@angular/core';
import { LoginComponent } from "../../auth/login/login.component";
import { RegisterComponent } from '../../auth/register/register.component';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [LoginComponent,
    RegisterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isLoginPage:boolean=true;
  
  constructor(
    private authService:AuthServiceService,
    private router:Router
  ){

  }
  ngOnInit(){
    if(this.authService.isLoggedIn()){
      if(this.authService.getUserRoles().includes('ADMIN')){
        this.router.navigate(['/admin/dashboard']);
      }else{
        this.router.navigate(['/dashboard']);
      }
    }
  }

  option(){
    this.isLoginPage=!this.isLoginPage;
  }
}
