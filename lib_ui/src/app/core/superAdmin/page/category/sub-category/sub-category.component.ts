import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import {  CategoryResponse, SubCategoryRequest, SubCategoryResponse } from '../../../../../services/models';
import { TableModule } from "primeng/table";
import { Divider } from "primeng/divider";
import { CapitalizationPipe } from '../../../../../pipe/capitalization.pipe';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { addSubCategory, AddSubCategory$Params } from '../../../../../services/functions';
import { environment } from '../../../../../../environments/environment';
import { CategoryServiceService } from '../../../../../services/StateMangeSerivce/category/category-service.service';
import { SubCategoryService } from '../../../../../services/StateMangeSerivce/subCategoryService/sub-category.service';
import { HttpClient, HttpContext } from '@angular/common/http';

@Component({
  selector: 'app-sub-category',
  imports: [CommonModule,TableModule, Divider, CapitalizationPipe,
    Dialog, ButtonModule, InputTextModule, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.scss',
})
export class SubCategoryComponent {
  private apiUrl=environment.apiUrl;
  sub_categoryFormGroup!: FormGroup;
  sub_categoryListData!: SubCategoryResponse[];
  sub_categoryData!: SubCategoryResponse;
  categoryListData!:CategoryResponse[];
  visible=false;
  rowNo=signal<number>(5)
  pageNo=signal<number>(0);

  constructor(private fb: FormBuilder,
    private categoryService:CategoryServiceService,
    private httpClient:HttpClient,
    private subCategoryService:SubCategoryService
  ) {
    this.sub_categoryFormGroup = this.fb.group({
      categoryId: ['', [Validators.required]],
      description: [''],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(){
    this.categoryService.loadCategoriesOnce();
    this.categoryService.categories$.subscribe({
      next:(value:any)=>{
        this.categoryListData=value as CategoryResponse[];
      }
    });
    this.subCategoryService.loadSubCategoriesOnce();
    this.subCategoryService.allSubCategoryResponse$.subscribe({
      next:(value:any)=>{
        this.sub_categoryListData=value as SubCategoryResponse[];
      }
    })
  }

  hasError(control:string,error:string){
    return this.sub_categoryFormGroup.get(control)?.hasError(error) &&
    this.sub_categoryFormGroup.get(control)?.touched;
  }
  onPageChange(event:any){
    this.pageNo.set(event.page);
    this.rowNo.set(event.rows);
   
  }
  getCategoryName(id:number){
    const category=this.categoryListData.find(c=>c.categoryId===id);
    return category?.name??"";
  }
  onShowCard(){
    this.visible=!this.visible;
  }

  

  addSubCategory(){
    if(this.sub_categoryFormGroup.invalid){
      this.sub_categoryFormGroup.markAllAsTouched();
      return;
    }
    this.visible=false;
    const params:AddSubCategory$Params={
      body:this.sub_categoryFormGroup.value as SubCategoryRequest
    }
   
    addSubCategory(this.httpClient,this.apiUrl,params,new HttpContext()).subscribe({
      next:(value:any)=>{
        console.log("add subcategory data: ",value);
      },
      error:(error:any)=>{
        console.log("This is error value in adding subcategory",error)
      }
    })
  }
  onUpdate(id:number){
    const data:any=this.sub_categoryListData.find(sub=>sub.categoryId ===id);
    this.sub_categoryFormGroup.patchValue(data);
   //this.sub_categoryFormGroup.get('categoryId')?.setValue(data.categoryId);
    this.visible=true;
    console.log("The id of subCategory: "+id)
  }
  onDelete(id:number){
    console.log("The id of subCategory: "+id);
  }
}
