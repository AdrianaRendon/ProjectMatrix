import { Injectable } from '@angular/core';
import { Firestore,collection, addDoc, getDocs, query, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import DataCalculate from '../interface/datacalculate.interface';
import ValueConstTable from '../interface/valuesconsttable.interface';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }

    public addRegister(dataCalculate: DataCalculate) {
      const dataRef = collection(this.firestore, 'dataCalculates');
      return addDoc(dataRef, dataCalculate);
    }

    public addValueConst(dataCalculate: ValueConstTable) {
      const dataRef = collection(this.firestore, 'valuesConst');
      return addDoc(dataRef, dataCalculate);
    }

    public async getRegister() {
      const colRef = collection(this.firestore, 'dataCalculates');
      const result = await getDocs(query(colRef));
      return this.getArrayFromCollection(result);
    }

    public deleteRegister(id: string){   
      const dataRef = collection(this.firestore, 'dataCalculates');
      return deleteDoc(doc(dataRef, id));
    }

    public async getValuesConst(){
      const colRef = collection(this.firestore, 'valuesConst');
      const result = await getDocs(query(colRef));
      return this.getArrayFromCollection(result);
    }

    public async updateValueConst(valueConst: any, id: string){
      let newValue: any = {
        VCOZTYGR: valueConst.VCOZTYGR, 
        VCMedalGr: valueConst.VCMedalGr,
        VCUtility: valueConst.VCUtility,
        VCIncrement: valueConst.VCIncrement,
        VCIVAVl: valueConst.VCIVAVl
      }
      const colRef = collection(this.firestore, 'valuesConst');
      const docRef = doc(colRef, id);
      updateDoc(docRef, newValue);
    }

    getArrayFromCollection (collection:any) {
      return collection.docs.map((doc:any) => {
        return {id: doc.id, ...doc.data()};
      });
    }
}
