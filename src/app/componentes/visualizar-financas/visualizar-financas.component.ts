import { Component, OnInit } from '@angular/core';
import {ValorService} from "../../app-core/servicos/valor-service";
import {Valor} from "../../app-core/model/valor";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
declare var $ : any;
import Swal from 'sweetalert2';


@Component({
  selector: 'app-visualizar-financas',
  templateUrl: './visualizar-financas.component.html',
  styleUrls: ['./visualizar-financas.component.css']
})
export class VisualizarFinancasComponent implements OnInit {

  i: number =0;
  valores: any [] =[];
  valorVisualizar: any;
  form: FormGroup;


  constructor(
    private valorService: ValorService,
    private fb: FormBuilder) {

    this.form = this.fb.group({
      Valor: ['', Validators.required],
      dataValor: ['', Validators.required],
      statusValor: ['', Validators.required],
      descricaoValor: ['', Validators.required],
      id: [0],
      imagem: ['']
    });
  }



  openModal(){
    $('#add-valor').modal('show');
  }
  closeModal(){
    $('#add-valor').modal('hide');
  }
  isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  } //verificar se é um número
  salvarFormValor() {
    if(this.form.valid){
      const novoValor: Valor = new Valor(
        this.form.value.Valor,
        this.form.value.dataValor,
        this.form.value.descricaoValor,
        this.form.value.statusValor,
        undefined,
        this.form.value.imagem
      );
      console.log('dados do novo valor: ', novoValor);
      this.valorService.adicionarValor(novoValor).then(reposta => {
        if (reposta > 0) {
          Swal.fire('Sucesso', 'Valor salva com sucesso!', 'success');
          this.form.reset();
          this.closeModal();
          this.listarValores();
        }
      }).catch(respostaError => {
        Swal.fire('Não foi dessa vez', 'Não foi possível salvar o valor, ' +
          'tente novamente mais tarde', 'error');
        console.log(respostaError);
      })
    }else{
      console.log("CAMPOS INVALIDOS ENCONTRADOS.");
      console.log("DADOS DOS CAMPOS: ", this.form.value);
      Swal.fire('Cuidado', 'Alguns campos do formulário não estão ' +
        'corretos.', 'warning');
      this.marcarTodosComoClicados();
    }
  }
  isCampoValido(inputNome: string) : boolean {
    const campo: any = this.form.get(inputNome);
    return campo && campo.touched && campo.invalid;
  }
  marcarTodosComoClicados(){
    Object.values(this.form.controls).forEach(campo => {
      campo.markAsTouched();
    });
  }
  listarValores(){
    this.valorService.buscarValor().then(resposta => {
      this.valores= resposta;
    });
  }

  setValorAtual(valor: Valor) {
    this.valorVisualizar = valor;
    console.log(this.valorVisualizar); // Para verificar se o valor está sendo atualizado
  }

  excluirValor(id: number){
    Swal.fire(
      {
        title: 'Tem certeza?',
        text: 'Você não poderá reverter isso!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, deletar valor!',
        confirmButtonColor: '#3085d6'
      }).then((tipoBotao) => {
      if(tipoBotao.isConfirmed){
        this.valorService.removerValor(id).then(() => {
          Swal.fire('Deletado!', 'O valor foi deletado.', 'success');
          this.listarValores();
        });
      }
    }).catch(error => {
      console.log(error);
      Swal.fire('ERRO!', 'O valor não foi deletado.', 'error')
    });
  }

  submitForm(){
    if(this.form.value.id > 0){
      this.editarFormValor();
    }else{
      this.salvarFormValor();
    }
  }
  carregarDadosValor(valorEditar: Valor){
    this.form.patchValue({
      Valor: valorEditar.valor,
      dataValor: valorEditar.data,
      statusValor: valorEditar.status,
      descricaoValor: valorEditar.descricao,
      id: valorEditar.id,
      imagem: valorEditar.imagem
    });
    this.openModal();
  }

  editarFormValor(){
    if(this.form.valid){
      const editarValor: Valor = new Valor(
        this.form.value.Valor,
        this.form.value.dataValor,
        this.form.value.descricaoValor,
        this.form.value.statusValor,
        this.form.value.id,
        this.form.value.imagem
      );
      this.valorService.atualizarValor(this.form.value.id, editarValor)
        .then(reposta => {
          if(reposta === 1){
            Swal.fire('Sucesso!','Valor editado com sucesso.','success');
            this.form.reset();
            this.closeModal();
            this.listarValores();
          }else{
            Swal.fire('Atenção','Nenhum valor encontrado, ou nenhuma alteração' +
              ' necessária', 'info');
          }
        }).catch(error => {
        Swal.fire('Cuidado!', 'Não foi possível editar o valor.', 'error');
      });
    }else{
      Swal.fire('Cuidado!', 'Alguns campos estão incorretos', 'warning');
      this.marcarTodosComoClicados();
    }
  }

  onFileChange(event: any){
    const file = event.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        this.form.patchValue({imagem: loadEvent?.target?.result});
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    this.listarValores();
  }

}


