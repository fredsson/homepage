import { Component, OnInit } from '@angular/core';
import { GithubService, GithubEvent } from 'src/app/data/github/github.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-github-activity',
  templateUrl: './github-activity.component.html',
  styleUrls: ['./github-activity.component.less']
})
export class GithubActivityComponent implements OnInit {

  public t: Observable<GithubEvent[]>;

  constructor(public githubService: GithubService) {
    this.t = githubService.getActivityHistory();
    this.t.subscribe((b) => console.log(b));
  }

  ngOnInit() {
  }

}
