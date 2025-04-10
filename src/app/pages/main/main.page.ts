import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false
})
export class MainPage implements OnInit {

  showMenu: boolean = false
  user: any;
  rol: number = 0;

  constructor(private auth: AuthService, private router: Router, private storage: StorageService) { 
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        this.showMenu = event.url.startsWith('/main/')
      }
    })
  }

  ngOnInit(){
    this.user = this.storage.get('manzanares-user')
    this.rol = this.user?.rolId
  }

  logout() {
    this.auth.logout()
  }

}
