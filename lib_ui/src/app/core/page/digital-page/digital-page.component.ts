import { Component } from '@angular/core';

@Component({
  selector: 'app-digital-page',
  imports: [],
  templateUrl: './digital-page.component.html',
  styleUrl: './digital-page.component.scss'
})
export class DigitalPageComponent {
  items=[1,2,3,4,5];
  downloadOrRead='download'
}
