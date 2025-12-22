import { CommonModule } from '@angular/common';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputOtpModule } from 'primeng/inputotp';
import { sendOtp, SendOtp$Params, verifyOtp, VerifyOtp$Params, verifyOtpAndChangePassword, VerifyOtpAndChangePassword$Params } from '../../../../services/functions';
import { environment } from '../../../../../environments/environment';
import { PasswordResetData } from '../../../../services/models';
type Step = 'EMAIL' | 'OTP' | 'RESET';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputOtpModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private apiUrl=environment.apiUrl;
  step: Step = 'EMAIL';
  value=6;

  email = '';
  otpToken = '';

  countdown = 60;
  timer!: any;

  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /* ================= EMAIL STEP ================= */

  sendOtp() {
    this.email = this.emailForm.value.email;

    const params:SendOtp$Params={
      email:this.email
    }
    
    sendOtp(this.http,this.apiUrl,params,new HttpContext()).subscribe(() => {
      this.step = 'OTP';
      this.startCountdown();
    });
  }

  /* ================= OTP STEP ================= */

  verifyOtp() {
    this.otpToken = this.otpForm.value.otp;
    const data:PasswordResetData={
      email:this.email,
      otp:this.otpToken
    }
    const params:VerifyOtp$Params={
      body:data
    }
    verifyOtp(this.http,this.apiUrl,params,new HttpContext()).subscribe(() => {
      this.stopCountdown();
      this.step = 'RESET';
    });
  }

  resendOtp() {
    this.sendOtp();
    this.otpForm.reset();
  }

  /* ================= RESET STEP ================= */

  resetPassword() {

    const data:PasswordResetData={
      email:this.email,
      otp:this.otpToken,
      newPassword:this.passwordForm.value.newPassword
    }
    const params:VerifyOtpAndChangePassword$Params={
      body:data
    }
    verifyOtpAndChangePassword(this.http,this.apiUrl,params,new HttpContext()).subscribe({
      next:() => {
      alert('Password updated successfully');
      this.resetAll();
    },
    error:()=>{
      this.step='OTP';
    }
    });
  }

  /* ================= TIMER ================= */

  startCountdown() {
    this.countdown = 125;
    this.stopCountdown();

    this.timer = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  resetAll() {
    this.step = 'EMAIL';
    this.emailForm.reset();
    this.otpForm.reset();
    this.passwordForm.reset();
    this.stopCountdown();
  }

  ngOnDestroy() {
    this.stopCountdown();
  }
}
