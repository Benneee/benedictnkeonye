import { Logger } from './../core/logger.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CredentialsService } from './credentials.service';

const log = new Logger('AuthGuard');

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private credentialsService: CredentialsService,
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.credentialsService.isAuthenticated()) {
      return true;
    } else {
      log.debug('Not authenticated, redirecting....');
      this.router.navigate(['login'], {
        queryParams: { redirect: state.url },
        replaceUrl: true,
      });
      return false;
    }
  }
}
