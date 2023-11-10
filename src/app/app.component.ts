import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import Swal from 'sweetalert2';
import { LoaderService } from './services/loader.service';

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

  constructor(private firebaseService: FirebaseService,
    private loadingService: LoaderService) {
  }

  async ngOnInit()  {
    this.loadingService.setLoading(true);
    await this.getValuesConst();
    await this.getData();    
    this.loadingService.setLoading(false);
  }

  async getData () {
    this.getDataFirebase = await this.firebaseService.getRegister();
  }

  async getValuesConst () {
    this.valueConst = await this.firebaseService.getValuesConst();
  }

  async calculate(values: any) {  
    this.loadingService.setLoading(true);
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
    }
    this.loadingService.setLoading(false);
  }

  async addValueConst(values: any){
    this.loadingService.setLoading(true);
    await this.firebaseService.addValueConst(values);            
    await this.getData();
    
    this.loadingService.setLoading(false);
  }

  async deleteRegister(element: any){
    this.loadingService.setLoading(true);
    await this.firebaseService.deleteRegister(element.id);       
    await this.getData();
    this.loadingService.setLoading(false);
  }

  async updateValueConst(valueConst: any) {
    this.loadingService.setLoading(true);
    await this.firebaseService.updateValueConst(valueConst, valueConst.id);    
    this.loadingService.setLoading(false);
  }

  getDataFirebaseFilter(dataFirebase: any){
    this.dataFirebaseFilter = dataFirebase;
  }
}
