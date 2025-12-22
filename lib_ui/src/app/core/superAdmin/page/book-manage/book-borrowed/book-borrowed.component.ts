import { Component } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { Tag, TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { BookResponse, BorrowedResponse, UserResponse } from '../../../../../services/models';
import { BorrowedBookServiceService } from '../../../../../services/StateMangeSerivce/Borrowed/borrowed-book-service.service';
import { BookServiceService } from '../../../../../services/StateMangeSerivce/Book/book-service.service';
import { UserServiceService } from '../../../../../services/StateMangeSerivce/User/user-service.service';

@Component({
  selector: 'app-book-borrowed',
  imports: [
    TableModule
],
  templateUrl: './book-borrowed.component.html',
  styleUrl: './book-borrowed.component.scss'
})
export class BookBorrowedComponent {

bookBorrowedData!:BorrowedResponse;
listOfBorrowedBook!:BorrowedResponse[];
listOfBook!:BookResponse[];
listOfUser!:UserResponse[];

constructor(
  private borrowedService:BorrowedBookServiceService,
  private bookService:BookServiceService,
  private userService:UserServiceService
){}

ngOnInit(){
  this.borrowedService.loadAllBorrowedBookOnce();

  this.borrowedService.borrwed$.subscribe((listOfBorrowed)=>{
    if(listOfBorrowed){
      this.listOfBorrowedBook=listOfBorrowed;
    }
  })
  this.bookService.loadBooksOnce();
  this.bookService.books$.subscribe((books)=>{
    if(books){
      this.listOfBook=books;
    }
  })

  this.userService.onLoadAllUserOnce();
  this.userService.user$.subscribe({
    next:(value)=>{
      if(value){
        this.listOfUser=value;
      }
    }
  })
}
getListOfBookName(id: number): string {
 

  return this.listOfBook
  .find(book=>book.bookId===id)?.name??'';
}
getUserName(userId:number):string{
  return this.listOfUser.find(u=>u.userId===userId)?.email??'';
}

}
