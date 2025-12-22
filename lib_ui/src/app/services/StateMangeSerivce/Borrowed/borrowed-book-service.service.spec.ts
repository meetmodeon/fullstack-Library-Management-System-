import { TestBed } from '@angular/core/testing';

import { BorrowedBookServiceService } from './borrowed-book-service.service';

describe('BorrowedBookServiceService', () => {
  let service: BorrowedBookServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BorrowedBookServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
