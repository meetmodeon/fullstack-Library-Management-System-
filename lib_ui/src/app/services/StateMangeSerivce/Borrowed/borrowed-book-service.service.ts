import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { BorrowedResponse } from '../../models';
import { getAllBorrowedList, GetAllBorrowedList$Params, getBorrowedByUserId } from '../../functions';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AuthServiceService } from '../../auth/auth-service.service';
import { UserServiceService } from '../User/user-service.service';
import { GetBorrowedByUserId$Params } from '../../functions';

@Injectable({
  providedIn: 'root'
})
export class BorrowedBookServiceService {
  private apiUrl=environment.apiUrl;
  private borrowedSubject=new BehaviorSubject<BorrowedResponse[]>([]);
  readonly borrwed$=this.borrowedSubject.asObservable();
  private borrowedListOfUserSubject=new BehaviorSubject<BorrowedResponse[]>([]);
  readonly borrowedListOfUser$=this.borrowedListOfUserSubject.asObservable();
  private isBorrowedLoadByUser=false;
  private isBorrowedLoad=false;
  constructor(
    private httpClient:HttpClient,
    private authService:AuthServiceService,
    private userService:UserServiceService,
    
  ) { }

  loadAllBorrowedBookOnce(){
    if(this.isBorrowedLoad) return;
    this.isBorrowedLoad=true;

    const params:GetAllBorrowedList$Params={
      page:0,
      size:100
    }
    getAllBorrowedList(this.httpClient,this.apiUrl,params,new HttpContext())
    .subscribe({
      next:(value)=>{
        this.borrowedSubject.next(value.body.content as BorrowedResponse[]);
      },
      error:(error:any)=>{
        this.isBorrowedLoad=false;
        console.error("Error in fetch the borrowed data");
      }
    })
  }
  refreshBorrowedBooks(borrowedBookResponse:BorrowedResponse):void{
    const currentList=this.borrowedSubject.getValue();
    this.borrowedSubject.next([borrowedBookResponse,...currentList]);
  }
  refreshBorrowedList(){
    this.isBorrowedLoad=false;
    this.loadAllBorrowedBookOnce();
  }

    loadAllBorrowedBookByUserId(){  
      if(this.isBorrowedLoadByUser) return;
      this.isBorrowedLoadByUser=true;
      const email=this.authService.getUserName() as string
      this.userService.getUserInfoByEmail(email).subscribe(user => {
  
      const params: GetBorrowedByUserId$Params = {
        userId: user.userId as number,
        page: 0,
        size: 100
      };
  
      getBorrowedByUserId(this.httpClient, this.apiUrl, params)
        .subscribe(res => {
          this.borrowedListOfUserSubject.next(res.body?.content as BorrowedResponse[]);
        });
    });
    }
}
