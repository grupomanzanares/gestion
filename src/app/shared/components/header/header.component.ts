import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-header',  /** este nombre es el que se inyecta en auth.html */
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false 
})
export class HeaderComponent  implements OnInit {




  @Input() title: string = ''; /** recibe la variable de auth.page.html para mostrar en header.component.html  {{ title }} */
  @Input() isModal: boolean;
  @Input() showMenu: boolean = false;

  constructor( private modalService: ModalService) { }

  ngOnInit() {}

  dismissModal(){
    this.modalService.dismissModal();
  }


}
