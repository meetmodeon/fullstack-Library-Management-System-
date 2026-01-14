import { Component, signal, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header/header.component";
import { CommonHomeComponent } from "../common-home/common-home.component";
import { BookCardComponent } from "../book-card/book-card.component";
import { BookLayoutComponent } from "../book-layout/book-layout.component";
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MyBookComponent } from "../my-book/my-book.component";
import { DigitalPageComponent } from "../digital-page/digital-page.component";
import { CycleHubComponent } from "../cycle-hub/cycle-hub.component";
import { BookServiceService } from '../../../services/StateMangeSerivce/Book/book-service.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { mostPopularBook, MostPopularBook$Params, recommendationBook, RecommendationBook$Params, trendingBook, TrendingBook$Params } from '../../../services/functions';
import { BookResponse, SubCategoryResponse } from '../../../services/models';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { getAllBooks, GetAllBooks$Params, getBorrowedByUserId, GetBorrowedByUserId$Params, searchBook, SearchBook$Params } from '../../../services/functions';
import { SortContentPipePipe } from '../../../pipe/sortContent/sort-content-pipe.pipe';
import { CapitalizationPipe } from '../../../pipe/capitalization.pipe';
import { SubCategoryService } from '../../../services/StateMangeSerivce/subCategoryService/sub-category.service';
import { UserServiceService } from '../../../services/StateMangeSerivce/User/user-service.service';
import { BorrowedResponse } from '../../../services/models';

export enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  LOST = 'LOST'
}

@Component({
  selector: 'app-dashboard',
  imports: [
    HeaderComponent,
    CommonHomeComponent,
    Menu,
    ButtonModule,
    FormsModule,
    BookCardComponent,
    MyBookComponent,
    DigitalPageComponent,
    CycleHubComponent,
    PaginatorModule,
    SortContentPipePipe,
    CapitalizationPipe

],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private baseUrl=environment.apiUrl;
  items = [{}];
  items2=[{}];
  datas=[1,2,3,4];
  allBookResponse!:BookResponse[];
  value!:any;
  selectedMenu!: string ;
 @ViewChild('book') child!:BookCardComponent;
 selectedBookId!:number;
 first=signal<number>(0);
 rows=signal<number>(10);
 allCategoryList!:SubCategoryResponse[];
 allBook!:BookResponse[];
 allBorrowedList!:BorrowedResponse[];
 totalBook=signal<number>(0);
 foundBookNo=signal<number>(0);
 bookStatus=signal<string>('Book Status');
 CategoryStatus=signal<string>('Categories')

  constructor(private httpClient:HttpClient,
    private authService:AuthServiceService,
    private bookService:BookServiceService,
    private subCategoryService:SubCategoryService,
    private userService:UserServiceService
  ){
    
  }

  onMethod(value: string) {
    switch (value) {
      case 'cycle':
        localStorage.setItem('page','cycle');
        this.selectedMenu = localStorage.getItem('page') as string;
      
        break;
      case 'browse':
        localStorage.setItem('page','browse')
        this.selectedMenu = localStorage.getItem('page') as string;
        this.getAllBooks();
        break;
      case 'my_book':
        localStorage.setItem('page','my_book')
        this.selectedMenu = localStorage.getItem('page') as string;
        break;
      case 'digital':
        localStorage.setItem('page','digital');
        this.selectedMenu = localStorage.getItem('page') as string;
        break;
      default:
        localStorage.setItem('page','home');
        this.selectedMenu =localStorage.getItem('page') as string;
    }
  }
  
  onShow(bookId:any){
    this.selectedBookId=bookId;
    this.child.showDialog();
    
  }
  ngOnInit() {
    const saveMenu=localStorage.getItem('page')??'home';
    if(saveMenu){
      this.selectedMenu=saveMenu as string;
    }
    this.getAllBooks();
    this.subCategoryService.loadSubCategoriesOnce();
    this.subCategoryService.allSubCategoryResponse$.subscribe((value)=>{
    this.allCategoryList=value;
    this.items = [
      {
        items:[
        {
          label: 'All',
          command:()=>{
            this.getAllBooks();
            this.CategoryStatus.set('All Category')
          }
        }
        ]
      },
      
      {
        items:this.allCategoryList.map(cat=>({
          label:cat.name,
          command:()=>{
            this.searching(cat.name as string);
            this.CategoryStatus.set(cat.name as string);
          }

        })),
        
      },
      ...(this.allCategoryList.length > 1 ? [{
            label: 'See more',
            command: () => this.allCategoryList
          }] : [])
    ];
    });
    
    this.items2 = [
      {
        label: this.bookStatus(),
        items: [
          {
            label:'ALL',
            command:()=>{
              this.getAllBooks();
              this.bookStatus.set('All')
            }
          },
          {
            label: 'AVAILABLE',
            command:()=>{
              this.getAllBookBaseOnStatus('AVAILABLE')
              this.bookStatus.set('AVAILABLE');
            }
          },
          {
            label: 'BORROWED',
            command:()=> {
              this.getAllBookBaseOnStatus('BORROWED');
              this.bookStatus.set('BORROWED');
            }
          }
        ]
      }
    ]

  }

  getAllBooks(){
    const param:GetAllBooks$Params={
      page:this.first(),
      size:this.rows()
    }
    getAllBooks(this.httpClient,this.baseUrl,param,new HttpContext())
    .subscribe({
      next:(value)=>{
        this.allBook=value.body.content as BookResponse[];
        this.allBookResponse=[...this.allBook];
        this.totalBook.set(this.allBook.length);
        this.foundBookNo.set(this.allBook.length);
      },
      error:(error)=>{
        console.log("Error on fetch data of book in dashboard");
      }
    })
  }

  onPageChange(event: PaginatorState) {
        this.first.set(event.first ?? 0);
        this.rows.set(event.rows ?? 20);
        this.getAllBooks();
  }
  getImageByBookId(id:any){
    this.bookService.loadBooksOnce();
    return this.bookService.getBookImage(id as number);
  }

  searchAllBook(text:HTMLInputElement){
    const word=text.value;
    text.value;
    this.searching(word);
  }
  searching(word:string){

    const params:SearchBook$Params={
      word:word,
      page:this.first(),
      size:this.rows()
    }
    searchBook(this.httpClient,this.baseUrl,params,new HttpContext())
    .subscribe({
      next:(value)=>{
       this.allBook=value.body.content as BookResponse[];
       if(this.allBook.length>0){
        this.allBookResponse=[...this.allBook];
        this.foundBookNo.set(this.allBookResponse.length);
       }
      },
      error:(error)=>{
        console.log('error in fetching data from dashboard searching method');
      }
    })
  }
  getAllBookBaseOnStatus(status:any){
    this.allBookResponse=this.allBook.filter(book=>{
      return book.bookStatus===status;
    });
    this.foundBookNo.set(this.allBookResponse.length);
  }
  
  ngOnDestroy(){
    localStorage.removeItem('page');
  }
}
