import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../app-core/servicos/user-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup;
  user: any = {};
  edicao: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['']
    });

    this.userService.currentUserData.subscribe(data => {
      this.user = data;
      this.userForm.patchValue(data);
      // Verifica se os dados do usuário estão vazios e habilita a edição se estiver vazio
      if (!data.nome && !data.email && !data.telefone) {
        this.edicao = true;
      }
    });
  }

  ngOnInit(): void {}

  submitForm() {
    if (this.userForm.valid) {
      this.userService.updateUserData(this.userForm.value);
      this.edicao = false;
    }
  }

  semEdicao() {
    this.edicao = true;
  }
}
