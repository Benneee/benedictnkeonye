import { CredentialsService } from './../credentials.service';
import { untilDestroyed } from '../../core/until-destroyed';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Logger } from 'src/app/core/logger.service';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

const log = new Logger('Sign up');

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {
  signupForm: FormGroup;
  isLoading = true;
  error: string = null;
  // selectedFile: File = null;
  selectedImg: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private credentialsService: CredentialsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.createSignupForm();
  }

  ngOnDestroy(): void {}

  createSignupForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: [null, [Validators.required]],
      avatar: ['', Validators.required],
    });
  }

  handleImgUpload(event: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        log.debug('img: ', reader.result);
        this.selectedImg = reader.result;
        this.signupForm.patchValue({
          avatar: reader.result,
        });
      };
    }
  }

  submit() {
    this.isLoading = true;
    log.debug('values: ', this.signupForm.value);
    const { email } = this.signupForm.value;
    const payload = this.signupForm.value;
    this.loadingCtrl
      .create({
        message: 'Signing you up...',
        keyboardClose: true,
      })
      .then((loader) => {
        loader.present();
        const signup$ = this.authService.register(payload);
        signup$
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
              log.error('error: ', error);
              this.error = 'An error occurred';
              loader.dismiss();
            },
          );
      });
  }

  get controls() {
    return this.signupForm.controls;
  }
}
