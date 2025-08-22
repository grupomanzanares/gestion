import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/gestion/master.service';


@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css'],
  standalone: false
})
export class AuditoriaComponent implements OnInit {

  constructor(private master: MasterService, private modalCtrl: ModalController) { }

  @Input() documento: any;

  auditorias: any[] = [];

  ngOnInit() {
    this.getAuditoria()
  }

  getAuditoria() {
    this.master.getId('compras_reportadas_auditoria', this.documento.id).subscribe({
      next: (data) => {
        this.auditorias = data.data;
        console.log('Auditoría cargada:', this.auditorias);
      }
    });
  }

  ngOut() {
    this.modalCtrl.dismiss();
  }

}
