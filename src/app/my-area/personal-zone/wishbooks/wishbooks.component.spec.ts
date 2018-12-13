import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishbooksComponent } from './wishbooks.component';

describe('WishbooksComponent', () => {
  let component: WishbooksComponent;
  let fixture: ComponentFixture<WishbooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishbooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
