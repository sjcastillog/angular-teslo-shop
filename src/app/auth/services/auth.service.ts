import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User, AuthResponseI, NewUserI } from '../interfaces';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;
const token_ = localStorage.getItem('token');

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(token_);

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
  isAdmin = computed(() => this._user()?.roles?.includes('admin') ?? false);

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

  register(newUser: NewUserI): Observable<boolean> {
    return this.http.post<AuthResponseI>(`${baseUrl}/auth/register`, newUser).pipe(
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

    return this.http.get<AuthResponseI>(`${baseUrl}/auth/check-status`).pipe(
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
    this._token.set(resp.token);
    this._user.set(resp.user);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', resp.token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
