import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSolutionsComponent } from './shared-solutions.component';

describe('SharedSolutionsComponent', () => {
  let component: SharedSolutionsComponent;
  let fixture: ComponentFixture<SharedSolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSolutionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
