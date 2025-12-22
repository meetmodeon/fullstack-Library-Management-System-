import { Component } from '@angular/core';

import { UserResponse } from '../../../../services/models';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../../services/auth/auth-service.service';
import { downloadFile, DownloadFile$Params, getUserById, GetUserById$Params, uploadProfile, UploadProfile$Params } from '../../../../services/functions';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent {
  isEditMode = false;
  file:File|null=null;
  preview:string|null=null
  imageUrl!:any;
  private apiUrl=environment.apiUrl;
  user: UserResponse={};

  profileForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService:AuthServiceService,
    private http:HttpClient,
    private messageService:MessageService
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      phoneNumber: ['']
    });
  }
  ngOnInit(){
    if(this.authService.isLoggedIn()){
      const userEmail=this.authService.getUserName() as string;
      const params:GetUserById$Params={
        email:userEmail
      }
      getUserById(this.http,this.apiUrl,params,new HttpContext()).subscribe({
        next:(value)=>{
          this.user=value.body as UserResponse;
          this.loadImage();
        },
        error:(error)=>{
          alert('error in fetch your data please login first');
        }
      })
    }
  }

  enableEdit() {
    this.isEditMode = true;
    this.profileForm.patchValue(this.user);
  }

  cancelEdit() {
    this.isEditMode = false;
  }

  onFileSelected(event:any){
    const selectedFile=event.target.files[0];
    if(selectedFile){
      this.file=selectedFile;

      //create image preview
      const reader=new FileReader();
      reader.onload=e=> this.preview=reader.result as string;
      reader.readAsDataURL(selectedFile);
    }
  }

  upload(){
    if(!this.file) return;
    const formData=new FormData();
    formData.append('img',this.file);
    if(this.authService.isLoggedIn()){
    const params:UploadProfile$Params={
      body:formData
    }
    uploadProfile(this.http,this.apiUrl,params,new HttpContext()).subscribe({
      next:(value:any)=>{
        this.messageService.add({severity:'success',summary:'Uploaded',detail:"Image uploaded successfully",life:3000});
        this.preview=null;
        this.file=null;
        this.loadImage();
      }
    })
    }
  }
  save() {
    if (this.profileForm.valid) {
      this.user = { ...this.user, ...this.profileForm.value };
      this.isEditMode = false;
    }
  }
  loadImage(){
     if(this.authService.isLoggedIn()){
      const userEmail=this.authService.getUserName() as string;
      const params:DownloadFile$Params={
        email:userEmail
      }
      downloadFile(this.http,this.apiUrl,params,new HttpContext())
      .subscribe({
        next:(res)=>{
          if(res.body){
            this.imageUrl=URL.createObjectURL(res.body);
          }else{
            this.imageUrl='libr.jpg';
          }
        },
        error:(err)=>{
          this.imageUrl='libr.jpg';
          console.log("Error to fetch user image for my-profile component");
        }
      })
    }
  }
}
