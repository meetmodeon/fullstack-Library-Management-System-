import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonHomeComponent } from './common-home.component';

describe('CommonHomeComponent', () => {
  let component: CommonHomeComponent;
  let fixture: ComponentFixture<CommonHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
