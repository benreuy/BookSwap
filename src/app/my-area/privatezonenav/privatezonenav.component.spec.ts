import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatezonenavComponent } from './privatezonenav.component';

describe('PrivatezonenavComponent', () => {
  let component: PrivatezonenavComponent;
  let fixture: ComponentFixture<PrivatezonenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivatezonenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivatezonenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
