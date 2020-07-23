import { TestBed } from '@angular/core/testing';

import { AllPetitionService } from './all-petition.service';

describe('AllPetitionService', () => {
  let service: AllPetitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllPetitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
