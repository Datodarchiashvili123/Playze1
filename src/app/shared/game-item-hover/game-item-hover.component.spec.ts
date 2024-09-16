import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameItemHoverComponent } from './game-item-hover.component';

describe('GameItemHoverComponent', () => {
  let component: GameItemHoverComponent;
  let fixture: ComponentFixture<GameItemHoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameItemHoverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameItemHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
