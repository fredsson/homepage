import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentComponent } from './content.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentComponent, HeaderComponent, FooterComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
