import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user = localStorage.getItem('user');
      return new Promise((resolve) => {
        this.firebaseService.getAuth().onAuthStateChanged((auth) => {
          if(auth) {
            if(user) resolve(true);
          } else {
            this.firebaseService.signOut();
            resolve(false);
          }
        })
      });
  }

  constructor(
    private firebaseService: FirebaseService
  ) { }
  
}
