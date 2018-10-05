import { TestBed, inject } from '@angular/core/testing';

import { BaseconfigService } from './baseconfig.service';

describe('BaseconfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseconfigService]
    });
  });

  it('should be created', inject([BaseconfigService], (service: BaseconfigService) => {
    expect(service).toBeTruthy();
  }));
});
