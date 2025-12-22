import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface MyJwtPayload extends JwtPayload{
  sub?:string;
  authorities?:string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private refreshUrl= environment.apiUrl+"/common/refreshToken";
  private isLoggedInSubject= new BehaviorSubject<boolean>(false);
  isLoggedIn$= this.isLoggedInSubject.asObservable();
  private refreshTimeOut:any=null;

  constructor(private http:HttpClient,
    private router:Router
  ) {
    this.restoreLoginState();
   }

   private restoreLoginState(){
    const token= localStorage.getItem('token');
    if(token){
      this.isLoggedInSubject.next(true)
      this.autoRefresh();
    }
   }

  saveToken(token:string):void{
    localStorage.removeItem('token');
    localStorage.setItem('token',token);
    this.autoRefresh();
  }

  getToken():string|null{
    return localStorage.getItem('token');
  }

  logout():void{

    if(this.refreshTimeOut){
      clearTimeout(this.refreshTimeOut);
      this.refreshTimeOut=null;
    }

    window.localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/']);
  }

  private decodeToken():MyJwtPayload | null{
    const token=this.getToken();
    if(!token) return null;

    try{
      return jwtDecode<MyJwtPayload>(token);
    }catch(e){
      return null;
    }
  }

  getUserName():string|null{
    return this.decodeToken()?.sub??null;
  }

  getUserRoles():string[]{
    return this.decodeToken()?.authorities??[];
  }

  isLoggedIn():boolean{
    const token= this.getToken();

    if(!token) return false;

    const decoded=this.decodeToken();

    if(!decoded || !decoded?.exp) return false;

    const isExpired= Date.now() >=decoded.exp *1000;
    return !isExpired;
  }

  hasRole(role:string):boolean{
    return this.getUserRoles().includes(role);
  }

  refreshToken():Observable<any>{
    let count=1;
    console.log("refresh token is calling count ",count++);
    return this.http.post(
      this.refreshUrl,
      {},
      { withCredentials: true}
    ).pipe(
      tap((response:any)=>{
        if(response?.jwt){
          this.saveToken(response.jwt);
        }
      }),
      catchError(()=>{
        this.logout();
        return of(null);
      })
    );
  }

  autoRefresh():void{
   
     const decoded= this.decodeToken();

    if(!decoded?.exp) return;

    const expiresInMs= decoded.exp *1000-Date.now();
    const refreshBeforeMs= expiresInMs-5000;

    if(refreshBeforeMs>0){
      this.refreshTimeOut=setTimeout(()=>{
        console.log("Meet this method call the refreshtoken method::  thanks you")
        this.refreshToken().subscribe();
      },refreshBeforeMs)
    }
  }

  // autoLogout():void{
  //   const decoded = this.decodeToken();
  //   if(!decoded?.exp) return;

  //   const expiresIn = decoded.exp * 1000-Date.now();

  //   if(expiresIn>0){
  //     setTimeout(()=>{
  //       this.logout();
  //       window.location.reload();
  //     },expiresIn);
  //   }
  // }
}
