import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabbedWindowComponent } from '@src/app/portfolio/fuzz-demo/demo-page/tabbed-window/tabbed-window.component';

describe('TabbedWindowComponent', () => {
  let component: TabbedWindowComponent;
  let fixture: ComponentFixture<TabbedWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabbedWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbedWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
