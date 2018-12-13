import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksavailibilityComponent } from './booksavailibility.component';

describe('BooksavailibilityComponent', () => {
  let component: BooksavailibilityComponent;
  let fixture: ComponentFixture<BooksavailibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooksavailibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksavailibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
