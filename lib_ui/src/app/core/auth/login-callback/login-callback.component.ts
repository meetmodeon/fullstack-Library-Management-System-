import { Component } from '@angular/core';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-login-callback',
  imports: [
    Toast
  ],
  templateUrl: './login-callback.component.html',
  styleUrl: './login-callback.component.scss',
  providers:[MessageService]
})
export class LoginCallbackComponent {


  constructor(private authService:AuthServiceService,
    private route:ActivatedRoute,
    private router:Router,
    private messageService:MessageService
  ){}

  ngOnInit():void{
    this.route.queryParams.subscribe(params=>{
      const encodedResponse= params['loginResponse'];

      if(!encodedResponse){
        this.router.navigate(['/login']);
        return;
      }

      try{
        const decoded= decodeURIComponent(encodedResponse);

        const loginResponse= JSON.parse(decoded);

        this.authService.saveToken(loginResponse.jwt);
        this.router.navigate(['/dashboard']);
      }catch(error){
        this.messageService.add({severity: 'error', summary: 'Error Message', detail: 'Message Content', key: 'tl', life: 3000 })
      }
    })
  }

}
