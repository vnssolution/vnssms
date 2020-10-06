import { TestBed } from '@angular/core/testing';

import { VnsSharedService } from './vns-shared.service';

describe('VnsSharedService', () => {
  let service: VnsSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VnsSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
