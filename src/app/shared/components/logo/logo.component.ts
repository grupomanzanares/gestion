import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  "standalone": false
})
export class LogoComponent  implements OnInit {
  public subtittle : string = "manzanares App"

  constructor() { }

  ngOnInit() {}

}
