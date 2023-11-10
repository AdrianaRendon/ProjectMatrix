import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Output() closeModalEmit = new EventEmitter<any>();


selectOption(option: any){
  console.log(option);
}

closeModal(){
  this.closeModalEmit.emit(false);
}
  
}
