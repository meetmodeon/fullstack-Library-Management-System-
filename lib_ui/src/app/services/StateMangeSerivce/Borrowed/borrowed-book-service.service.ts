import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { BorrowedResponse } from '../../models';
import { getAllBorrowedList, GetAllBorrowedList$Params } from '../../functions';
import { HttpClient, HttpContext } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BorrowedBookServiceService {
  private apiUrl=environment.apiUrl;
  private borrowedSubject=new BehaviorSubject<BorrowedResponse[]>([]);
  readonly borrwed$=this.borrowedSubject.asObservable();
  private isBorrowedLoad=false;
  constructor(
    private httpClient:HttpClient,

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
}
