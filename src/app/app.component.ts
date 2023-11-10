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

   showModal(){
    Swal.fire({
      title: 'Do you have a bike?',
      input: 'checkbox',
      inputPlaceholder: 'I have a bike'
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          Swal.fire({icon: 'success', text: 'You have a bike!'});
        } else {
          Swal.fire({icon: 'error', text: "You don't have a bike :("});
        }
      } else {
        console.log(`modal was dismissed by ${result.dismiss}`)
      }
    })
    // Swal.fire({
    //   title: 'Particularidade',
    //   html: '<h3>visibleAllTable <input type="checkbox" id="visibleAllTable"  /></h3><p/>' +
    //         '<h3>visibleInput <input type="checkbox" id="visibleInput"  /></h3>',
    //   confirmButtonText: 'confirmar',
    //   preConfirm: () => {
    //   const checkboxes: NodeList = document.querySelectorAll('input[type="checkbox"]')
    //   checkboxes.forEach((checkbox: HTMLInputElement) => {
    //     if (checkbox.id == 'visibleAllTable') {
    //       this.visibleAllTable = checkbox.checked;
    //     } 
    //     if (checkbox.id == 'visibleInput') {
    //       this.visibleInput = checkbox.checked;
    //     } 
    //   });
    //   }
    // }).then((result) => {
    //   Swal.fire('Ok');
    // })
  }

  closeModal(modal: boolean){
    this.showModalFlag = modal;
  }

  onVisibleAllTable(){
    debugger
    this.visibleAllTable = !this.visibleAllTable;
  }

  onVisibleInput(){
    debugger
    this.visibleInput = !this.visibleInput;
  }
}
