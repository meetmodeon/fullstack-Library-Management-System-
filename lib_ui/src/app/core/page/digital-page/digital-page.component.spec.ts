import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalPageComponent } from './digital-page.component';

describe('DigitalPageComponent', () => {
  let component: DigitalPageComponent;
  let fixture: ComponentFixture<DigitalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
