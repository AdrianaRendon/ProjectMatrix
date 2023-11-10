import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import DataCalculate from 'src/app/interface/datacalculate.interface';
import ValueConstTable from 'src/app/interface/valuesconsttable.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.css'],
})
export class CalculateComponent implements OnChanges {
  public vlGoldPrice: number = 0;
  public trm: number = 0;
  public vlCopOZ: number = 0;
  public ozTyGr: number = 0;
  public medalGr: number = 0;
  public materialVl: number = 0;
  public dateCurrent;
  public dateFrom;
  public dateTo;
  public vlGrGold: number = 0;
  public utility: number = 0;
  public base: number = 0;
  public ivaValueConst: number = 0;
  public ivaVl: number = 0;
  public increment: number = 0;
  public incrementIva: number = 0;
  public medalVl: number = 0;
  public vlMedalIncrement: number = 0;
  public showMessageInfo: boolean = true;
  public getDataFirebaseFilter: any = [];
  public visibleFormula: boolean = false;  
  public dateMin = '2023-07-15';
  public selectedValue: number = 0;

  @Input() getDataFirebase: any;
  @Input() valueConst: any;
  @Input() visibleAllTable: any;
  @Input() visibleInput: any;
  @Output() emitVaues = new EventEmitter<any>();
  @Output() deleteElement = new EventEmitter<any>();
  @Output() emitValuesConst = new EventEmitter<any>();
  @Output() emitupdateValuesConst = new EventEmitter<any>();
  @Output() getDataFirebaseFilterEmit = new EventEmitter<any>();

  constructor() {
    this.dateCurrent = this.formatedDate();
    this.dateFrom = this.formatedDate();
    this.dateTo = this.formatedDate();
  }

  ngOnChanges() {
    if (this.getDataFirebase) {
      this.sortData();
      if (this.getDataFirebase && this.getDataFirebase.length > 0) {
        this.dateTo =
          this.getDataFirebase[this.getDataFirebase.length - 1].dateCurrent;
        this.dateFrom = this.calculateDate(this.dateTo);
      }
      this.filterDate();
    }
    if (this.valueConst && this.valueConst.length !== 0)
      this.loadValues(this.valueConst[0]);
    else this.initializedValues();
  }

  changeDate(date: any, option: number) {
    this.showMessageInfo = false;
    if (option === 0) {
      this.dateTo = date;
     } else {
      this.dateFrom = date;      
    }
    this.filterDate();
  }

  filterDate() {
    this.getDataFirebaseFilter = [];
    this.getDataFirebaseFilter = this.getDataFirebase.filter((register: any) =>
      this.calculateFilter(register.dateCurrent)
    );
    this.getDataFirebaseFilterEmit.emit(this.getDataFirebaseFilter);
  }

  calculateFilter(fecha: string): boolean {
    const date = new Date(fecha);
    return (date <= new Date(this.dateTo) && date >= new Date(this.dateFrom)) || date <= new Date(this.dateMin);
  }

  calculateDate(fecha: any) {
    const dateResult = new Date(fecha);
    dateResult.setDate(dateResult.getDate() - 30);
    return dateResult.toString();
  }

  isValidDate(date: string): boolean {
    const dateResolved = new Date(date);
    return !isNaN(dateResolved.getTime());
  }

  validateFields() {
    return this.vlGoldPrice > 0 && this.trm > 0;
  }

  showMessageEror(message: string, iconMessage: any) {
    Swal.fire({
      position: 'center',
      icon: iconMessage,
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  async calculate() {
    if (!this.validateDate())
      this.showMessageEror(
        'La fecha introducida ya se encuentra en el sistema', 'warning'
      );
    else if (!this.isValidDate(this.dateCurrent))
      this.showMessageEror('La fecha no es valida', 'warning');
    else if (!this.validateFields())
      this.showMessageEror(
        'No es posible guardar valores menores o iguales a 0', 'warning'
      );
    else {
      const values: DataCalculate = {
        vlGoldPrice: this.vlGoldPrice,
        trm: this.trm,
        vlCopOZ: this.calculateVlCopOZ(this.vlGoldPrice, this.trm),
        ozTyGr: this.ozTyGr,
        vlGrGold: this.calculateVlGrGold(this.vlCopOZ, this.ozTyGr),
        medalGr: this.medalGr,
        materialVl: this.calculateMaterialVl(
          this.vlGrGold,
          this.medalGr
        ),
        utility: this.utility,
        base: this.caculateBase(this.materialVl, this.utility),
        dateCurrent: this.dateCurrent,
        ivaValueConst: this.ivaValueConst,
        incrementIva: this.calculateIncrementIva(),
        ivaVl: this.calculateIVAVl(this.base, this.ivaValueConst, this.incrementIva),
        increment: this.increment,
        medalVl: this.calculateMedalVl(),
        vlMedalIncrement: this.calculateMedalVlIncrement(),
      };

      const valuesConst: any = {
        VCOZTYGR: values.ozTyGr,
        VCMedalGr: values.medalGr,
        VCUtility: values.utility,
        VCIncrement: values.increment,
        VCIVAVl: values.ivaValueConst,
        id: ((this.valueConst && this.valueConst.length >0) ? this.valueConst[0].id : null)
      };
      this.valueConst[0] = valuesConst;

      this.emitVaues.emit(values);
      this.initializateElement();
    }
  }

  showTrash(index: number){
    return index > 2;
  }

  validateDate() {
    let isUniqueDate = true;
    for (let index = 0; index < this.getDataFirebase.length; index++) {
      let actualDate = this.getDataFirebase[index].dateCurrent;

      if (actualDate === this.dateCurrent) {
        isUniqueDate = false;
        break;
      }
    }
    return isUniqueDate;
  }

  formatedDate(date: any = new Date()) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  sortData() {
    return this.getDataFirebase.sort(this.orderbyDate);
  }

  updateValuesConst() {
    try {
      if (this.valueConst && this.valueConst.length !== 0 && this.valueConst.id) {
        const newValueConst: any = {
          VCOZTYGR: this.ozTyGr,
          VCMedalGr: this.medalGr,
          VCUtility: this.utility,
          VCIncrement: this.increment,
          VCIVAVl: this.ivaValueConst,
          id: this.valueConst[0].id
        };
  
        this.emitupdateValuesConst.emit(newValueConst);
      } else {
        const valuesConst: ValueConstTable = {
          VCOZTYGR: this.ozTyGr,
          VCMedalGr: this.medalGr,
          VCUtility: this.utility,
          VCIncrement: this.increment,
          VCIVAVl: this.ivaValueConst        
        };
        this.emitValuesConst.emit(valuesConst);
        this.valueConst.push(valuesConst);
      }

      this.showMessageEror('El registro se actualizo con exito', 'success');

    } catch (error) {
      this.showMessageEror('Acaba de ocurrir un error por favor contacte a sus administrador', 'warning');
    }
    
  }

  loadValues(values: ValueConstTable) {
    this.ozTyGr = values.VCOZTYGR;
    this.medalGr = values.VCMedalGr;
    this.utility = values.VCUtility;
    this.increment = values.VCIncrement;
    this.ivaValueConst = values.VCIVAVl;
  }

  initializedValues() {
    this.ozTyGr = 31.1;
    this.medalGr = 34.3;
    this.utility = 260.921;
    this.increment = 100000;
    this.ivaValueConst = 19;
  }

  initializateElement() {
    this.vlGoldPrice = 0;
    this.trm = 0;
    this.dateCurrent = this.formatedDate();
  }

  orderbyDate(a: any, b: any) {
    return a.dateCurrent > b.dateCurrent ? 1 : -1;
  }

  editRegister(elementDataBase: any) {
    console.log(elementDataBase);
  }

  deleteRegister(elementDataBase: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Este cambio no se podrá revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!', 
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) 
        this.deleteElement.emit(elementDataBase);      
    })  
  }

  calculateVlCopOZ(vlGoldPrice: number, TRM: number): number {
    const vlCopOZ = vlGoldPrice * TRM;
    this.vlCopOZ = Number(vlCopOZ.toFixed(3));
    return this.vlCopOZ;
  }

  calculateVlGrGold(vlCopOZ: number, OZTYGR: number): number {
    const vlGrGold = vlCopOZ / OZTYGR;
    this.vlGrGold = Number(vlGrGold.toFixed(3));
    return this.vlGrGold;
  }

  calculateMaterialVl(vlGrGold: number, medalGr: number): number {
    const materialVl = vlGrGold * medalGr;
    this.materialVl = Number(materialVl.toFixed(3));
    return this.materialVl;
  }

  caculateBase(materialVl: number, utility: number) {
    const Base = materialVl * utility * (1 / 100);
    this.base = Number(Base.toFixed(3));
    return this.base;
  }

  calculateIVAVl(Base: number, Iva: number, IncrementIva: number) {
    const VrIva = Base * Iva * (1 / 100) + IncrementIva;
    this.ivaVl = Number(VrIva.toFixed(3));
    return this.ivaVl;
  }

  calculateIncrementIva(): number {
    const IncrementIva = this.increment * this.ivaValueConst * (1 / 100);
    this.incrementIva = Number(IncrementIva.toFixed(3));
    return this.incrementIva;
  }

  calculateMedalVl() {
    const vrMedalla = this.base + this.ivaVl;
    this.medalVl = Number(vrMedalla.toFixed(3));
    return this.medalVl;
  }

  calculateMedalVlIncrement() {
    const vrMedallaFinal = this.medalVl + this.increment;
    return Number(vrMedallaFinal.toFixed(3));
  }
}
