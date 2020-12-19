import { FeedbackService } from './../services/feedback.service';
import { SessionService } from './../services/session.service';
import { UsuarioModel } from './../modelos/usuario.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClauseModel } from '../modelos/clause.model';
import { UsuarioMaterialModel } from '../modelos/usuario-materia.model';
import { MateriaModel } from '../modelos/materia.model';
import { uuid } from 'uuidv4';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {


  materias: any = {};
  EncontroAl = '';
  encuentraMa = false;
  EncontroMa = '';
  numMaterias = 0;
  materiasusuario: UsuarioMaterialModel[];
  encuentraAl = false;
  prom: number;
  aux: UsuarioModel;
  aux2: UsuarioModel;
  value = '';
  mostrarGraf = false;
  mostrarGraf2 = false;
  user: Observable<UsuarioModel>;
  materiasMaestro;
  contador = 0;
  contador2 = 0;
  reprobados = 0;
  aprobados = 0;
  maestroSeleccionado = '';
  maestroSeleccionadoUid = '';
  NombreMateria = '';
  alumnoTable: UsuarioModel[] = [];
  maestroTable: UsuarioModel[] = [];
  buscarMaestro = 'Nombre';
  nuevoM = 'false';
  buscarAlumno = 'Nombre';


  public doughnutChartLabels = ['Alumnos', 'Profesores'];
  public doughnutChartData = [this.contador, this.contador];
  public doughnutChartType = 'doughnut';
  public doughnutChartLabels2 = ['Reprobados', 'Aprobados'];
  public doughnutChartData2 = [this.aprobados, this.reprobados];


  constructor(
    private sessionService: SessionService,
    private storageService: FirestoreService,
    private feedback: FeedbackService,
  ) {
    this.user = this.sessionService._user;
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(){
    this.fnGetUsuarioByType('maestro').then((list: any) => { this.maestroTable = list });
    this.fnGetUsuarioByType('estudiante').then((list: any) => { this.alumnoTable = list });
  }

  // B U S C A R   M A E S T R O / A L U M N O
  buscar(tipo, nombre) {
    let clauses: ClauseModel[] = [
      { key: 'nombre', condition: '==', value: nombre } as ClauseModel,
      { key: 'tipoUsuario', condition: '==', value: tipo } as ClauseModel
    ];
    this.EncontroAl = '';
    this.encuentraAl = false;
    this.EncontroMa = '';
    this.encuentraMa = false;
    this.storageService.fnFindByMultipleClauses('usuario', clauses)
      .then((data: any) => {
        this.aux = null;
        this.aux2 = null;
        data.forEach( element => {

          if (tipo == 'estudiante') {
            this.aux = element.data();
            this.fnGetMaterias(this.aux.uid);
          }
          else {
            this.aux2 = element.data();
            this.fnGetMateriasMaestro(this.aux2.uid);
          }
        });

        if (tipo == 'estudiante') {
          if (this.aux == null) {
            this.EncontroAl = 'No se encontro alumno';
            setTimeout(() => {
              this.EncontroAl = '';
            }, 2000);
          }
          else {
            this.encuentraAl = true;
          }
        }

        if (tipo == 'maestro') {
          if (this.aux2 == null) {
            this.EncontroMa = 'No se encontro maestro';
            setTimeout(() => {
              this.EncontroMa = '';
              this.buscarMaestro = '';
            }, 2000);
          }
          else {
            this.encuentraMa = true;
            this.buscarMaestro = '';
            this.nuevoM = 'false';
          }
        }
      });
  }
// Buscar Materias del Maestro Seleccionado
  fnGetMateriasMaestro(uid) {
    this.materiasMaestro = [];
    this.storageService.fnGetElementById('materias', 'idMaestro', uid)
      .then((data: any) => {
        data.forEach((doc) => {
          this.materiasMaestro.push(doc.data());
        });
      });
  }
// Buscar Materias del Alumno Seleccionado
  fnGetMaterias(uid) {
    this.materiasusuario = [];
    this.numMaterias = 0;
    this.materias = {};
    this.prom = 0;
    this.storageService.fnGetElementById('usuario-materia', 'idUsuario', uid)
      .then((data: any) => {
        data.forEach((doc) => {
          this.numMaterias++;
          const aux: UsuarioMaterialModel = doc.data();
          if (!this.materias[aux.idMateria]) {
            this.fnGetMateria(aux.idMateria);
          }
          this.prom = this.prom + parseFloat('' + aux.nota);
          this.materiasusuario.push(aux);
        });

        this.prom = parseFloat((this.prom / (this.numMaterias)).toFixed(2));
      });
  }
// Buscar nombre de Materias del Alumno Seleccionado
  fnGetMateria(id: string) {
    this.materias[id] = true;
    this.storageService.fnGetElementById('materias', 'uid', id)
      .then((data: any) => {
        data.forEach((doc) => {
          const materia: MateriaModel = doc.data();
          this.materias[materia.uid] = materia.nombre;
        });
      });
  }

  // Buscar Maestros y alumnos para la tabla en coleccion usuario

  fnGetUsuarioByType(type: string) {
    return new Promise(resolve => {
      let list:UsuarioModel[] = [];
      this.storageService.fnGetElementById('usuario', 'tipoUsuario', type)
        .then((data: any) => {
          data.forEach(( doc ) => {
            list.push(new UsuarioModel(doc));

            if (type == 'estudiante') { this.contador++; }
            else { this.contador2++ }

          });
          resolve(list);
        });

    });

  }

  // D A R - D E - B A J A

  fnEliminarUsuario(obj: UsuarioModel){
    this.storageService.fnDeleteDoc('usuario',obj.doc)
      .then(res => {
        if ( res){
          this.feedback.fnSuccess('Exito', 'Usuario eliminado');
        }else{
          this.feedback.fnError('Error', 'No se pudo eliminar el Usuario');
        }
        this.cargarUsuarios();
      });
  }

  // G R A F I C A S

  grafica() {
    if (this.mostrarGraf == false) {
      this.mostrarGraf2 = false;
      this.mostrarGraf = true;
      this.doughnutChartData = [this.contador, this.contador2];
    }
    else {
      this.mostrarGraf = false;
    }

  }

  grafica2() {

    this.aprobados = 0;
    this.reprobados = 0;
    if (this.mostrarGraf2 == false) {
      this.mostrarGraf = false;
      this.mostrarGraf2 = true;
      const total = 0;
      this.storageService.fnGetElements('usuario-materia')
        .then((data: any) => {
          data.forEach((doc) => {

            if (doc.data().nota > 6) {
              this.aprobados++;
            }
            else {
              this.reprobados++;
            }
          });
          this.doughnutChartData2 = [this.reprobados, this.aprobados];
        });



    }
    else {
      this.mostrarGraf2 = false;
    }

  }

  retornar(type: string) {
    return new Promise(resolve => {
      let list = [];
      let cont = 0;
      this.storageService.fnGetElementById('usuario', 'tipoUsuario', type)
        .then((data: any) => {
          data.forEach((doc) => {
            list.push(doc.data());
            cont++;

          });
          resolve(cont);
        });

    });

  }


  contar(type: string) {
    let list = [];
    this.storageService.fnGetElementById('usuario', 'tipoUsuario', type)
      .then((data: any) => {
        data.forEach((doc) => {
          list.push(doc.data());
          this.contador++;
          console.log(this.contador);
        });
      });
  }

  // AÑADIR NUEVA MATERIA
  mostrarNM() {
    this.encuentraMa = false;
    if (this.nuevoM === 'false') { this.nuevoM = 'true'; }
    else { this.nuevoM = 'false'; }
  }

  nuevaMateriaMaestro(uid) {
    this.maestroSeleccionado = '';
    this.maestroSeleccionadoUid = '';
    return new Promise(resolve => {
      this.storageService.fnGetElementById('usuario', 'uid', uid)
        .then((data: any) => {
          data.forEach((doc) => {
            this.maestroSeleccionado = doc.data().nombre;
            this.maestroSeleccionadoUid = doc.data().uid;
          });

        });

    });
  }

  addMateria() {
    let id = uuid();
    if (this.NombreMateria == '' || this.maestroSeleccionado == '') {
      this.feedback.fnError('Ups', 'Campos incompletos');
    }
    else {
      let obj = {
        idMaestro: this.maestroSeleccionadoUid,
        nombre: this.NombreMateria,
        uid: id
      };

      this.storageService.fnAddCollection('materias', obj)
        .then(success => {
          if (!success) {
            // En caso de error al guar en db
            this.feedback.fnError('Ups', 'Estamos teniendo algunos problemas intenta mas tarde');

          } else {
            // en caso de exito (proceso terminado correctamente)
            this.feedback.fnSuccess('Exito', 'Materia Añadida');
            this.NombreMateria = '';
            this.maestroSeleccionado = '';
            this.nuevoM = 'false';
          }
        });
    }
  }
}
