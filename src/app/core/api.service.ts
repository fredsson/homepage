import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { Injectable } from '@angular/core';

export enum ApiUrlKey {
  githubEvents = 'githubEvents'
}

@Injectable()
export class ApiService {
  private urlsByKey: {[P in ApiUrlKey]: string} = {
    githubEvents: 'https://api.github.com/users/fredsson/events'
  };

  constructor(private httpClient: HttpClient) {
  }

  public get(key: ApiUrlKey): Observable<any> {
    return EMPTY;
    // return this.httpClient.get()
  }
}