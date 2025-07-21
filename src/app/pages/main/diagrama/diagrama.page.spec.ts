import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagramaPage } from './diagrama.page';

describe('DiagramaPage', () => {
  let component: DiagramaPage;
  let fixture: ComponentFixture<DiagramaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
