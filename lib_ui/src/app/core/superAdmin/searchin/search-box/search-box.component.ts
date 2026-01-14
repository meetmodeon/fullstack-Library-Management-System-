import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { BookResponse } from '../../../../services/models';
import { searchBook, SearchBook$Params } from '../../../../services/functions';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CapitalizationPipe } from '../../../../pipe/capitalization.pipe';
import { BookCardComponent } from '../../../page/book-card/book-card.component';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-search-box',
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    CapitalizationPipe,
    BookCardComponent,
  ],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
})
export class SearchBoxComponent {
  basicUrl = environment.apiUrl;
  loading = false;
  searched = false;
  hasError = false;
  visible: boolean = false;
  searchingData!: string;
  selectedBookId!: number;
  @ViewChild('book') child!: BookCardComponent;
  listOfBookData: BookResponse[] = [];

  private seachSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {}

  showDialog() {
    this.visible = true;
  }
  resetChat() {
    this.searchingData = '';
    this.listOfBookData = [];
    this.loading = false;
  }

  onSearch() {
    const query = this.searchingData.trim();

    if (!query) {
      this.listOfBookData = [];
      this.searched = false;
      return;
    }

    const param: SearchBook$Params = {
      word: query,
      page: 0,
      size: 100,
    };
    this.loading = true;
    this.searched = true;
    this.hasError = false;

    searchBook(
      this.httpClient,
      this.basicUrl,
      param,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        if (value.status === 200 && value.body !== null) {
          console.log(value.body.content);
          this.listOfBookData = value.body.content as BookResponse[];
          this.searchingData = '';
        } else {
          this.listOfBookData = [];
        }
        this.loading = false;
        this.searchingData = '';
      },
      error: () => {
        this.loading = false;
        this.hasError = true;
        this.listOfBookData = [];
      },
    });
  }

  showBook(bookId: any) {
    this.selectedBookId = bookId as number;
    this.child.showDialog();
  }
}
