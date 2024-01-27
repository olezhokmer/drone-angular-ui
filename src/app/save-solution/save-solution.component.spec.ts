import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSolutionComponent } from './save-solution.component';

describe('SaveSolutionComponent', () => {
  let component: SaveSolutionComponent;
  let fixture: ComponentFixture<SaveSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveSolutionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
