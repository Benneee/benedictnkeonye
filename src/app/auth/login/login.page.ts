import { Router } from '@angular/router';
import { Logger } from '@app/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const log = new Logger('login');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    const payload = this.loginForm.value;
  }

  get controls() {
    return this.loginForm.controls;
  }
}
