import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public getDataFirebase: any = null;
  public dataFirebaseFilter: any = [];
  public valueConst: any = null;
  public showModalFlag: boolean = false;
  public visibleAllTable: boolean = true;
  public visibleInput: boolean = true;
  public showLoading: boolean = false;

  constructor(private firebaseService: FirebaseService) {
  }

  async ngOnInit()  {
    this.showLoading = true;
    await this.getValuesConst();
    await this.getData();   
    this.showLoading = false;
  }

  async getData () {
    this.getDataFirebase = await this.firebaseService.getRegister();
  }

  async getValuesConst () {
    this.valueConst = await this.firebaseService.getValuesConst();
  }

  async calculate(values: any) {  
    const result = await this.firebaseService.addRegister(values);    
    if (result) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El registro ha sido guardado exitosamente',
        showConfirmButton: false,
        timer: 1500
      });      
      await this.getData();
      await this.getValuesConst();
    }
  }

  async addValueConst(values: any){
    await this.firebaseService.addValueConst(values);            
    await this.getData();
    await this.getValuesConst();
  }

  async deleteRegister(element: any){
    await this.firebaseService.deleteRegister(element.id);       
    await this.getData();
    await this.getValuesConst();
  }

  async updateValueConst(valueConst: any) {
    await this.firebaseService.updateValueConst(valueConst, valueConst.id);  
  }

  getDataFirebaseFilter(dataFirebase: any){
    this.dataFirebaseFilter = dataFirebase;
  }
}
