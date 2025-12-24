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
import { addSubCategory, AddSubCategory$Params, updateSubCategory, UpdateSubCategory$Params } from '../../../../../services/functions';
import { environment } from '../../../../../../environments/environment';
import { CategoryServiceService } from '../../../../../services/StateMangeSerivce/category/category-service.service';
import { SubCategoryService } from '../../../../../services/StateMangeSerivce/subCategoryService/sub-category.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { MessageService } from 'primeng/api';

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

  isEditMode=false;
  selectedSubCategoryId:number|null=null;

  constructor(private fb: FormBuilder,
    private categoryService:CategoryServiceService,
    private httpClient:HttpClient,
    private subCategoryService:SubCategoryService,
    private messageService:MessageService,
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
  openAddForm(){
    this.isEditMode=false;
    this.selectedSubCategoryId=null;
    this.sub_categoryFormGroup.reset();
    this.visible=true;
  }

  
  openEditForm(id:number){
    this.isEditMode=true;
    this.selectedSubCategoryId=id;
    const data:SubCategoryResponse=this.sub_categoryListData.find(sub=>Number(sub.subCategoryId) ===id) as SubCategoryResponse;
    this.sub_categoryFormGroup.patchValue({
      name:data.name??'',
      describe:data.description??'',
      categoryId:data.categoryId??''
    });
    this.visible=true;

  }
  addSubCategory(){
   if(this.isEditMode){
    const data:SubCategoryRequest=this.sub_categoryFormGroup.value;
    const params:UpdateSubCategory$Params={
      id:this.selectedSubCategoryId as number,
      body:data
    }
    console.log(params);
    updateSubCategory(this.httpClient,this.apiUrl,params,new HttpContext())
    .subscribe({
      next:(value)=>{
        const data:SubCategoryResponse=value.body as SubCategoryResponse;
        console.log("received data: ",data)
        this.sub_categoryListData=this.sub_categoryListData.map(s=>s.subCategoryId===data.subCategoryId?data:s);
        this.messageService.add({severity:'success',summary:'Ok',detail:"Updated Successfully",life:3000});
        this.sub_categoryFormGroup.reset();
        this.visible=false;
      },
      error:(error)=>{
        this.messageService.add({severity:'error',summary:'error',detail:'Error on update subcategy',life:2000});
      }
    })
   }else{
     if(this.sub_categoryFormGroup.invalid){
      this.sub_categoryFormGroup.markAllAsTouched();
      return;
    }
    const params:AddSubCategory$Params={
      body:this.sub_categoryFormGroup.value as SubCategoryRequest
    }
   
    addSubCategory(this.httpClient,this.apiUrl,params,new HttpContext()).subscribe({
      next:(value:any)=>{
        console.log("add subcategory data: ",value);
        this.subCategoryService.refreshSubCategory(value.body as SubCategoryResponse);
        this.messageService.add({severity:"success",summary:"Added successfully",detail:"SubCategory is added Successfully",life:3000})
        this.sub_categoryFormGroup.reset();
      },
      error:(error:any)=>{
       this.messageService.add({severity:"error",summary:'Error',detail:error.error.errorMessage,life:2000});
      }
    })
   }
  }
  onDelete(id:number){
    console.log("The id of subCategory: "+id);
  }
}
