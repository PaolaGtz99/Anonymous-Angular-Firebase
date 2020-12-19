import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { UsuarioModel } from '../modelos/usuario.model';
import { UsuarioMaterialModel } from '../modelos/usuario-materia.model';
import { SessionService } from '../services/session.service';
import { MateriaModel } from '../modelos/materia.model';
import { isNumber } from 'util';
import { FeedbackService } from '../services/feedback.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-maestro',
  templateUrl: './maestro.component.html',
  styleUrls: ['./maestro.component.css']
})
export class MaestroComponent implements OnInit {

  materias: any = {};
  usuario: Observable<UsuarioModel>;
  numMaterias = 0;
  materiasusuario: UsuarioMaterialModel[];

  user: UsuarioModel;
  agregarAl: UsuarioModel[] = [];

  alumnos: any = {};

  alumnoMateria: UsuarioMaterialModel[] = [];

  docs: any[] = [];
  docsAlumno: any[] = [];
  nomMat = '';
  showTable = true;
  idMateria: string;

  agregarAlumnos = false;

  constructor(
    private storageService: FirestoreService,
    private sessionService: SessionService,
    private feedbackService: FeedbackService
  ) {
    this.usuario = this.sessionService._user;
  }

  ngOnInit(): void {
    this.fnGetMaterias();
    this.cargaAdd();
  }

  // OBTENER MATERIAS DEL MAESTRO
  fnGetMaterias(count: number = 0) {
    this.user = this.sessionService.fnGetLoged();
    if (!this.user.uid && count < 1000) {
      setTimeout(() => {
        this.fnGetMaterias(count + 1);
      }, 10);
      return;
    } else if (!this.user.uid) {
      // redirigir
      return;
    }
    this.materiasusuario = [];
    this.materias = {};
    this.storageService.fnGetElementById('materias', 'idMaestro', this.user.uid)
      .then((data: any) => {
        data.forEach((doc) => {
          this.numMaterias++;
          const aux: UsuarioMaterialModel = doc.data();
          this.materiasusuario.push(aux);
        });
      });
  }

  // Mostrar alumnos de la clase seleccionada
  mostrarAl(id: string, nombre: string, ignore: boolean = false) {
    this.alumnos = {};
    if (ignore == false) {
      this.agregarAlumnos = false;
    }

    this.nomMat = nombre;
    this.idMateria = id;
    this.storageService.fnGetElementById('usuario-materia', 'idMateria', id)
      .then((data: any) => {
        this.alumnoMateria = [];
        this.docs = [];
        data.forEach((doc) => {
          let aux: UsuarioMaterialModel = doc.data();
          this.alumnoMateria.push(aux);
          this.docs.push(doc);
          this.fnGetAlumno(aux.idUsuario);
        });

        this.showTable = false;
      });
  }
  fnGetAlumno(uid) {
    if (this.alumnos[uid]) {
      return;
    }
    this.storageService.fnGetElementById('usuario', 'uid', uid)
      .then((data: any) => {
        data.forEach((doc) => {
          this.alumnos[uid] = doc.data();
        });
        console.log(this.alumnos);
      });
  }

  // MODIFICAR NOTA DE ESTDIANTE
  modificaNota(nota: number, index: number) {
    if (!nota) {
      this.feedbackService.fnWarning('Cuidado', 'Debes ingresar una cantidad numerica');
      return;
    }
    if (nota < 0 || nota > 10) {
      this.feedbackService.fnWarning('Cuidado', 'Debes ingresar una cantidad entre 0 y 10');
      return;
    }

    this.storageService.fnUpdateDoc('usuario-materia', this.docs[index], { nota: nota } as UsuarioMaterialModel)
      .then(data => {
        if (data) {
          this.feedbackService.fnSuccess('Exito', 'Calificacion Editada');
        } else {
          this.feedbackService.fnError('Error', 'hubo un problema al editar la nota');
        }
      });
  }

  // (mostrar todos los estudiantes PARA PODER AÑARDIRLOS A CLASE)

  cargaAdd() {
    this.agregarAl = [];
    this.storageService.fnGetElementById('usuario', 'tipoUsuario', 'estudiante').then(
      (data: any) => {
        this.docsAlumno = [];
        data.forEach(element => {
          this.docsAlumno.push(element);
          this.agregarAl.push(element.data());

        });
      }
    );
  }

  // ELIMINAR ALUMNO DE LA CLASE

  fnEliminarAlumno(uid) {
    let doc = null;
    this.alumnoMateria.forEach((data, index) => {
      if (data.idUsuario == uid) {
        doc = this.docs[index];
      }
    });
    if (doc) {
      this.storageService.fnDeleteDoc('usuario-materia', doc)
        .then(res => {
          if (res) {
            delete this.alumnos[uid];
            this.mostrarAl(this.idMateria, this.nomMat, true);
            this.feedbackService.fnSuccess('Exito', 'Estudiante eliminado');
          } else {
            this.feedbackService.fnError('Error', 'No se pudo eliminar el alumno');
          }
        });
    } else {
      this.feedbackService.fnError('Error', 'No se pudo eliminar el alumno');
    }
  }

  // AÑADIR ALUMNO A LA CLASE

  fnAgregarAMateria(uid: string) {
    let usuarioMateria: UsuarioMaterialModel = {
      idMateria: this.idMateria,
      idUsuario: uid,
      nota: 0
    }
    this.storageService.fnAddCollection('usuario-materia', usuarioMateria)
      .then(success => {
        if (!success) {
          // En caso de error al guar en db
          this.feedbackService.fnError('Error', 'No se pudo añadir el estudiante');
        } else {
          // en caso de exito (proceso terminado correctamente)
          this.feedbackService.fnSuccess('Exito', 'Estudiante añadido');
          this.alumnos[uid] = true;
          this.mostrarAl(this.idMateria, this.nomMat, true);
        }
      });
  }

  fnReloadEstudiantes() {
    this.agregarAlumnos = false;
  }
}
