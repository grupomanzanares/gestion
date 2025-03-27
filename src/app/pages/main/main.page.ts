import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false
})
export class MainPage {

  showMenu: boolean = false

  constructor(private auth: AuthService, private router: Router) { 
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        this.showMenu = event.url.startsWith('/main/')
      }
    })
  }

  logout() {
    this.auth.logout()
  }

}
