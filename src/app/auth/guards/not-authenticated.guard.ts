import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async(
    route: Route,
    segments: UrlSegment[]
) => {
    
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = await firstValueFrom(authService.checkStatus());

    if(isAuthenticated){
        // Si esta autenticado o si hay un token lo saca de la ruta auth/**  y lo manda a la raiz /
        // regresa true si quieres que continue o un false para no dejarlo pasar
        router.navigateByUrl('/')
        return false;
    }

    return true;
}