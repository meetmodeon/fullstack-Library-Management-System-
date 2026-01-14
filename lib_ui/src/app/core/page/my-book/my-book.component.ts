import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { getBookById, getBorrowedByUserId, GetBorrowedByUserId$Params, returnedBook, ReturnedBook$Params, updateBookReturnIssueDate } from '../../../services/functions';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { BorrowedRequest, BorrowedResponse } from '../../../services/models';
import { BookServiceService } from '../../../services/StateMangeSerivce/Book/book-service.service';
import { SubCategoryService } from '../../../services/StateMangeSerivce/subCategoryService/sub-category.service';
import { UserServiceService } from '../../../services/StateMangeSerivce/User/user-service.service';
import { environment } from '../../../../environments/environment';
import { GetBookById$Params, UpdateBookReturnIssueDate$Params } from '../../../services/functions';
import { take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { BorrowedBookServiceService } from '../../../services/StateMangeSerivce/Borrowed/borrowed-book-service.service';


@Component({
  selector: 'app-my-book',
  imports: [
    ProgressBarModule,
    NgClass,
    DatePipe,
    NgIf
],
  templateUrl: './my-book.component.html',
  styleUrl: './my-book.component.scss'
})
export class MyBookComponent {
  baseUrl=environment.apiUrl;
  allBorrowedList!:BorrowedResponse[];
 

  constructor(
    private httpClient:HttpClient,
    private authService:AuthServiceService,
    private bookService:BookServiceService,
    private subCategoryService:SubCategoryService,
    private userService:UserServiceService,
    private messageService:MessageService,
    private borrowedService:BorrowedBookServiceService,
  ){}

  ngOnInit(){
    this.getAllBorrowedBookByUser();
    console.log('this is my-book section');
  }
  getAllBorrowedBookByUser(){   
  if(this.authService.isLoggedIn()){
    console.log('user info',this.authService.getUserName());
    this.borrowedService.loadAllBorrowedBookByUserId();
    this.borrowedService.borrowedListOfUser$.subscribe((value)=>{
      this.allBorrowedList=value;
      console.log(value);
    })
  }
  }

  getProgressDate(borrowedId:any){
    let data=this.allBorrowedList.find(b=>b.borrowedId===borrowedId);
    const startDate=new Date(data?.borrowedDate as string);
    const endDate=new Date(data?.returnedDate as string);

    const diffMs=endDate.getTime() - startDate.getTime();

    //convert millisSecond to days
    const diffDays=Math.floor(diffMs/(1000*60*60*24)) as number;

    const remainingDateStr=data?.remainingReturnDate?.slice(0,1);
    const remainingDate=Number(remainingDateStr);
    const percentage=((diffDays-remainingDate)/diffDays)*100;
    return percentage;
  }

  getBookNameById(bookId:any):string{
    let bookName!:string;
    this.bookService.books$.subscribe((books)=>{
      if(books.length>0){
        bookName=books.find(book=>book.bookId===bookId)?.name as string;
      }else{
        const param:GetBookById$Params={
          bookId:bookId
        }
        getBookById(this.httpClient,this.baseUrl,param,new HttpContext())
        .subscribe((book)=>{
          if(book.body){
            bookName=book.body.name as string;
          }
        })
      }
    });
    return bookName;
  }

  getBookAuthorById(bookId:any):string{
    let bookAuthor!:string;
    this.bookService.books$.subscribe((books)=>{
      if(books.length>0){
        const data=books.find(book=>book.bookId===bookId)?.author as string[];
        bookAuthor=data.join(',');
      }else{
        const param:GetBookById$Params={
          bookId:bookId
        }
        getBookById(this.httpClient,this.baseUrl,param,new HttpContext())
        .subscribe((book)=>{
          if(book.body){
            const authors=book.body.author as string[];
            bookAuthor=authors.join(',');
          }
        })
      }
    });
    return bookAuthor;
  }

   getBg(id:any){
    const data=this.allBorrowedList.find(b=>b.borrowedId===id);
    const remainingDateStr=data?.remainingReturnDate?.slice(0,1).trim();
    const remainingDate=Number(remainingDateStr);
    if(remainingDate<2){
      return 'bg-blue-400';
    }
    return 'bg-yellow-400';
  }
  getBarColor(){
    return 'bg-black';
  }

  onExtended(borrowedId:any){
    const param:UpdateBookReturnIssueDate$Params={
      borrowedId:borrowedId as number
    }
    updateBookReturnIssueDate(this.httpClient,this.baseUrl,param,new HttpContext())
    .subscribe({
      next:(value)=>{
        if(value.status===200){
          const data=value.body;
          const index=this.allBorrowedList.findIndex(b=>b.borrowedId===borrowedId);
          if(index != -1){
            this.allBorrowedList[index]=data;
          }
          this.messageService.add({severity:'success',summary:value.statusText,detail:value.body.remainingReturnDate,life:3000});
        }
      },
      error:(error)=>{
        this.messageService.add({severity:'error',summary:error.statusText,detail:error,life:3000});
      }
    })
  }
  onReturn(userId:any,bookId:any){
    const payload:BorrowedRequest={
      userId:userId as number,
      bookId: bookId as number
    }
    const param:ReturnedBook$Params={
      body:payload
    }
    returnedBook(this.httpClient,this.baseUrl,param,new HttpContext())
    .subscribe({
      next:(value)=>{
        if(value.status===200){
          const data=value.body;
          const index=this.allBorrowedList.findIndex(b=>b.borrowedId===data.borrowedId);
          if(index != -1){
            this.allBorrowedList[index]=data;
            this.messageService
            .add({severity:'success',summary:value.statusText,detail:'Book is returned',life:3000});
          }
        }
      },
      error:(error)=>{
        this.messageService
        .add({
          severity:'error',
          summary:"error on returinig data",
          detail:error,
          life:3000
        });
      }
    })
  }
}
