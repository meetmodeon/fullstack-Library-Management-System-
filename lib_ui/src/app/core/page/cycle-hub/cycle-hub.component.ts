import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AnimatedCounterDirective } from "../../../directive/animated-counter.directive";

export interface RecycleHubResponse {
  totalBook: number;
  totalStudent: number;
  co2Save: number;
  growthRate: number;
  paperSaved: number;
  waterSaved: number;
  energySaved: number;
}

@Component({
  selector: 'app-cycle-hub',
  imports: [
    DividerModule, 
    AnimatedCounterDirective
  ],
  templateUrl: './cycle-hub.component.html',
  styleUrl: './cycle-hub.component.scss'
})
export class CycleHubComponent {
  basicUrl=environment.apiUrl;
  progressWidth=20;
  progressWidth2=10;
  recycleHubData!:RecycleHubResponse;

  constructor(private httpClient:HttpClient){}

  ngOnInit(){
    this.getRecycleHubDetail();
  }
  
  getRecycleHubDetail(){
    console.log('this recycle method calling');
    this.httpClient.get(`${this.basicUrl}/books/getRecycle`).subscribe((value)=>{
      console.log("recycle data: ",value);
      this.recycleHubData=value as RecycleHubResponse;
    })
  }


}
