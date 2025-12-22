import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesOperationComponent } from './categories-operation.component';

describe('CategoriesOperationComponent', () => {
  let component: CategoriesOperationComponent;
  let fixture: ComponentFixture<CategoriesOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesOperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
