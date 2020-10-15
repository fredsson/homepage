import { GitHubService } from "./github.service";
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService, ApiUrlKey } from '../../api.service';
import { GitHubActivity } from './github-activity';
import { of } from 'rxjs';

describe('GitHubService', () => {
  let service: GitHubService;
  let apiService: ApiService;
  let apiServiceGetSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GitHubService, ApiService],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(GitHubService);
    apiService = TestBed.inject(ApiService);
    apiServiceGetSpy = spyOn(apiService, 'get').and.stub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRecentActivity', () => {
    const correctGithubEventResponse = [{
      type: 'PushEvent',
      repo: {id: 1, name: 'user/test-repo'},
      payload: {size: 2, commits: [{message: 'added a test commit'}, {message: 'added another test commit '}]},
      created_at: '2020-05-09T19:35:00Z'
    }, {
      type: 'PullRequestEvent',
      repo: {id: 1, name: 'user/test-repo'},
      payload: {action: 'closed', number: 2, }
    }];

    it('should request github events', () => {
      // test
      service.getRecentActivity().subscribe(() => undefined);

      // verify
      expect(apiService.get).toHaveBeenCalledTimes(1);
      expect(apiService.get).toHaveBeenCalledWith(ApiUrlKey.githubEvents);
    });

    it('should return activity based on response', () => {
      // setup
      apiServiceGetSpy.and.callFake(() => of(correctGithubEventResponse));
      const responseSpy = jasmine.createSpy('ObserverResponse');

      // test
      service.getRecentActivity().subscribe(data => responseSpy(data));

      // verify
      expect(responseSpy).toHaveBeenCalledTimes(1);
      expect(responseSpy).toHaveBeenCalledWith(jasmine.any(GitHubActivity));
    });
  });

  /*it('should map response', () => {
    const expectedResponse = {};

    service.getRecentActivity().subscribe(() => undefined);

    httpMock.expectOne('https://api.github.com/users/fredsson/events').flush(expectedResponse);
    expect(mapper.fromResponse).toHaveBeenCalledTimes(1);
    expect(mapper.fromResponse).toHaveBeenCalledWith(expectedResponse);
  });

  it('should notify subscribers with github activity', () => {
    const responseSpy = jasmine.createSpy();
    fromResponseSpy.and.returnValue(expectedResponse);

    service.getRecentActivity().subscribe(data => responseSpy(data));

    httpMock.expectOne('https://api.github.com/users/fredsson/events').flush(expectedResponse);
    expect(responseSpy).toHaveBeenCalledTimes(1);
    expect(responseSpy).toHaveBeenCalledWith(expectedResponse);
  });*/
});