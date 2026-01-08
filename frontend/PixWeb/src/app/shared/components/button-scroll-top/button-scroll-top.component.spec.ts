import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonScrollTopComponent } from './button-scroll-top.component';

describe('ButtonScrollTopComponent', () => {
  let component: ButtonScrollTopComponent;
  let fixture: ComponentFixture<ButtonScrollTopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonScrollTopComponent]
    });
    fixture = TestBed.createComponent(ButtonScrollTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
