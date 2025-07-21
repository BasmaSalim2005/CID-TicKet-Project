import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const expectedRoles: string[] | undefined = route.data['roles'];
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role || '';

    if (!expectedRoles || expectedRoles.length === 0) {
      // No roles specified, block access
      return this.router.parseUrl('/not-authorized');
    }
    if (expectedRoles.includes(userRole)) {
      return true;
    }
    // Redirect to a default page if not authorized
    return this.router.parseUrl('/not-authorized');
  }
}
