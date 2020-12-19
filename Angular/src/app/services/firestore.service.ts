import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ClauseModel } from '../modelos/clause.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  db = firebase.firestore();

  constructor() { }

// AÑADIR OBJETO A COLECCION
  fnAddCollection(collection: string, obj: any) {

    return new Promise((resolve) => {
      this.db
        .collection(collection)
        .add(obj)
        .then((docRef) => {
          resolve(true);
        })
        .catch((error) => {
          resolve(false);
        });
       // this.db.clearPersistence();
    });
  }

  // OBTENER OBJETOS DE UNA COLECCION
  fnGetElements(collection: string){
    return new Promise((resolve) => {
      this.db
        .collection(collection).onSnapshot((data) => {
          resolve(data);
        });
       // this.db.clearPersistence();
    });
  }

// OBTENER OBJETO DE COLECCION CON ALGUN VALOR DE CAMPO EN ESPECIFICO

  fnGetElementById(collection: string, searchField: string, id: any){
    return new Promise((resolve) => {
      this.db
        .collection(collection).where(searchField, '==', id).onSnapshot((data) => {
          resolve(data);
        });

    });
  }

  // OBTENER OBJETO DE COLECCION CON VALORES EN ESPECIFICO

  fnFindByMultipleClauses(collection: string, clauses: ClauseModel[]){
    return new Promise((resolve) => {
      let db: any = this.db.collection(collection);
      clauses.forEach(value => {
        db = db.where(value.key, value.condition as any, value.value);
      });
      db.limit(1);
      db.onSnapshot((data) => {
        resolve(data);
      })
      // this.db.clearPersistence();
    })

  }

  // EDITAR DOCUMENTO EN COLECCION

  fnUpdateDoc(collection: string, doc, newDocument: any){

    return new Promise((resolve) => {
      let batch = firebase.firestore().batch();
      const docRef = firebase.firestore().collection(collection).doc(doc.id);
      batch.update(docRef, newDocument).commit()
      .then(res => {
        resolve(true);
      })
      .catch(error => {
        resolve(false);
      });
     // this.db.clearPersistence();
    });
  }
// ELIMINAR DOCUMENTO EN COLECCION
  fnDeleteDoc(collection: string, doc){

    return new Promise((resolve) => {
      let batch = firebase.firestore().batch();
      const docRef = firebase.firestore().collection(collection).doc(doc.id);
      batch.delete(docRef).commit()
      .then(res => {
        resolve(true);
      })
      .catch(error => {
        resolve(false);
      });
     // this.db.clearPersistence();
    });
  }

}
