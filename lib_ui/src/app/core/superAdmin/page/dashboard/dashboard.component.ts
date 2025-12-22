import { CommonModule, NgClass } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { Divider } from 'primeng/divider';
import { DashboardPageComponent } from '../dashboard-page/dashboard-page.component';
import { CapitalizationPipe } from '../../../../pipe/capitalization.pipe';
import { CategoriesOperationComponent } from '../category/categories-operation/categories-operation.component';
import { AuthServiceService } from '../../../../services/auth/auth-service.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { SubCategoryComponent } from '../category/sub-category/sub-category.component';
import { BookComponentComponent } from '../book-manage/book-component/book-component.component';
import { BookBorrowedComponent } from '../book-manage/book-borrowed/book-borrowed.component';
import { UserComponent } from '../user_manage/user/user.component';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { SettingComponent } from '../setting/setting.component';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AnnouncementType } from '../../../page/notification/notification.component';
import { downloadFile, DownloadFile$Params, postAnnouncement } from '../../../../services/functions';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import {
  AnnouncementRequest,
  AnnouncementResponse,
} from '../../../../services/models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgClass,
    Divider,
    CommonModule,
    FormsModule,
    DashboardPageComponent,
    CapitalizationPipe,
    CategoriesOperationComponent,
    SubCategoryComponent,
    BookBorrowedComponent,
    UserComponent,
    MyProfileComponent,
    SettingComponent,
    Dialog,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    ReactiveFormsModule,
    BookComponentComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private url = environment.apiUrl;
  left_width: number = 20;
  option = signal(sessionStorage.getItem('option') || 'dashboard');
  searchingData!: string;
  visible = signal<boolean>(false);
  userName = signal<string | null>('');
  imageUrl!: any;
  announcementForm!: FormGroup;
  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private messageSerivce: MessageService
  ) {
    this.announcementForm = this.fb.group({
      header: ['', Validators.required],
      message: ['', Validators.required],
      announcementType: new FormControl<AnnouncementType | null>(
        null,
        Validators.required
      ),
    });
    
    effect(()=>{
      sessionStorage.setItem('option',this.option());
    })
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.userName.set(this.authService.getUserName());
      const params:DownloadFile$Params={
        email:this.authService.getUserName() as string
      }
      downloadFile(this.http, this.url, params, new HttpContext()).subscribe({
        next: (res) => {
          const blob = res.body; // ✅ THIS IS THE REAL BLOB
          if (!blob) return;

          this.imageUrl = URL.createObjectURL(blob);
        },
        error: () => {
          console.error('Error fetching image');
        },
      });
    }
  }

  hasError(control: string, error: string) {
    return (
      this.announcementForm.get(control)?.hasError(error) &&
      this.announcementForm.get(control)?.touched
    );
  }

  onShow(value: string) {
    if (value === 'logout') {
      this.authService.logout();
      this.router.navigate(['/']);
    }
    this.option.set(value);
  }
  onSearch() {
    console.log('on searching data: ' + this.searchingData);
    this.searchingData = '';
  }
  onAnnouncement() {
    if (this.announcementForm.invalid) {
      this.announcementForm.markAllAsTouched();
      return;
    }
    const data: AnnouncementRequest = {
      title: this.announcementForm.get('header')?.value,
      message: this.announcementForm.get('message')?.value,
      type: this.announcementForm.get('announcementType')?.value,
    };

    if (this.announcementForm.valid) {
      postAnnouncement(
        this.http,
        this.url,
        { body: data },
        new HttpContext()
      ).subscribe({
        next: (_HttpResponse: any) => {
          const data = _HttpResponse.body as AnnouncementResponse;
          this.messageSerivce.add({
            severity: 'success',
            summary: 'Post Notice',
            detail: 'Announcement no' + data.announcementId + 'is posted',
            life: 3000,
          });
          this.announcementForm.reset();
          this.visible.set(false);
        },
        error: (HttpErrorRespose: any) => {
          const errorBody = HttpErrorRespose.error;
          console.log('Error Respons: ', HttpErrorRespose);
          this.visible.set(false);
          this.messageSerivce.add({
            severity: 'error',
            summary: `Error status ${errorBody.status}`,
            detail: `You have ${errorBody.errorMessage}`,
            life: 3000,
          });
        },
      });
    }
  }

}
