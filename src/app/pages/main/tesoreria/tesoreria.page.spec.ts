import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TesoreriaPage } from './tesoreria.page';

describe('TesoreriaPage', () => {
  let component: TesoreriaPage;
  let fixture: ComponentFixture<TesoreriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TesoreriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
