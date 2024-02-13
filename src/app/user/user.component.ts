import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const name = this.loginForm.value.name;
    const password = this.loginForm.value.password;

    this.authService.login(name, password).subscribe((res) => {
      console.log('res.success: ', res.success);
      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res.result))
        this.router.navigate(['/chat']);
      }
    }, err => {
      alert(err.error.message)
    });
  }
}
