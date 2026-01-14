import { Component, Input, signal, ViewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { BookResponse } from '../../../../services/models';
import { HttpClient, HttpContext } from '@angular/common/http';
import {
  getTopRatingBook,
  GetTopRatingBook$Params,
  mostPopularBook,
  MostPopularBook$Params,
  recommendationBook,
  RecommendationBook$Params,
  trendingBook,
  TrendingBook$Params,
} from '../../../../services/functions';
import { AuthServiceService } from '../../../../services/auth/auth-service.service';
import { BookServiceService } from '../../../../services/StateMangeSerivce/Book/book-service.service';
import { SubCategoryService } from '../../../../services/StateMangeSerivce/subCategoryService/sub-category.service';
import { Dialog } from 'primeng/dialog';
import { BookLayoutComponent } from "../../../page/book-layout/book-layout.component";
import { BookCardComponent } from '../../../page/book-card/book-card.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink,
    RouterModule,
    BookCardComponent,

    ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  private apiUrl = environment.apiUrl;
  items = [1, 2, 3, 4, 5, 6];
  listOfBook: BookResponse[] = [];
  listOfPopularBook:BookResponse[]=[];
  bookType = signal<string>('you');
  visible:boolean=false;
  selectedBookId!:number;
  @ViewChild('book') child!:BookCardComponent;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthServiceService,
    private bookService: BookServiceService,
    private subCategoryService: SubCategoryService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.bookService.loadBooksOnce();
      this.subCategoryService.loadSubCategoriesOnce();
      this.getRecommendationBook();
      this.getPopularBook();
    }
  }

  getBook(type: string) {
    this.bookType.set(type);
    switch (this.bookType()) {
      case 'trending':
        this.getTrendingBook();
        break;
      case 'rating':
        this.getTopRatingBook();
        break;
      default:
        this.getRecommendationBook();
        break;
    }
  }

  getRecommendationBook() {
    const params: RecommendationBook$Params = {
      email: this.authService.getUserName() as string,
      page: 0,
      size: 4,
    };

    recommendationBook(
      this.httpClient,
      this.apiUrl,
      params,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        if (value.body) {
          const data = value.body.content as BookResponse[];
          this.listOfBook = data;
        }
      },
      error: (error) => {
        console.log('some error on fetch the recommendation book');
      },
    });
  }

  getTrendingBook() {
    const params: TrendingBook$Params = {
      page: 0,
      size: 10,
    };
    trendingBook(
      this.httpClient,
      this.apiUrl,
      params,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        const data = value.body.content as BookResponse[];
        this.listOfBook = data;
      },
      error: (error) => {
        console.log('Error on fetching trending book');
      },
    });
  }

  getTopRatingBook() {
    const param: GetTopRatingBook$Params = {
      page: 0,
      size: 4,
    };
    getTopRatingBook(
      this.httpClient,
      this.apiUrl,
      param,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        const data = value.body.content as BookResponse[];
        this.listOfBook = data;
      },
      error: (error) => {
        console.log('Error on fetching trending book');
      },
    });
  }

  getPopularBook() {
    const params: MostPopularBook$Params = {
      page: 0,
      size: 7,
    };
    mostPopularBook(
      this.httpClient,
      this.apiUrl,
      params,
      new HttpContext()
    ).subscribe({
      next: (value:any) => {
        if (value.body) {
          const data = value.body.content as BookResponse[];
          this.listOfPopularBook = data;
        }
      },
      error: (error) => {
        console.log('some error on fetch the recommendation book');
      },
    });
  }
  getBookImage(bookId: number | undefined) {
    return this.bookService.getBookImage(bookId as number);
  }
  getSubCategoryName(subCategoriesId: number | undefined) {
    let name = this.subCategoryService.getSubCategoryName(
      subCategoriesId as number
    );
    if (name.length >= 8) {
      name = name.substring(0, 6) + '...';
    }
    return name;
  }

  showDialog(bookId:any){
    this.selectedBookId=bookId as number;
    if(this.child){
       this.child.showDialog();
    }
  }
}
