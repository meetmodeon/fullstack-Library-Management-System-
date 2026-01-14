import { Component, signal, Signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { CapitalizationPipe } from '../../../../../pipe/capitalization.pipe';
import { Rating } from 'primeng/rating';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  BookRequest,
  BookResponse,
  SubCategoryResponse,
} from '../../../../../services/models';
import { BookServiceService } from '../../../../../services/StateMangeSerivce/Book/book-service.service';

import { HttpClient, HttpContext, HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { SubCategoryService } from '../../../../../services/StateMangeSerivce/subCategoryService/sub-category.service';
import { addBook, AddBook$Params, updateBookById, UpdateBookById$Params, uploadBookImage, UploadBookImage$Params } from '../../../../../services/functions';
import { MessageService } from 'primeng/api';
import { QuillModule } from 'ngx-quill';


type bookTypes='BOOK_IMAGE'|'BOOK_PDF'
@Component({
  selector: 'app-book-component',
  imports: [
    Dialog,
    ReactiveFormsModule,
    CapitalizationPipe,
    CommonModule,
    FormsModule,
    MultiSelectModule,
    Rating,
    ButtonModule,
    Divider,
    TableModule,
    QuillModule
  ],
  providers:[],
  templateUrl: './book-component.component.html',
  styleUrl: './book-component.component.scss',
})
export class BookComponentComponent {
  private baseUrl=environment.apiUrl;
  bookFormGroup!: FormGroup;
  book!: BookRequest;
  bookListData: BookResponse[] = [];
  visible = false;
  isEdit = false;
  statusOptions: Array<'AVAILABLE' | 'BORROWED' | 'LOST'> = [
    'AVAILABLE',
    'BORROWED',
    'LOST',
  ];
  allAuthors: string[] = [];
  authorInput: FormControl;
  listOfSubCategory!: SubCategoryResponse[];
  selectedBookId:number|null=null;
  fileType=signal<bookTypes>('BOOK_IMAGE');
  

  constructor(
    private fb: FormBuilder,
    private bookService: BookServiceService,
    private subCategoryService: SubCategoryService,
    private httpClient:HttpClient,
    private messageService:MessageService
  ) {
    this.authorInput = this.fb.control('');
    this.bookFormGroup = this.fb.group({
      author: this.fb.control<string[]>(
       [],Validators.required
      ),
      isbn: this.fb.control('',Validators.required
      ),
      name: this.fb.control( '',
        Validators.required
      ),
      publication: this.fb.control( '',
        Validators.required
      ),
      detail:this.fb.control('',[Validators.maxLength(5000)]),
      subCategoriesId: this.fb.control('',
        Validators.required
      ),
    });
  }

  ngOnInit() {
    this.bookService.loadBooksOnce();
    this.bookService.books$.subscribe({
      next: (value: any) => {
        this.bookListData = value as BookResponse[];
      },
    });
    this.subCategoryService.loadSubCategoriesOnce();
    this.subCategoryService.allSubCategoryResponse$.subscribe({
      next: (value: any) => {
        this.listOfSubCategory = value as SubCategoryResponse[];
      },
    });
    
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.bookFormGroup.patchValue({ imageUrl: file.name });
    }
  }

  hasError(control: string, error: string) {
    return (
      this.bookFormGroup.controls[control].touched &&
      this.bookFormGroup.controls[control].hasError(error)
    );
  }

  addAuthor() {
    const value = this.authorInput.value?.trim();
    if (value) {
      const authors = this.bookFormGroup.get('author')?.value || [];
      this.bookFormGroup.patchValue({ author: [...authors, value] });
    }
    this.authorInput = this.fb.control('');
  }

  removeAuthor(index: number) {
    const authors = this.bookFormGroup.get('author')?.value || [];
    authors.splice(index, 1);
    this.bookFormGroup.patchValue({ author: authors });
  }


  getSubCategoryName(subCategoryId: number | undefined): string {
    if (this.listOfSubCategory.length === 0) {
      return '';
    }
    const name:string = this.listOfSubCategory.find(s=>s.subCategoryId===subCategoryId as number)?.name??'';
    return name;
  }

    openAddForm(){
    this.isEdit=false;
    this.selectedBookId=null;
    this.bookFormGroup.reset();
    this.visible=true;
  }

  openEditForm(id:number){
    this.isEdit=true;
    this.selectedBookId=id;
    const data:BookResponse=this.bookListData.find(b=>b.bookId===this.selectedBookId) as BookResponse;

    this.bookFormGroup.patchValue({
      name:data.name,
      author:data.author,
      isbn:data.isbn,
      detail:data.detail??'',
      publication:data.publication,
      subCategoriesId:data.subCategoryId
    })
    this.visible=true;
  }

  submit() {
   if(this.isEdit){
    if(!this.selectedBookId){
      console.error("Invalid bookId",this.selectedBookId)
      return;
    }

    const params:UpdateBookById$Params={
      bookId:this.selectedBookId as number,
      body: this.bookFormGroup.value as BookRequest
    }

    updateBookById(this.httpClient,this.baseUrl,params,new HttpContext()).subscribe({
      next:(value)=>{
        if(value){
          console.log("the updated value is: ",value);
          this.bookService.refreshBooks(value.body as BookResponse);
          this.messageService.add({severity:"success",summary:"Updated",detail:"Book Updated successfully",life:300});
          this.bookFormGroup.reset();
          this.visible=false;
        }
      },
      error:(error:HttpErrorResponse)=>{
        this.messageService.add({
          severity:'error',
          summary:'Error',
          detail:error.statusText,
          life:3000
        });
      }
    })

    return;
   }else{
     if (this.bookFormGroup.invalid) {
      this.bookFormGroup.markAllAsTouched();
      return;
    }
    const params:AddBook$Params={
      body:this.bookFormGroup.value as BookRequest
    }
    console.log(params);
    addBook(this.httpClient,this.baseUrl,params,new HttpContext()).subscribe({
      next:(value)=>{
        const data=value.body as BookResponse;
        console.log('book response data when added',data);
        const currentList=this.bookListData;
        this.bookListData=[...currentList,data];
        this.messageService.add({severity:"success",summary:"Added Book",detail:"Book added successfully",life:3000});
        this.bookFormGroup.reset();
        this.visible=false;
      },
      error:(error)=>{
        this.messageService.add({severity:'error',summary:"Error",detail:"Something went wrong",life:3000});
        this.bookFormGroup.reset();
      }
    })
    this.bookFormGroup.reset();
   }
  }

  onUpdate(id: number) {
    const bookData = this.bookListData.find(
      (book) => book.bookId === id
    ) as BookRequest;
    this.book = bookData;
    this.isEdit = true;
    this.visible = true;

    this.bookFormGroup.patchValue({
      author: this.book.author ?? [],
      isbn: this.book.isbn ?? '',
      name: this.book.name ?? '',
      publication: this.book.publication ?? '',
      subCategoriesId: this.book.subCategoriesId ?? [],
    });
  }
  onDelete(id: number) {}


  getBookImage(bookId:number):string{
   return this.bookService.getBookImage(bookId);
  }

  onUploadFile(bookId:number,input:HTMLInputElement,file:'pdf'|'image'){
    this.selectedBookId=bookId;
    file==='image'?this.fileType.set('BOOK_IMAGE'):this.fileType.set('BOOK_PDF')
    setTimeout(()=>input.click(),0);
    }

    onFileSelected(event:any){
      const file:File=event.target.files[0];
        
      if(file && this.selectedBookId !==null){
        const params:UploadBookImage$Params={
         bookId:this.selectedBookId,
         type:this.fileType(),
         body:file
        }

        console.log("params data is: ",params);
        uploadBookImage(this.httpClient,this.baseUrl,params,new HttpContext()).subscribe({
          next:value=>{
            this.getBookImage(this.selectedBookId as number);
            this.messageService.add({severity:'success',summary:"Ok",detail:`Upload book ${this.fileType()} success`,life:3000});
            
          },
          error:error=>{
            this.messageService.add({severity:'error',summary:'Error',detail:'error some things',life:3000});
          }
        })
      }

    }

}
