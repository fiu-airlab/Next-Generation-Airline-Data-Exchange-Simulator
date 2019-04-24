import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    animations: [
        trigger('changeDivSize', [
            state('initial', style({
              opacity: 0,
              transform: 'translateY(-5%)',
            })),
            state('normal', style({
                opacity: 1,
                transform: 'translateY(0%)'
            })),
            state('final', style({
                opacity: 0,
                transform: 'translateY(-5%)'
            })),
            transition('initial=>normal', animate('300ms')),
            transition('normal=>final', animate('300ms'))
          ]),
    ]
})
export class LoginComponent implements OnInit {
    currentState = '';
    isLoading = false;

    constructor(public authService: AuthService) {}

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.login(form.value.email, form.value.password);
    }

    ngOnInit() {
        this.currentState = 'initial';
        setTimeout(() => this.currentState = 'normal', 100);
    }
}
