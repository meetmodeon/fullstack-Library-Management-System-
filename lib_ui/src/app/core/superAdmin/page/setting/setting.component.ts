import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResetPasswordComponent } from "../../../page/password-reset/reset-password/reset-password.component";
import { UserResponse } from '../../../../services/models';
import { UserServiceService } from '../../../../services/StateMangeSerivce/User/user-service.service';
import { AuthServiceService } from '../../../../services/auth/auth-service.service';

@Component({
  selector: 'app-setting',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ResetPasswordComponent
],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent implements OnInit{

  passwordForm!:FormGroup;
  user!:UserResponse;

  showPasswordForm = false;


  
  constructor(private fb: FormBuilder,
    private userService:UserServiceService,
    private authService:AuthServiceService,

  ) {
    this.passwordForm = this.fb.group({
    email: ['', Validators.required,Validators.email],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    Opt: ['', Validators.required],
  });

  }
  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
    this.userService.onLoadAllUserOnce();
    this.userService.user$.subscribe((value)=>{
      this.user=value.find(u=>u.email===this.authService.getUserName()) as UserResponse;
    })
    }
  }
 
  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
  }

  updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (
      this.passwordForm.value.newPassword !==
      this.passwordForm.value.confirmPassword
    ) {
      alert('Passwords do not match');
      return;
    }

    console.log(this.passwordForm.value);
    alert('Password updated successfully');
    this.passwordForm.reset();
    this.showPasswordForm = false;
  }

}
