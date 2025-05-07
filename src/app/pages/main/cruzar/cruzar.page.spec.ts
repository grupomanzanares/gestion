import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CruzarPage } from './cruzar.page';

describe('CruzarPage', () => {
  let component: CruzarPage;
  let fixture: ComponentFixture<CruzarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CruzarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
