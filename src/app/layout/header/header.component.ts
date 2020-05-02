import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {

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
}
