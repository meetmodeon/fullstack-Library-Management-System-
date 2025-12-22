import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';


@Component({
  selector: 'app-my-book',
  imports: [
    ProgressBarModule,
    NgClass
],
  templateUrl: './my-book.component.html',
  styleUrl: './my-book.component.scss'
})
export class MyBookComponent {
  progress=80;

  getBg(){
    return 'bg-yellow-400';
  }
  getBarColor(){
    return 'bg-black';
  }
}
