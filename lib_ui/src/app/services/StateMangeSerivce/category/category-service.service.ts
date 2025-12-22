import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CategoryResponse } from '../../models';
import { getAllCategories, GetAllCategories$Params } from '../../functions';

@Injectable({
  providedIn: 'root',
})
export class CategoryServiceService {
   private apiUrl = environment.apiUrl;

  private categorySubject = new BehaviorSubject<CategoryResponse[] >([]);
  readonly categories$ = this.categorySubject.asObservable();

  private loaded = false; // 🚨 KEY PART

  constructor(private http: HttpClient) {}

  /** Fetch categories ONLY once */
  loadCategoriesOnce(): void {
    if (this.loaded) return; // 🔒 prevent second API call

    this.loaded = true;

    const params: GetAllCategories$Params = {
      page: 0,
      size: 100
    };

    getAllCategories(this.http, this.apiUrl, params, new HttpContext())
      .subscribe({
        next: (res: any) => {
          this.categorySubject.next(res.body.content as CategoryResponse[]);
        },
        error: () => {
          this.loaded = false; // allow retry if failed
          console.error('Failed to load categories');
        }
      });
  }

  /** Optional sync access */
  getCurrentCategories(): CategoryResponse[] {
    return this.categorySubject.getValue() ?? [];
  }

}
