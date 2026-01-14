import { inject } from "@angular/core"
import { AuthServiceService } from "../services/auth/auth-service.service"
import { Router } from "@angular/router";

export const loadGuard=()=>{

    const auth= inject(AuthServiceService);
    const router=inject(Router);
    if(auth.isLoggedIn()){
        if(auth.getUserRoles().includes('ROLE_ADMIN')){
            return true;
        }else{
            router.navigate(['dashboard']);
            return true;
        }
        
    }
    router.navigate(['/']);
    return false;

}