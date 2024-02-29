import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixkeyAppComponent } from './pixkey.app.component';

describe('PixkeyAppComponent', () => {
  let component: PixkeyAppComponent;
  let fixture: ComponentFixture<PixkeyAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PixkeyAppComponent]
    });
    fixture = TestBed.createComponent(PixkeyAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
