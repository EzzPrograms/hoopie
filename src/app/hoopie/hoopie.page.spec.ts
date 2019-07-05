import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoopiePage } from './hoopie.page';

describe('HoopiePage', () => {
  let component: HoopiePage;
  let fixture: ComponentFixture<HoopiePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoopiePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoopiePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
