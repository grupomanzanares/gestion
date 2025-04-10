import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: false
})
export class SideMenuComponent implements OnInit {

  menuItems: { label: string; icon: string; route: string }[] = []
  rol: number;

  constructor(private storage: StorageService) { }

  ngOnInit() {
    const user = this.storage.get('manzanares-user');
    this.rol = user?.rolId;
    this.updateMenuItems()
  }

  updateMenuItems() {
    switch (this.rol) {
      case 1:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
          { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
          { label: 'Subir Documentos', icon: 'document-text-outline', route: '/main/documentos' },
          { label: 'Autorizaciones', icon: 'create-outline', route: '/main/autorizar' },
          { label: 'Contabilizar', icon: 'calculator-outline', route: '/main/contabilizar' },
          { label: 'Tesoreria', icon: 'card-outline', route: '/main/tesoreria' },
          { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
          { label: 'Conciliacion', icon: 'build-outline', route: '/main/conciliacion' },
          { label: 'Usuarios', icon: 'people-outline', route: '/main/usuarios' },
        ];
        break;
        
      case 2:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
          { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
          { label: 'Subir Documentos', icon: 'document-text-outline', route: '/main/documentos' },
          { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
        ]
        break;

      case 3:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
          { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
          { label: 'Autorizaciones', icon: 'create-outline', route: '/main/autorizar' },
          { label: 'Conciliacion', icon: 'build-outline', route: '/main/conciliacion' },
          { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
        ];
        break;

      case 4:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
          { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
          { label: 'Contabilizar', icon: 'calculator-outline', route: '/main/contabilizar' },
          { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
        ]
        break

      case 5:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
          { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
          { label: 'Tesoreria', icon: 'card-outline', route: '/main/tesoreria' },
          { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
        ]
        break

      default:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
        ]
        break;
    }
  }

}
