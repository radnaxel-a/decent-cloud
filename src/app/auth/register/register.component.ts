import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    createUserWithEmailAndPassword,
    getAuth,
    UserCredential,
} from 'firebase/auth';
import { AuthService } from 'src/app/services/auth-service.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    public form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private toastService: ToastService
    ) {}

    public ngOnInit(): void {
        this.buildForm();
    }

    public register(): void {
        const body = this.form.getRawValue();

        if (body.password !== body.rePassword) {
            this.toastService.error('Passwords must match');
            return;
        }

        createUserWithEmailAndPassword(getAuth(), body.email, body.password)
            .then((resp: UserCredential) => {
                this.authService.login(resp.user);
            })
            .catch((err) => {
                this.toastService.error(err.message);
            });
    }

    private buildForm(): void {
        this.form = this.fb.group({
            email: new FormControl('', [Validators.email]),
            password: new FormControl(''),
            rePassword: new FormControl(''),
        });
    }
}
