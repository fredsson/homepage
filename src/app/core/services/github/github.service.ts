import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GitHubActivity } from './github-activity';
import { ApiService, ApiUrlKey } from '../../api.service';

// Must send User-Agent

@Injectable()
export class GitHubService {

  constructor(private apiService: ApiService) {
  }

  public getRecentActivity(): Observable<GitHubActivity> {
    this.apiService.get(ApiUrlKey.githubEvents);
    return of(new GitHubActivity());
    /*return this.http.get('https://api.github.com/users/fredsson/events').pipe(
      map((data) => this.modelMapper.fromResponse(data))
    );*/
  }
}
