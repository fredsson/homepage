import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GitHubService } from "./github.service";
import { TestBed } from '@angular/core/testing';
import { GitHubActivity } from './github-activity';

describe('GitHubService', () => {
  let service: GitHubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GitHubService],
      imports: [HttpClientTestingModule]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(GitHubService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request github activity', () => {
    // setup
    const expectedResponse = [{
      type: 'PushEvent',
      repo: {id: 1, name: 'user/test-name', url: 'test-repo-api-url'},
      payload: {
        size: 2,
        commits: [
          {message: 'added a test commit'},
          {message: 'added another test commit '}
        ]
      },
      created_at: '2020-05-01T19:29:05Z'
    }];
    const responseSpy = jasmine.createSpy();

    // test
    service.getRecentActivity().subscribe((data) => responseSpy(data));

    // verify
    httpMock.expectOne('https://api.github.com/users/fredsson/events').flush(expectedResponse);
    expect(responseSpy).toHaveBeenCalledTimes(1);
    expect(responseSpy).toHaveBeenCalledWith(jasmine.any(GitHubActivity));
  });
});