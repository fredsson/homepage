import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {

  public socialLinks = [
    {
      href: "https://github.com/fredsson",
      img: {src: "assets/img/github.svg", alt: "github", css: "social__icon"},
      css: "social__github"
    },
    {
      href: "https://www.linkedin.com/in/fredrik-andersson-81440966/",
      img: { src: "assets/img/linkedin.svg", alt: "linkedin", css: "social__icon "},
      css: "social__linkedin"
    },
    {
      href: "https://twitter.com/fredssoncode",
      img: { src: "assets/img/twitter.svg", alt: "twitter", css: "social__icon "},
      css: "social__twitter"
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
