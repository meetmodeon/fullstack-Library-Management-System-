import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookBorrowedComponent } from './book-borrowed.component';

describe('BookBorrowedComponent', () => {
  let component: BookBorrowedComponent;
  let fixture: ComponentFixture<BookBorrowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookBorrowedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookBorrowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
