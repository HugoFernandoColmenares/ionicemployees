import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { collection, deleteDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { addDoc, doc, getDoc, getFirestore } from 'firebase/firestore';
import { UtilsService } from './utils.service';
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  dataRef: AngularFirestoreCollection<User>;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private utilsService: UtilsService
  ) { }

  getAuth() {
    return getAuth();
  }

  singIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  singUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: any) {
    // return updateProfile(getAuth().currentUser, {displayName} );
    const user = getAuth().currentUser;
    if (user) {
      return updateProfile(user, { displayName });
    } else {
      // Manejar el caso en que el usuario es nulo
      return Promise.reject("El usuario no está autenticado");
    }
  }

  setDocument(path: any, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
  
  async getDocument(path: any) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/auth');
  }

  addDocument(path: any, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  async updateImg(path: any, data_url: any) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url')
      .then(() => {
        return getDownloadURL(ref(getStorage(), path));
      })
  }

  getCollectionData(path: any):AngularFirestoreCollection<User> {
    this.dataRef = this.firestore.collection(path, ref => ref.orderBy('name', 'asc'));
    return this.dataRef;
  }

  // Obtener ruta de la imagen con su url
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  updateDocument(path: any, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  deleteDocument(path: any) {
    return deleteDoc((doc(getFirestore(), path)));
  }

  deleteFile(path: any) {
    return deleteObject((ref(getStorage(), path)));
  }

}
