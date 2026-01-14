import { Injectable, signal } from '@angular/core';
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
  first=signal<number>(0);
  rows=signal<number>(10);
  private loding=false;
  
  constructor(private http:HttpClient) { }

  loadSubCategoriesOnce():void{
    if(this.loding) return;

    this.loding=true;

    const params:GetAllSubCategory$Params={
      page:this.first(),
      size:this.rows()
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
  refreshSubCategory(data:SubCategoryResponse):void{
    const currentList=this.subCategorySubject.getValue();
    this.subCategorySubject.next([data,...currentList]);
  }
  reloadSubCategory(){
    this.loding=false;
    this.loadSubCategoriesOnce();
  }

  getSubCategoryName(subCategoryId: number | undefined): string {
    if(this.getAllSubCategoryResponse().length ===0){
      return '';
    }
    const name=this.getAllSubCategoryResponse().find(s=>s.subCategoryId===subCategoryId)?.name as string;
    return name;
  }
}
