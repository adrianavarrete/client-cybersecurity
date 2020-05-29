import { TestBed } from '@angular/core/testing';

import { PaillierService } from './paillier.service';

describe('PaillierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaillierService = TestBed.get(PaillierService);
    expect(service).toBeTruthy();
  });
});
