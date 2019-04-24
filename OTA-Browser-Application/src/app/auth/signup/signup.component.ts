import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { AuthService } from '../auth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
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
export class SignupComponent implements OnInit {
    currentState = '';
    isLoading = false;

    constructor(public authService: AuthService) {}

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.createUser(form.value.email, form.value.password, form.value.first_name, form.value.last_name);
    }

    ngOnInit() {
        this.currentState = 'initial';
        setTimeout(() => this.currentState = 'normal', 100);
    }
}
