import { Component, ViewChild } from '@angular/core';
import { BookCardComponent } from "../book-card/book-card.component";
import { BookLayoutComponent } from "../book-layout/book-layout.component";

@Component({
  selector: 'app-common-home',
  imports: [BookCardComponent, BookLayoutComponent],
  templateUrl: './common-home.component.html',
  styleUrl: './common-home.component.scss'
})
export class CommonHomeComponent {

  isVisible:boolean=false;
   @ViewChild('book') child!:BookCardComponent;

  onShow(){
    this.isVisible=true;
     this.child.showDialog();
  }

}
