import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResetPasswordComponent } from "../../../page/password-reset/reset-password/reset-password.component";

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
  user = {
    userId:233,
    name: 'Sharwan Mahato',
    email: 'sharwan@gmail.com',
    phone: '98XXXXXXXX'
  };

  showPasswordForm = false;


  
  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
    email: ['', Validators.required,Validators.email],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    Opt: ['', Validators.required],
  });

  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
