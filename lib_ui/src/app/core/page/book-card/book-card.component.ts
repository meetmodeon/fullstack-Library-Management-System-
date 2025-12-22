import { Component, Input } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-book-card',
  imports: [
    Dialog, 
    ButtonModule,
    ProgressBar,
    CommonModule,
    DividerModule,
    Rating,
    FormsModule
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
visible: boolean = false;
title:string='home';
selectedMenu:string='detail'
value=5;
items=[1,2,4,5];

    showDialog() {
        this.visible = true;
    }

    onMethod(value:string){
     value==='detail'?this.selectedMenu='detail':this.selectedMenu='review';
    }
    onBorrow(){

    }
  
}
