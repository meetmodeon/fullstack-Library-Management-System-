import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  imports: [
    HeaderComponent,
    CommonHomeComponent,
    BookLayoutComponent,
    Menu,
    ButtonModule,
    FormsModule,
    BookCardComponent,
    MyBookComponent,
    DigitalPageComponent,
    CycleHubComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  items = [{}];
  items2=[{}];
  datas=[1,2,3,4,5,6,7,8,9,10];
  value!:any;
  selectedMenu: string = 'home';
  @ViewChild('book') child!:BookCardComponent;

  onMethod(value: string) {
    switch (value) {
      case 'home':
        this.selectedMenu = 'home';
        break;
      case 'browse':
        this.selectedMenu = 'browse';
        break;
      case 'my_book':
        this.selectedMenu = 'my_book';
        break;
      case 'digital':
        this.selectedMenu = 'digital';
        break;
      default:
        this.selectedMenu = 'cycle'
    }
  }
  onBrowse() {
    this.selectedMenu = 'browse'
  }
  onShow(){
    this.child.showDialog();
  }
  ngOnInit() {
    this.items = [
      {
        label: 'All Categories',
        items: [
          {
            label: 'Installation',
            routerLink: '/installation'
          },
          {
            label: 'Configuration',
            routerLink: '/configuration'
          }
        ]
      },
    ];
    this.items2 = [
      {
        label: 'All Status',
        items: [
          {
            label: 'Installation',
          },
          {
            label: 'Configuration'
          },
          {
            label:'Science'
          },
          {
            label:'Technology'
          }
        ]
      }
    ]
  }
}
