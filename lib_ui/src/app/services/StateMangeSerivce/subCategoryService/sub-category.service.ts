import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SubCategoryResponse } from '../../models';
import { getAllSubCategory, GetAllSubCategory$Params } from '../../functions';
;

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private apiUrl=environment.apiUrl;
  private subCategorySubject=new BehaviorSubject<SubCategoryResponse[]>([]);
  allSubCategoryResponse$=this.subCategorySubject.asObservable();

  private loding=false;
  
  constructor(private http:HttpClient) { }

  loadSubCategoriesOnce():void{
    if(this.loding) return;

    this.loding=true;

    const params:GetAllSubCategory$Params={
      page:0,
      size:100
    };
    getAllSubCategory(this.http,this.apiUrl,params,new HttpContext()).subscribe({
      next:(res:any)=>{
        this.subCategorySubject.next(res.body.content as SubCategoryResponse[]);
      },
      error:()=>{
        this.loding=false; //allow retry if failed
        console.error('Failed to load subCategories');

      }
    })
  }

  getAllSubCategoryResponse():SubCategoryResponse[]{
    return this.subCategorySubject.getValue();
  }
  setAllSubCategorySubject(list:SubCategoryResponse[]){
    this.subCategorySubject.next(list);
  }

}
