import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./auth/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
