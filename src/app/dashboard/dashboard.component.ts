import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { auth } from 'firebase';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor( private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService ) { }

  userSubs: Subscription;
  ingresosSubs: Subscription;

  ngOnInit() {

    this.userSubs = this.store.select('user')
    .pipe(
      filter( auth => auth.user != null)
    )
    .subscribe( ({user}) => {

      this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener( user.uid )
      .subscribe( ingresosEgresosFB => {

        this.store.dispatch( ingresoEgresoActions.setItems({ items: ingresosEgresosFB }));

      })
    });

  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
    this.ingresosSubs.unsubscribe();
  }

}
