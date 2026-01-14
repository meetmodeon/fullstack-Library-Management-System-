import { HttpClient, HttpContext } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthServiceService } from '../../../services/auth/auth-service.service';
import { BookServiceService } from '../../../services/StateMangeSerivce/Book/book-service.service';
import { UserServiceService } from '../../../services/StateMangeSerivce/User/user-service.service';
import { environment } from '../../../../environments/environment';
import { UserResponse } from '../../../services/models';
import { BookResponse } from '../../../services/models';
import { take } from 'rxjs';
import { NgIf } from '@angular/common';
import {
  downloadBookFile,
  DownloadBookFile$Params,
} from '../../../services/functions';

export interface DigitalResponse {
  totalBook: number;
  totalBorrowed: number;
  listOfBookId: number[];
}
@Component({
  selector: 'app-digital-page',
  imports: [NgIf],
  templateUrl: './digital-page.component.html',
  styleUrl: './digital-page.component.scss',
})
export class DigitalPageComponent {
  baseUrl = environment.apiUrl;
  items = [1, 2, 3, 4, 5];
  downloadOrRead = 'download';
  digitalResponse!: DigitalResponse;
  listOfBook!: BookResponse[];
  constructor(
    private httpClient: HttpClient,
    private authService: AuthServiceService,
    private bookSerivce: BookServiceService,
    private userService: UserServiceService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.getDigitalDetail(this.authService.getUserName() as string);
    }
  }

  getDigitalDetail(email: string) {
    this.userService.getUserInfoByEmail(email).subscribe((user) => {
      console.log('the user id is', user.userId as number);
      this.httpClient
        .get(`${this.baseUrl}/bookBorrowed/digitalPage/${user.userId}`)
        .subscribe((res) => {
          this.digitalResponse = res as DigitalResponse;
          this.getListOfBookWithBookId();
        });
    });
  }

  getListOfBookWithBookId() {
    if (!this.digitalResponse) return;

    this.bookSerivce.books$.pipe(take(1)).subscribe((books: BookResponse[]) => {
      this.listOfBook = books.filter((book) =>
        this.digitalResponse.listOfBookId.includes(book.bookId as number)
      );
    });

    console.log('the list of book is: ', this.listOfBook);
  }

  getImageByBookId(id: any) {
    return this.bookSerivce.getBookImage(id as number);
  }
  readPdf(id: any) {
    const param: DownloadBookFile$Params = {
      bookId: id,
      type: 'BOOK_PDF',
    };
    downloadBookFile(
      this.httpClient,
      this.baseUrl,
      param,
      new HttpContext()
    ).subscribe({
      next: (response) => {
        const blob = response.body; // <-- this is the actual Blob
        if (!blob) return;

        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');

        // optional cleanup
        setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
      },
      error: (err) => {
        console.error('PDF open error', err);
      },
    });
  }
}
