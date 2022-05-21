import { TestBed } from '@angular/core/testing';

import { ChunkService } from './chunk.service';

describe('ChunkService', () => {
  let service: ChunkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChunkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
