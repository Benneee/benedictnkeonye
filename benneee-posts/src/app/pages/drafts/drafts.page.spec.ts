import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DraftsPage } from './drafts.page';

describe('DraftsPage', () => {
  let component: DraftsPage;
  let fixture: ComponentFixture<DraftsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DraftsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
