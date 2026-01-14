import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { UserResponse } from '../../models';
import { HttpClient, HttpContext } from '@angular/common/http';
import {
  downloadBookFile,
  downloadFile,
  DownloadFile$Params,
  getAllUser,
  GetAllUser$Params,
  getUserByEmail,
} from '../../functions';
import { GetUserByEmail$Params } from '../../functions';
import { AuthServiceService } from '../../auth/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<UserResponse[]>([]);
  readonly user$ = this.userSubject.asObservable();
  private isUserLoding = false;
  private userInfoSubject = new BehaviorSubject<UserResponse>({
    email: '',
    name: '',
  });
  readonly userInfo$ = this.userInfoSubject.asObservable();
  private userImageCache = new Map<string, string>();
  constructor(
    private httpClient: HttpClient,
    private authService: AuthServiceService
  ) {}

  onLoadAllUserOnce() {
    if (this.isUserLoding) return;

    this.isUserLoding = true;
    const params: GetAllUser$Params = {
      page: 0,
      size: 100,
    };
    getAllUser(
      this.httpClient,
      this.apiUrl,
      params,
      new HttpContext()
    ).subscribe({
      next: (value) => {
        const users = value.body.content as UserResponse[];
        this.userSubject.next(users);

        users.forEach((user) => {
          this.fetchUserImage(user.email as string);
        });
      },
      error: (error) => {
        this.isUserLoding = false;
        console.log('Some error occur during fetching user');
      },
    });
  }

  private fetchUserImage(userEmail: string): void {
    if (this.userImageCache.has(userEmail)) return;

    this.userImageCache.set(userEmail, 'libr.jpg');

    const params: DownloadFile$Params = {
      email: userEmail,
    };
    downloadFile(
      this.httpClient,
      this.apiUrl,
      params,
      new HttpContext()
    ).subscribe({
      next: (res) => {
        if (res.body) {
          const imageUrl = URL.createObjectURL(res.body);
          this.userImageCache.set(userEmail, imageUrl);
        }
      },
      error: () => {
        this.userImageCache.set(userEmail, 'libr.jpg');
      },
    });
  }

  getUserImage(email: string): string {
    return this.userImageCache.get(email) ?? 'libr.jpg';
  }

  refreshUser(data: UserResponse): void {
    const currentList = this.userSubject.getValue();
    this.userSubject.next([data, ...currentList]);
  }

  getUserInfoByEmail(email: string):Observable<UserResponse> {
      return this.userInfo$.pipe(
        switchMap(user =>{
          if(user && user.userId){
            return of(user);
          }

          const params:GetUserByEmail$Params={email};
          return getUserByEmail(
            this.httpClient,
            this.apiUrl,
            params,
            new HttpContext()
          ).pipe(
            map(res=>{
              this.userInfoSubject.next(res.body as UserResponse);
              return res.body as UserResponse;
            })
          );
        }),
        filter(user=>!!user),
        take(1)
      );
    
    
  }

  ngOnDestroy(): void {
    this.userImageCache.forEach((url) => {
      if (url.startsWith('blob: ')) {
        URL.revokeObjectURL(url);
      }
    });
  }
}
