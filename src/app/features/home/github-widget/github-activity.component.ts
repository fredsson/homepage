import { Component, Input } from '@angular/core';
import { GitHubActivity } from 'src/app/core/services/github/github-activity';

@Component({
  selector: 'app-github-activity',
  templateUrl: './github-activity.component.html',
  styleUrls: ['./github-activity.component.less']
})
export class GitHubActivityComponent {
  @Input() public activity: GitHubActivity | undefined;
}