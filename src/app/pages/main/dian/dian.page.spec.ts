import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DianPage } from './dian.page';

describe('DianPage', () => {
  let component: DianPage;
  let fixture: ComponentFixture<DianPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DianPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
