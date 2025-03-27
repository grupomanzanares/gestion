import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone : false
})
export class SideMenuComponent implements OnInit {

  @Input() section: string = ''
  menuItems: { label: string; icon: string; route: string }[] = []

  constructor(private storage: StorageService) { }

  ngOnInit() {
    const rol = this.storage.get('manzanares-rol')
    this.updateMenuItems()
  }

  updateMenuItems() {
    switch (this.section) {
      case 'menu':
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
          { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
          { label: 'Subir Documentos', icon: 'document-text-outline', route: '/main/documentos' }
        ];
        break;

      default:
        this.menuItems = [{ label: 'Inicio', icon: 'home-outline', route: '/main' }];
        break;
    }
  }

}
