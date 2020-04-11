import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaillierPage } from './paillier.page';

describe('PaillierPage', () => {
  let component: PaillierPage;
  let fixture: ComponentFixture<PaillierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaillierPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaillierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
