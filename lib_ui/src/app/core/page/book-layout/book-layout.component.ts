import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { getBookById, GetBookById$Params } from '../../../services/functions';
import { environment } from '../../../../environments/environment';
import { BookResponse } from '../../../services/models';
import { BookServiceService } from '../../../services/StateMangeSerivce/Book/book-service.service';
import { getBookDetails, GetBookDetails$Params } from '../../../services/functions';
import { BookDetailResponse } from '../../../services/models';


@Component({
  selector: 'app-book-layout',
  imports: [],
  templateUrl: './book-layout.component.html',
  styleUrl: './book-layout.component.scss'
})
export class BookLayoutComponent {
  private apiUrl=environment.apiUrl;
   @Input() bookId!:number;
   bookResponse!:BookResponse;
   bookDetailResponse!:BookDetailResponse;

   constructor(
    private httpClient:HttpClient,
    private bookSerivce:BookServiceService,
   ){}

   ngOnInit(){

   //this.getBookById();
   }

   getBookById(){
    const params:GetBookDetails$Params={
      bookId:this.bookId
    }
    console.log('bookId: ',this.bookId);
    getBookDetails(this.httpClient,this.apiUrl,params,new HttpContext())
    .subscribe({
      next:(value)=>{
        this.bookDetailResponse=value.body as BookDetailResponse;
        console.log(this.bookResponse);
      },
      error:(error)=>{
        console.log('Something get error to fecth book');
      }
    })
   }
   getBookImageById(id:any):string{
    this.bookSerivce.loadBooksOnce();
    return this.bookSerivce.getBookImage(id as number);
   }
}
