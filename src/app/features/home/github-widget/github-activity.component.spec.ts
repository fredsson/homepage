import { GitHubActivityComponent } from "./github-activity.component";
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { GitHubActivity } from 'src/app/core/services/github/github-activity';

describe('GitHubActivityComponent', () => {
  let component: GitHubActivityComponent;
  let fixture: ComponentFixture<GitHubActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GitHubActivityComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(GitHubActivityComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show contribution with commits', () => {
    component.activity = new GitHubActivity();
  });
})