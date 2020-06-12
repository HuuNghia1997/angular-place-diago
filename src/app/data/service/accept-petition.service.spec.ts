import { TestBed } from '@angular/core/testing';

import { AcceptPetitionService } from './accept-petition.service';

describe('AcceptPetitionService', () => {
  let service: AcceptPetitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptPetitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
