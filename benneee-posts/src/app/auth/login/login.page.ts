import { untilDestroyed } from '../../core/until-destroyed';
import { AuthService } from './../auth.service';
import { Logger } from '../../core/logger.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CredentialsService } from '../credentials.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

const log = new Logger('login');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  error: string = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private credentialsService: CredentialsService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.createLoginForm();
  }

  ngOnDestroy() {}

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    this.isLoading = true;
    const { email } = this.loginForm.value;
    const payload = this.loginForm.value;
    log.debug('values: ', payload);

    this.loadingCtrl
      .create({
        message: 'Logging you in...',
      })
      .then((loader) => {
        loader.present();
        const login$ = this.authService.login(payload);
        login$
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            untilDestroyed(this),
          )
          .subscribe(
            (res: any) => {
              if (res) {
                log.debug('res: ', res);
                const data = {
                  email: res.data.email,
                  token: res.token,
                  _id: res.data._id,
                };
                this.credentialsService.setCredentials(data, email);
                this.router.navigate(
                  [this.route.snapshot.queryParams.redirect || '/'],
                  { replaceUrl: true },
                );
                loader.dismiss();
              }
            },
            (error: any) => {
              if (error) {
                log.error('error: ', error);
                this.error = 'Please check your email and password';
                loader.dismiss();
              }
            },
          );
      });
  }

  get controls() {
    return this.loginForm.controls;
  }
}
