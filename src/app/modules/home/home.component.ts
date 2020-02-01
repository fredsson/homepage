import { Component, OnInit } from '@angular/core';
import { GithubService } from 'src/app/data/github/github.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private githubService: GithubService) { }

  ngOnInit() {
    this.githubService.getActivityHistory().subscribe((data) => {
      console.log(data);
    });
  }

}
