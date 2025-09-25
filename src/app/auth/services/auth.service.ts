import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User, AuthResponseI } from '../interfaces';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponseI>(`${baseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponseI>(`${baseUrl}/auth/check-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  logout() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);

    localStorage.removeItem('token');
  }

  private handleAuthSuccess(resp: AuthResponseI) {
    this._user.set(resp.user);
    this._authStatus.set('authenticated');
    this._token.set(resp.token);
    localStorage.setItem('token', resp.token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
