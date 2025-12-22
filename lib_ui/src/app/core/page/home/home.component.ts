import { Component } from '@angular/core';
import { LoginComponent } from "../../auth/login/login.component";
import { RegisterComponent } from '../../auth/register/register.component';

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
  option(){
    this.isLoginPage=!this.isLoginPage;
  }

}
