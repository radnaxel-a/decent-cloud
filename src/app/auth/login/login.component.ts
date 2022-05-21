import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    getAuth,
    signInWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth';
import { AuthService } from 'src/app/services/auth-service.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.setFormGroup();
    }

    public login(): void {
        const body = this.form.getRawValue();
        // const body = {
        //     email: 'opa2@opa.com',
        //     password: '123456',
        // };

        signInWithEmailAndPassword(getAuth(), body.email, body.password)
            .then((resp: UserCredential) => {
                this.authService.login(resp.user);
                this.makeNativeLogin(body.email, body.password);
            })
            .catch(async (err) => {
                this.toastService.error(err.message);
            });
    }

    private setFormGroup(): void {
        this.form = this.fb.group({
            email: new FormControl('', [Validators.email]),
            password: new FormControl(''),
        });
    }

    private makeNativeLogin(email: string, pass: string): void {
        try {
            const userCredentials = {
                email,
                pass,
            };

            (
                window as any
            ).Capacitor.Plugins.SocketThread.requestStoragePermissions().then(
                (resp) => {
                    if (resp.storage === 'granted') {
                        (
                            window as any
                        ).Capacitor.Plugins.SocketThread.startConnectionThread(
                            userCredentials
                        );
                    }
                }
            );
        } catch (error) {
            console.log(error);

            console.warn('Capacitor is not avaliable in web');
        }
    }
}
