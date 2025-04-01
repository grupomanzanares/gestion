import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutorizarPage } from './autorizar.page';

describe('AutorizarPage', () => {
  let component: AutorizarPage;
  let fixture: ComponentFixture<AutorizarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
