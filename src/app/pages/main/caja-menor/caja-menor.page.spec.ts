import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CajaMenorPage } from './caja-menor.page';

describe('CajaMenorPage', () => {
  let component: CajaMenorPage;
  let fixture: ComponentFixture<CajaMenorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaMenorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
