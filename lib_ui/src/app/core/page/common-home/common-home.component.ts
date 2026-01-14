import { Component, ViewChild } from '@angular/core';
import { BookCardComponent } from "../book-card/book-card.component";
import { BookLayoutComponent } from "../book-layout/book-layout.component";
import { mostPopularBook, MostPopularBook$Params, recommendationBook, RecommendationBook$Params, trendingBook, TrendingBook$Params } from '../../../services/functions';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { BookResponse } from '../../../services/models';
import { SortContentPipePipe } from '../../../pipe/sortContent/sort-content-pipe.pipe';
import { BookServiceService } from '../../../services/StateMangeSerivce/Book/book-service.service';
import { CapitalizationPipe } from '../../../pipe/capitalization.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-common-home',
  imports: [BookCardComponent,
     SortContentPipePipe,
     CapitalizationPipe,
     CommonModule
    ],
  templateUrl: './common-home.component.html',
  styleUrl: './common-home.component.scss'
})
export class CommonHomeComponent {
  private baseUrl=environment.apiUrl;
  isVisible:boolean=false;
  @ViewChild('book') child!:BookCardComponent;
  selectedBookId!:number;
  trendingBookResponse!:BookResponse[];
  recommendedBookResponse!:BookResponse[];
  popularBookResponse!:BookResponse[];

  onShow(id:any){
    this.selectedBookId=id as number;
    this.isVisible=true;
     this.child.showDialog();
  }

  constructor(private httpClient:HttpClient,
    private authService:AuthServiceService,
    private BookService:BookServiceService
  ){
    this.getAllTrendingBook();
    this.getAllRecommendedBook();
    this.getAllPopularBook();
  }

  ngOnInit(){
    
  }

 getAllTrendingBook(){
     const param:TrendingBook$Params={
          page:0,
          size:7
        }
        trendingBook(this.httpClient,this.baseUrl,param,new HttpContext())
        .subscribe({
          next:(value)=>{
            if(value?.body){
            this.trendingBookResponse=value.body.content as BookResponse[];
            console.log(this.trendingBookResponse);
            }
          },
          error:(error)=>{
            console.log('Something error to fetch trending book');
          }
        })
  }
  getAllRecommendedBook(){
    if(this.authService.isLoggedIn()){
      const param:RecommendationBook$Params={
      page:0,
      size:7,
      email:this.authService.getUserName() as string
    }
    recommendationBook(this.httpClient,this.baseUrl,param,new HttpContext())
    .subscribe({
      next:(value)=>{
        if(value?.body){
          this.recommendedBookResponse=value.body.content as BookResponse[];
        }
      },
      error:(error)=>{
        console.log('Something error in fetching recommendation Book');
      }
    })
    }
  }
  getAllPopularBook(){
    const param:MostPopularBook$Params={
      page:0,
      size:7
    };
    mostPopularBook(this.httpClient,this.baseUrl,param,new HttpContext())
    .subscribe({
      next:(value)=>{
       if(value?.body){
         this.popularBookResponse=value.body.content as BookResponse[];
       }
      },
      error:(error)=>{
        console.log('Something fetching in mostPopularBook');
      }
    })
  }

  getBookImageById(id:any){
    this.BookService.loadBooksOnce();
    return this.BookService.getBookImage(id as number);
  }

}
