import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, User } from 'firebase/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private router: Router) {}

    public login(user: User): void {
        sessionStorage.setItem('USER', JSON.stringify(user));
        this.router.navigate(['tabs']);
    }

    public logOut(): void {
        sessionStorage.clear();
        this.router.navigate(['auth', 'login']);
    }
}
