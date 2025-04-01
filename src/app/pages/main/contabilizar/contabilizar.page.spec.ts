import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContabilizarPage } from './contabilizar.page';

describe('ContabilizarPage', () => {
  let component: ContabilizarPage;
  let fixture: ComponentFixture<ContabilizarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilizarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
