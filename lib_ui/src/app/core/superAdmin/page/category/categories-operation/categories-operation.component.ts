import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpContext } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CategoryRequest, CategoryResponse } from '../../../../../services/models';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Divider } from "primeng/divider";
import { TableModule } from "primeng/table";
import { CapitalizationPipe } from '../../../../../pipe/capitalization.pipe';
import { Toast } from "primeng/toast";
import { CategoryServiceService } from '../../../../../services/StateMangeSerivce/category/category-service.service';
import { addCategory, AddCategory$Params, deleteCategoryById, DeleteCategoryById$Params, updateCategory, UpdateCategory$Params } from '../../../../../services/functions';
import { SubCategoryService } from '../../../../../services/StateMangeSerivce/subCategoryService/sub-category.service';

@Component({
  selector: 'app-categories-operation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Divider,
    TableModule,
    CapitalizationPipe,
    Toast
],
  templateUrl: './categories-operation.component.html',
  styleUrls: ['./categories-operation.component.scss'],
  providers: [MessageService]
})
export class CategoriesOperationComponent implements OnInit {

  
  categoryFormGroup: FormGroup;
  isEditMode = signal(false);
  selectedId = signal<number>(0);
  allCategoryResponse!:CategoryResponse[];
  pageNo = signal(0);
  rowNo = signal(10);
  loadingData = signal(false);

  private basicUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private categoryService: CategoryServiceService,
    private subCategorySerivce:SubCategoryService,

  ) {
    this.categoryFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.categoryService.loadCategoriesOnce();

    this.categoryService.categories$.subscribe(categories=>{
      if(categories){
        this.allCategoryResponse=categories;
      }
    })
  }

  /** Helper to check form errors */
  hasError(control: string, error: string) {
    return this.categoryFormGroup.get(control)?.hasError(error) &&
      this.categoryFormGroup.get(control)?.touched;
  }


  /** Pagination change */
  onPageChange(event: any) {
    this.pageNo.set(event.page);
    this.rowNo.set(event.rows);
  }

  /** Create or Update category */
  onSubmitForm() {
    if (this.isEditMode()) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }
 
  /** Create category */
  private createCategory() {
    const data = this.categoryFormGroup.value as CategoryRequest;
    const params:AddCategory$Params={
      body:data
    }
    addCategory(this.httpClient, this.basicUrl, params,new HttpContext()).subscribe({
      next: (value) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category created' });
        this.categoryFormGroup.reset();
        this.categoryService.refreshCategories(value.body as CategoryResponse);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create category' });
      }
    });
  }

  /** Edit button clicked */
  onUpdate(id: number) {
    const category = this.allCategoryResponse.find(c => c.categoryId === id);
    if (category) {
      this.categoryFormGroup.patchValue({ name: category.name });
      this.selectedId.set(id);
      this.isEditMode.set(true);
    }
  }

  /** Update category */
  private updateCategory() {
    if (this.selectedId() === null) return;
    const payload:UpdateCategory$Params= {
      id:this.selectedId(),
      body:this.categoryFormGroup.value as CategoryRequest
    }
   updateCategory(this.httpClient,this.basicUrl,payload,new HttpContext())
   .subscribe((response)=>{
    const data=response.body as CategoryResponse;
    this.categoryService.refreshCategories(data);
    this.subCategorySerivce.reloadSubCategory();
   })
  }

  /** Delete category */
  onDelete(id: number) {
    if (!confirm('Are you sure to delete this category?')) return;
    const deleteParams:DeleteCategoryById$Params={
      id:id
    }
    deleteCategoryById(this.httpClient, this.basicUrl, deleteParams,new HttpContext()).subscribe({
      next: () => {
        this.categoryService.reloadCategory()
        this.subCategorySerivce.reloadSubCategory();
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Category removed' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
      }
    });

    
  }

  /** Cancel edit */
  onCancelEdit() {
    this.categoryFormGroup.reset();
    this.isEditMode.set(false);
    this.selectedId.set(0);
  }

}
