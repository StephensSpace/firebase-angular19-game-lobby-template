import { ComponentFixture, TestBed } from '@angular/core/testing';

import { URLoverlayComponent } from './urloverlay.component';

describe('URLoverlayComponent', () => {
  let component: URLoverlayComponent;
  let fixture: ComponentFixture<URLoverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [URLoverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(URLoverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
