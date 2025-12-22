import { Component } from '@angular/core';
import { FormsModule,FormGroup,FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginResponse, UserRequest, UserResponse } from '../../../services/models';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule, NgClass } from '@angular/common';
import { adminRegister, register } from '../../../services/functions';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";



@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    Toast
],
providers:[MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private basicUrl=environment.apiUrl;
   registerForm !: FormGroup;
   isAdmin:boolean=false;
   isVisible:boolean=false;

  roles: string[] = [];
  filteredRoles: string[] = [];

  constructor(private fb: FormBuilder,
    private http:HttpClient,
    private router:Router,
    private authService:AuthServiceService,
    private messageService:MessageService,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      userRole:this.fb.control<string[]>([]) // multi-select
    });
    const url=this.router.url;
    if(url.includes('/home')){
      this.roles=['STUDENT','TEACHER', 'LIBRARIAN', 'GUEST'];
    }else if(url.includes('/admin')){
      this.isAdmin=true;
      this.roles.push('ADMIN');
    }else{
      this.isAdmin=false;
    }
  }
  ngOnInit(){
    
  }
  get dto(): UserRequest {
    return this.registerForm.value as UserRequest;
  }

  showPassword(){
    this.isVisible=!this.isVisible;
  }
  
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    console.log("the registerFormData: ",this.registerForm.value);

     const req = this.isAdmin
    ? adminRegister(this.http, this.basicUrl, { body: this.registerForm.value }, new HttpContext())
    : register(this.http, this.basicUrl, { body: this.registerForm.value }, new HttpContext());

  req.subscribe({
    next: async (res) => {
      try {
        const data = await res.body as LoginResponse;
        console.log('Register success:', data);
        if(data?.jwt){
          this.authService.saveToken(data.jwt);
          setInterval(()=>{
            if(this.authService.getUserRoles().includes('ROLE_ADMIN')){
            this.router.navigate(['/admin/dashboard'])
          }else{
            this.router.navigate(['/dashboard'])
          }
          },2000);
        }
      } catch (err) {
        console.error('Failed to parse response', err);
      }
    },
    error: (err) => {
      console.error('Register failed', err);
    }
  });
    
  }
  
  filterRoles(event:any){
    const query= event.query?.toLowerCase()||'';

    this.filteredRoles=this.roles.filter(role=>
      role.toLowerCase().includes(query)
    );
  }

  showAll() {
  this.filteredRoles = [...this.roles];
}

selectRole(event:any){
  const roles= this.registerForm.get('userRole')?.value || [];
  //roles.push(event);
  this.registerForm.get('userRole')?.setValue(roles);
}

removeRole(event:any){
  let roles = this.registerForm.get('userRole')?.value || [];
  roles = roles.filter((r:string)=>r !==event);
  this.registerForm.get('userRole')?.setValue(roles);
}


  hasError(control: string, error: string) {
    const c = this.registerForm.get(control);
    return c?.hasError(error) && c?.touched;
  }
}
