import { TestBed } from '@angular/core/testing';

import { UserStorageSerivceService } from './user-storage-serivce.service';

describe('UserStorageSerivceService', () => {
  let service: UserStorageSerivceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStorageSerivceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
