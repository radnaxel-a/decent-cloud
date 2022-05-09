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
import { UserService } from 'src/app/services/user.service';

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
        private toastService: ToastService,
        private userService: UserService
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
                const user = resp.user;

                this.authService.login(user);
                this.userService.create(user);
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
