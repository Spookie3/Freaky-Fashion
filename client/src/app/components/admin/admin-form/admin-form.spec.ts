import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminForm } from './admin-form';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminForm', () => {
  let component: AdminForm;
  let fixture: ComponentFixture<AdminForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminForm],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
