import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor( private store: Store<AppState>, private ingresosEgresoService: IngresoEgresoService ) { }

  ngOnInit() {

    this.ingresosSubs = this.store.select('ingresosEgresos').subscribe( ({ items }) => this.ingresosEgresos = items );

  }

  borrar( uid: string ) {
    this.ingresosEgresoService.borrarIngresoEgreso( uid )
    .then( () => Swal.fire('Eliminado', 'Item borrado', 'success'))
    .catch( err => Swal.fire('Error', err.mesagge, 'error'));
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe();
  }

}
