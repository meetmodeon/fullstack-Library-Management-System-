import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { login } from '../../../services/functions';
import { HttpClient, HttpContext } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../../../services/models';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterComponent } from "../register/register.component";
import { Divider } from "primeng/divider";
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    Toast
],
 providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private basicUrl=environment.apiUrl;
  isVisible:boolean=false;
 

   loginForm!: FormGroup;
   response:LoginResponse={
    jwt:'',
    refreshToken:''
   };

  constructor(private fb: FormBuilder,
    private http:HttpClient,
    private authService:AuthServiceService,
    private router:Router,
    private messageService:MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  hasError(control: string, error: string) {
    return this.loginForm.get(control)?.hasError(error) &&
           this.loginForm.get(control)?.touched;
  }

  onSubmit() {
    console.log("login button click");
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
   this.loginService(this.loginForm.value as LoginRequest).subscribe({
      next:((value)=>{
        if(value.jwt){
          this.authService.saveToken(value.jwt);
          this.messageService.add({
            severity:"success",
            summary:"Logged In",
            detail:'Logged in successfully',
            life:3000
          })
          setInterval(()=>{
            if(this.authService.getUserRoles().includes('ROLE_ADMIN')){
              this.router.navigate(['/admin/dashboard']);
            }else{
              this.router.navigate(['/dashboard']);
            }
          },1000)
        }
      }),
      error:((error)=>{
        
        this.messageService.add({severity: 'error', summary: 'Error', detail:error.errorMessage})
      })


      })
  }
  showPassword(){
    this.isVisible=!this.isVisible;
  }

  loginService(loginRequest:LoginRequest):Observable<any>{
    return this.http.post(`http://localhost:8080/api/v1/common/login`,loginRequest,{withCredentials:true})
  }
  
}
