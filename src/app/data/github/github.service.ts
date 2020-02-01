import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY } from 'rxjs';

export interface GithubEvent {
  id: string;
  type: string;
  actor: {
    id: string;
    login: string;
    display_login: string;
  };
  repo: {
    id: string;
    name: string;
    url: string;
  }
  payload: {
    action: string;
  }
  public: boolean;
  created_at: string;
}

const ActivityEvents = ["CreateEvent", "PushEvent", "PullRequestEvent", "IssuesEvent"];

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private http: HttpClient) {
    this.fetchActivity();
  }

  public getActivityHistory() {
    return EMPTY;
    /*return this._events.pipe(
      map((events) => events.filter((event) => ActivityEvents.includes(event.type))),
    )*/
  }

  private fetchActivity(): void {
    /*this._httpClient.get("https://api.github.com/users/fredsson/events").subscribe((data) => {
      this._events.next(data as any);
    });*/
  }

}
