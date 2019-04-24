import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from './user-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FlightList } from '../flights/flight-list.model';


@Injectable({ providedIn: 'root'})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private authStatusListener = new Subject<boolean>();
    public first_name = '';
    public last_name = '';
    public flightsToBook: FlightList[] = [];
    private tokenTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string, first_name: string, last_name: string) {
        const userData: UserData = {
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name
        };

        this.http.post('http://localhost:3000/api/user/signup', userData)
            .subscribe(response => {
                this.router.navigate(['/login']);
                console.log(response);
            });
    }

    login(email: string, password: string) {
        this.http
            .post<{token: string, first_name: string, last_name: string, expiresIn: number}>('http://localhost:3000/api/user/login',
                                                                                                     { email: email, password: password })
            .subscribe(response => {
                const token = response.token;
                const first_name = response.first_name;
                const last_name = response.last_name;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.first_name = first_name;
                    this.last_name = last_name;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expiration = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, first_name, last_name, expiration);
                    this.router.navigate(['/']);
                }

            });
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expiration.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.first_name = authInformation.first_name;
            this.last_name = authInformation.last_name;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }
    private saveAuthData(token: string, first_name: string, last_name: string, expiration: Date) {
        console.log(token + first_name + last_name + expiration);
        localStorage.setItem('token', token);
        localStorage.setItem('first_name', first_name);
        localStorage.setItem('last_name', last_name);
        localStorage.setItem('expiration', expiration.toISOString());
    }
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        localStorage.removeItem('expiration');
    }
    private getAuthData() {
        const token = localStorage.getItem('token');
        const first_name = localStorage.getItem('first_name');
        const last_name = localStorage.getItem('last_name');
        const expiration = localStorage.getItem('expiration');
        if (!token || !first_name || !last_name || !expiration) {
            return;
        }
        return {
            token: token,
            first_name: first_name,
            last_name: last_name,
            expiration: new Date(expiration)
        };
    }
}
