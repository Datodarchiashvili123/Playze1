import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocMediasComponent } from './soc-medias.component';

describe('SocMediasComponent', () => {
  let component: SocMediasComponent;
  let fixture: ComponentFixture<SocMediasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocMediasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocMediasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
