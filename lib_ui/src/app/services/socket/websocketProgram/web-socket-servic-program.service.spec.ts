import { TestBed } from '@angular/core/testing';

import { WebSocketServicProgramService } from './web-socket-servic-program.service';

describe('WebSocketServicProgramService', () => {
  let service: WebSocketServicProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketServicProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
