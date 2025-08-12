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
  id: number

  constructor(private storage: StorageService) { }

  ngOnInit() {
    const user = this.storage.get('manzanares-user');
    this.rol = user?.rolId;
    this.id = user?.id
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
          { label: 'Cruzados', icon: 'repeat-outline', route: '/main/cruzar' },
          { label: 'Tesoreria', icon: 'card-outline', route: '/main/tesoreria' },
          { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
          { label: 'Subir archivo DIAN', icon: 'cloud-upload-outline', route: '/main/dian' },
          { label: 'Conciliar', icon: 'sync-outline', route: '/main/conciliacion' },
          { label: 'Diagrama', icon: 'stats-chart-outline', route: '/main/diagrama' },
          { label: 'Finalizadas', icon: 'checkmark-done-outline', route: '/main/finalizadas' },
          { label: 'Usuarios', icon: 'people-outline', route: '/main/usuarios' },
        ];
        break;

      case 2:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
          { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
          { label: 'Subir Documentos', icon: 'document-text-outline', route: '/main/documentos' },
          { label: 'Conciliar', icon: 'sync-outline', route: '/main/conciliacion' },
          { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
          { label: 'Diagrama', icon: 'stats-chart-outline', route: '/main/diagrama' },

        ]
        break;

      case 3:
        if (this.id === 4) {
          this.menuItems = [
            { label: 'Inicio', icon: 'home-outline', route: '/main' },
            { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
            { label: 'Autorizaciones', icon: 'create-outline', route: '/main/autorizar' },
            { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
            { label: 'Diagrama', icon: 'stats-chart-outline', route: '/main/diagrama' },
          ];
        } else {
          this.menuItems = [
            { label: 'Inicio', icon: 'home-outline', route: '/main' },
            { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
            { label: 'Autorizaciones', icon: 'create-outline', route: '/main/autorizar' },
            { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
          ];
        }
        break;

      case 4:
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/main' },
          { label: 'Mi Perfil', icon: 'person-outline', route: '/main/profile' },
          { label: 'Contabilizar', icon: 'calculator-outline', route: '/main/contabilizar' },
          { label: 'Cruzados', icon: 'repeat-outline', route: '/main/cruzar' },
          { label: 'Trazabilidad', icon: 'analytics-outline', route: '/main/trazabilidad' },
          { label: 'Subir archivo DIAN', icon: 'cloud-upload-outline', route: '/main/dian' },
          { label: 'Conciliar', icon: 'sync-outline', route: '/main/conciliacion' }
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
