import { Component, Input, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { Rating } from 'primeng/rating';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { HttpClient, HttpContext } from '@angular/common/http';
import {
  addComment,
  AddComment$Params,
  getAllRatingByBookId,
  GetAllRatingByBookId$Params,
  getBookDetails,
  GetBookDetails$Params,
  getDetailsUpperRating,
  GetDetailsUpperRating$Params,
} from '../../../services/functions';
import { environment } from '../../../../environments/environment';
import {
  BookDetailResponse,
  RatingFeedbackDetailResponse,
  RatingUpperDetailsResponse,
} from '../../../services/models';
import { CapitalizationPipe } from '../../../pipe/capitalization.pipe';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { BookServiceService } from '../../../services/StateMangeSerivce/Book/book-service.service';
import {
  borrowedBook,
  BorrowedBook$Params,
  getUserByEmail,
  GetUserByEmail$Params,
  giveBookRating,
  GiveBookRating$Params,
} from '../../../services/functions';
import {
  BorrowedRequest,
  RatingFeedBackResponse,
  RatingRequest,
  UserResponse,
} from '../../../services/models';
import { MessageService } from 'primeng/api';
import { BorrowedBookServiceService } from '../../../services/StateMangeSerivce/Borrowed/borrowed-book-service.service';
import { UserServiceService } from '../../../services/StateMangeSerivce/User/user-service.service';

@Component({
  selector: 'app-book-card',
  imports: [
    Dialog,
    ButtonModule,
    ProgressBar,
    CommonModule,
    DividerModule,
    Rating,
    FormsModule,
    CapitalizationPipe,
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  private basicUrl = environment.apiUrl;
  visible: boolean = false;
  title: string = 'home';
  @Input() bookId!: number;
  selectedMenu: string = 'detail';
  value = 1;
  bookDetailsResponse!: BookDetailResponse;
  userId!: number;
  isShow = signal<boolean>(true);
  ratingUpperData: RatingUpperDetailsResponse = {};
  bookDes!: string;
  loading = false;
  nextCursor: number | null = 0;
  ratingResponse: RatingFeedbackDetailResponse[] = [];
  userInfoList: UserResponse[] = [];
  constructor(
    private httpClient: HttpClient,
    private authService: AuthServiceService,
    private bookService: BookServiceService,
    private messageService: MessageService,
    private borrowedSerivce: BorrowedBookServiceService,
    private userService: UserServiceService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      const params: GetUserByEmail$Params = {
        email: this.authService.getUserName() as string,
      };
      getUserByEmail(
        this.httpClient,
        this.basicUrl,
        params,
        new HttpContext()
      ).subscribe({
        next: (value) => {
          const data = value.body as UserResponse;
          this.userId = data.userId as number;
        },
        error: (error) => {
          console.log(
            'Something went wrong to fetch the user data from book-card-component ngOnInit method'
          );
        },
      });

      this.checkUserBorrowedBookOrNot();
    }
    this.userService.onLoadAllUserOnce();
    this.userService.user$.subscribe((value) => {
      this.userInfoList.push(...value);
    });
  }
  checkUserBorrowedBookOrNot() {
    this.borrowedSerivce.loadAllBorrowedBookByUserId();
    this.borrowedSerivce.borrowedListOfUser$.subscribe((value) => {
      value.forEach((b) => {
        if (b.status === 'BORROWED') {
          this.isShow.set(false);
          return;
        }
      });
    });
  }
  ngOnChanges() {
    if (this.bookId) {
      this.getBookDetails();
    }
  }

  showDialog() {
    this.visible = true;
  }
  resetAllValue(){
    this.selectedMenu='detail';
    this.visible=false;
  }

  onMethod(value: string) {
    if (value === 'detail') {
      this.selectedMenu = 'detail';
    } else {
      this.selectedMenu = 'review';
      this.getReviewDetail();
    }
  }
  onBorrow(bookId: any) {
    let payload: BorrowedRequest = {
      bookId: bookId,
      userId: this.userId,
    };
    const param: BorrowedBook$Params = {
      body: payload,
    };

    borrowedBook(
      this.httpClient,
      this.basicUrl,
      param,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        if (value.status == 201) {
          this.bookDetailsResponse.bookStatus = 'BORROWED';
          this.messageService.add({
            severity: 'success',
            summary: 'Borrowed',
            detail: 'Successfull borrowed',
            life: 998,
          });
          setInterval(() => {
            window.location.reload();
          }, 1000);
        }
      },
      error: (error) => {
        console.log(
          'Error on borrowed book in book-card-component on borrowedBook method'
        );
      },
    });
  }

  getBookDetails() {
    const param: GetBookDetails$Params = {
      bookId: this.bookId,
    };

    getBookDetails(
      this.httpClient,
      this.basicUrl,
      param,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        this.bookDetailsResponse = value.body as BookDetailResponse;
      },
      error: (error) => {
        console.log(
          'Something error on fetching bookDetails data in book-card components'
        );
      },
    });
  }

  getBookImageByBookId(id: any) {
    this.bookService.loadBooksOnce();
    return this.bookService.getBookImage(id as number);
  }

  getReviewDetail() {
    const params: GetDetailsUpperRating$Params = {
      bookId: this.bookId as number,
    };
    getDetailsUpperRating(
      this.httpClient,
      this.basicUrl,
      params,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        this.ratingUpperData = value.body as RatingUpperDetailsResponse;
        console.log(value.body as RatingUpperDetailsResponse);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error on fetching rating details',
          detail: 'Unable to get error',
          life: 3000,
        });
      },
    });

    this.loadMore();
  }

  getPerValue(value: any): number {
    if (value === '5') {
      const total = this.ratingUpperData?.totalReviewNo ?? 0;
      const rating5 = this.ratingUpperData?.rating_5 ?? 0;

      const res = total > 0 ? (rating5 / total) * 100 : 0;
      return res;
    } else if (value === '4') {
      const total = this.ratingUpperData?.totalReviewNo ?? 0;
      const rating4 = this.ratingUpperData?.rating_4 ?? 0;

      const res = total > 0 ? (rating4 / total) * 100 : 0;
      return res;
    } else if (value === '3') {
      const total = this.ratingUpperData?.totalReviewNo ?? 0;
      const rating_3 = this.ratingUpperData?.rating_3 ?? 0;

      const res = total > 0 ? rating_3 / total : 0;
      return res;
    } else if (value === '2') {
      const total = this.ratingUpperData?.totalReviewNo ?? 0;
      const rating2 = this.ratingUpperData?.rating_2 ?? 0;

      const res = total > 0 ? (rating2 / total) * 100 : 0;
      return res;
    } else {
      const total = this.ratingUpperData?.totalReviewNo ?? 0;
      const rating1 = this.ratingUpperData?.rating_1 ?? 0;

      const res = total > 0 ? (rating1 / total) * 100 : 0;
      return res;
    }
  }

  submitFeedBack() {
    const data: RatingRequest = {
      bookId: this.bookId as number,
      userId: this.userId as number,
      rating: this.value as number,
      comment: Array.of(this.bookDes as string),
    };
    const params: GiveBookRating$Params = {
      body: data as RatingRequest,
    };
    console.log('the rating datas are: ', params);
    giveBookRating(
      this.httpClient,
      this.basicUrl,
      params,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        const data=value.body as RatingFeedBackResponse;
        this.ratingResponse.push(data);
        this.bookDes='';
      },
      error: (error) => {},
    });
  }

  onScroll(event: any) {
    const element = event.target;

    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

    if (atBottom && !this.loading && this.nextCursor !== null) {
      this.loadMore();
    }
  }

  loadMore() {
   

    this.loading = true;
    console.log('loadMore method call');
    const param: GetAllRatingByBookId$Params = {
      bookId: this.bookId as number,
      cursor: this.nextCursor??0,
    };
    getAllRatingByBookId(
      this.httpClient,
      this.basicUrl,
      param,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        console.log('rating data is: ', value.body);
        const data = value.body as RatingFeedbackDetailResponse[];
        this.ratingResponse=data;
        if (data.length > 0) {
          this.nextCursor = Math.max(...data.map((r) => r.id as number));
        }
       
      },
      error: (error) => {
      },
    });
  }

  getUserNameById(id: any): string {
    return this.userInfoList.find((u) => u.userId === (id as number))?.name as string;
  }

  isUserImageHave(id:any):boolean{
    return this.userInfoList.find((u)=>u.userId ===id as number)?.profileUrl !==null;
  }
  getUserImage(id: any) {
    return this.userService.getUserImage(id);
  }
  isGiveRating():boolean{
    if(this.authService.isLoggedIn()){
      const data= this.userInfoList.find((u)=>u.email===this.authService.getUserName()) as UserResponse;
      this.ratingResponse.forEach((r)=>{
        if(r.userId === data.userId){
          return !r.active;
        }else{
          return true;
        }
      })
    }
    return true;
  }
  giveLoginUserRatingInfo():RatingFeedBackResponse|null{
    if(this.authService.isLoggedIn()){
      const data= this.userInfoList.find((u)=>u.email===this.authService.getUserName()) as UserResponse;
      this.ratingResponse.forEach((r)=>{
        if(r.userId === data.userId){
          return r;
        }else{
          return null;
        }
      })
    }
    return null;
  }
  submitFeedBackOnComment(id:any){
    const param:AddComment$Params={
      ratingId:id! as number,
      comment:this.bookDes
    }
    console.log(param);
    addComment(this.httpClient,this.basicUrl,param,new HttpContext())
    .subscribe({
      next:(value)=>{
      if(value.status===200){
        this.messageService.add({severity:"success",summary:"Posted comment",detail:"Comment are posted on the book",life:500})
        this.ratingResponse.forEach(r=>{
          if(r.id===id){
            r.comment?.push(this.bookDes);
          }
        })
        this.bookDes='';
      }
    },
    error:(error)=>{
      this.messageService.add({severity:"error",summary:"something went wrong",detail:"Error on post comment",life:3000});
    }
  })
  }
}
