import { TestBed } from '@angular/core/testing';

import { RequestFileService } from './request-file.service';

describe('RequestFileService', () => {
  let service: RequestFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
