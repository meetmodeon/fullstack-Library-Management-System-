import { Injectable } from '@angular/core';
const TOKEN='token';
const USER='myData';

@Injectable({
  providedIn: 'root'
})
export class UserStorageSerivceService {
  
  constructor() { }

  // private isBrowser():boolean{
  //   return typeof window !=='undefined' && typeof window.localStorage !=='undefined';
  // }

  // public saveToken(token:string):void{
  //   if(this.isBrowser()){
  //      window.localStorage.removeItem(TOKEN);
  //      window.localStorage.setItem(TOKEN,token);
  //   }
  // }

  // static getToken():string|null{
  //   if(typeof window !=='undefined' && typeof window.localStorage !=='undefined'){
  //     return localStorage.getItem('token');
  //   }
  //   return null;
  // }

  // public saveData(userData:LoginResponse):void{
  //   if(this.isBrowser()){
  //     window.localStorage.removeItem(USER);
  //     window.localStorage.setItem(USER,JSON.stringify(userData));
  //   }
  // }

  // public static getUserData():LoginResponse|null{
  //   if(typeof window !=='undefined' && window.localStorage){
  //     const userData=window.localStorage.getItem(USER);
  //     return userData?JSON.parse(userData) as LoginResponse:null;
  //   }
  //   return null;
  // }

  // static getUserEmail():string|undefined{
  //   const user=this.getUserData();

  //   if(user ==null){
  //     return '';
  //   }
  //   return user.email;
  // }

  // static getUserRole():Array<string>{
  //   return this.getUserData()?.userRole??[];
  // }

  // static isAuthenticate():boolean{
  //   const token =this.getToken();
  //   return !!token;
  // }
}
