import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConciliacionPage } from './conciliacion.page';

describe('ConciliacionPage', () => {
  let component: ConciliacionPage;
  let fixture: ComponentFixture<ConciliacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciliacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
