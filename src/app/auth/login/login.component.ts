import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder, private authService: AuthService, private router: Router, private store: Store<AppState> ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: [ '', Validators.required, Validators.email ],
      password: [ '', Validators.required ],
    })

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs');
    });

  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario() {
    if( this.loginForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'verificando credenciales...',
    //   onBeforeOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { email, password } = this.loginForm.value;

    this.authService.loginUsuario( email, password ).then(
      credenciales => {
        console.log(credenciales);
        // Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
      }
    ).catch( err => {
      this.store.dispatch( ui.stopLoading() );
      Swal.fire({
        icon: 'error',
        title: 'ATENCIÓN',
        text: err.message
      })
    });
  }

}
