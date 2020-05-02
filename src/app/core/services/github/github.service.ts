import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import { GitHubActivity } from './github-activity';
import { HttpClient } from '@angular/common/http';

// Must send User-Agent

@Injectable()
export class GitHubService {

  constructor(private http: HttpClient) {
  }

  public getRecentActivity(): Observable<GitHubActivity> {
    return this.http.get('https://api.github.com/users/fredsson/events').pipe(
      map(() => new GitHubActivity())
    );
  }
}
