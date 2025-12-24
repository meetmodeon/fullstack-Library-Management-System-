import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { BookResponse} from '../../models';
import { HttpClient, HttpContext } from '@angular/common/http';
import { downloadBookFile, DownloadBookFile$Params, getAllBooks, GetAllBooks$Params } from '../../functions';

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {
  private apiUrl= environment.apiUrl;
  private bookSubject= new BehaviorSubject<BookResponse[]>([]);
  readonly books$=this.bookSubject.asObservable();

  private bookImageCache=new Map<number,string>();
  private isBookLoading=false;

  constructor(private http:HttpClient) { }

  loadBooksOnce():void{
    if(this.isBookLoading) return;

    this.isBookLoading = true;

    const params:GetAllBooks$Params={
      page:0,
      size:100
    }

    getAllBooks(this.http,this.apiUrl,params,new HttpContext()).subscribe({
      next:(value:any)=>{
        const books=value.body.content as BookResponse[];
        this.bookSubject.next(books)
        
        //preload images
        books.forEach(book=>this.fetchBookImage(book.bookId as number))
      },
      error:()=>{
        this.isBookLoading=false;
        console.error('Failed to load books');
      }
    })
  }

   private fetchBookImage(bookId:number):void{
      if(this.bookImageCache.has(bookId)){
        return;
      }
  
      this.bookImageCache.set(bookId,'libr.jpg');
  
       const params:DownloadBookFile$Params={
        bookId:bookId,
        type:'BOOK_IMAGE'
      }
      downloadBookFile(this.http,this.apiUrl,params,new HttpContext()).subscribe({
        next:res=>{
          if(res.body){
             console.log("Book id is",params.bookId);
            const imageUrl=URL.createObjectURL(res.body);
            this.bookImageCache.set(bookId,imageUrl);
          }
        },
        error:()=>{
          this.bookImageCache.set(bookId,'libr.jpg');
        }
      });
  
    }
    getBookImage(bookId:number):string{
      return this.bookImageCache.get(bookId)??'libr.jpg';
    }
    refreshBooks(bookResponse:BookResponse):void{
      const currentList:BookResponse[]=this.bookSubject.getValue();
      this.bookSubject.next([bookResponse,...currentList]);
    }
    
  ngOnDestroy():void{
    this.bookImageCache.forEach(url=>{
      if(url.startsWith('blob: ')){
        URL.revokeObjectURL(url);
      }
    })
  }
}
