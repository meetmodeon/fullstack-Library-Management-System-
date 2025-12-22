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

import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { SubCategoryService } from '../../../../../services/StateMangeSerivce/subCategoryService/sub-category.service';
import { uploadBookImage, UploadBookImage$Params } from '../../../../../services/functions';
import { MessageService } from 'primeng/api';
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
  ],
  providers:[MessageService],
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
        this.isEdit ? this.book.author ?? [] : [],
        Validators.required
      ),
      bookStatus: this.fb.control<
        'AVAILABLE' | 'BORROWED' | 'LOST' | null | undefined
      >('AVAILABLE'),
      imageUrl: this.fb.control<string | null | undefined>(''),
      isbn: this.fb.control(
        this.isEdit ? this.book.isbn : '',
        Validators.required
      ),
      name: this.fb.control(
        this.isEdit ? this.book.name : '',
        Validators.required
      ),
      publication: this.fb.control(
        this.isEdit ? this.book.publication : '',
        Validators.required
      ),
      subCategoryId: this.fb.control<number|any>(
        this.isEdit ? this.book.subCategoriesId:'',
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
  ngAfterInit(){
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

  onShowCard() {
    this.visible = !this.visible;
  }

  getSubCategoryName(subCategoryId: number): string {
    if (this.listOfSubCategory.length === 0) {
      return '';
    }
    const name:string = this.listOfSubCategory.find(s=>s.subCategoryId===subCategoryId)?.name??'';
      return name;
  }

  submit() {
    if (this.bookFormGroup.invalid) {
      this.bookFormGroup.markAllAsTouched;
      return;
    }
    console.log('The book form data is:: ' + this.bookFormGroup.value);
    this.bookFormGroup.reset();
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
        const formData=new FormData();
        formData.append('file',file);
        const params:UploadBookImage$Params={
          bookId:this.selectedBookId,
          type:this.fileType(),
          body:formData
        }
        uploadBookImage(this.httpClient,this.baseUrl,params,new HttpContext()).subscribe({
          next:value=>{
            this.messageService.add({severity:'success',summary:"Ok",detail:"Upload book pdf success",life:3000});
          },
          error:error=>{
            this.messageService.add({severity:'error',summary:'Error',detail:'error some things',life:3000});
          }
        })
      }

    }

}
