import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone : false
})
export class SideMenuComponent implements OnInit {

  menuItems: { label: string; icon: string; route: string }[] = []
  rol: number;

  constructor(private storage: StorageService) { }

  ngOnInit() {
    const user = this.storage.get('manzanares-user');
    this.rol = user?.rolId;     
    this.updateMenuItems()
    console.log(this.rol)
  }

  updateMenuItems() {
    switch (this.rol) {
      case 1:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
          { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
          { label: 'Subir Documentos', icon: 'document-text-outline', route: '/main/documentos' },
          { label: 'Usuarios', icon: 'people-outline', route: '/main/usuarios' },
          { label: 'Autorizaciones', icon: 'create-outline', route: '/main/autorizar' },
        ];
        break;
        
        case 2:
          this.menuItems = [
            { label: 'Inicio', icon: 'home-outline', route: '/main' },
            { label: 'Autorizaciones', icon: 'create-outline', route: '/main/autorizar' }
          ]
          break;
      default:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
        ]
        break;
    }
  }

}
