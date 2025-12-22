import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleHubComponent } from './cycle-hub.component';

describe('CycleHubComponent', () => {
  let component: CycleHubComponent;
  let fixture: ComponentFixture<CycleHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
