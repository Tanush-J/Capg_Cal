import { Component, OnInit } from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { formula } from '../interfaces/formula';
import { CalculatorModalComponent } from '../calculator-modal/calculator-modal.component';
import { FormGroup, FormBuilder, FormArray, FormControl, } from '@angular/forms';
import { GetTSIService } from '../Services/get-tsi.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})

export class CalculatorComponent implements OnInit {
  formulaArr: formula[] = [
    {
      FormulaName: 'dummy1',
      Formula: 'SumOf(Time)',
      FormulaTokens: ['SumOf(','Time',')']
    },
    {
      FormulaName: 'dummy2',
      Formula: 'AvgOf(Speed)',
      FormulaTokens: ['AvgOf(','Speed',')']
    },
    {
      FormulaName: 'dummy3',
      Formula: 'Speed*Time',
      FormulaTokens: ['Speed','*','Time']
    },
    {
      FormulaName: 'dummy4',
      Formula: 'Mass*Accleration',
      FormulaTokens: []
    },
    {
      FormulaName: 'dummy5',
      Formula: 'AvgOf(speed)',
      FormulaTokens: []
    },
    {
      FormulaName: 'dummy6',
      Formula: 'SumOf(Time)',
      FormulaTokens: []
    },
  ];

  userList: any;

  title = 'appBootstrap';
  closeResult: string = '';
  isEditOn: boolean = false;

  form: FormGroup;
  selectedFormula: any;

  open(content: any) {
    this.modalService.open(content, {size: 'xl',ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openToEdit(EditFormula: formula){
    this.isEditOn = true;
    const dialogref = this.modalService.open(CalculatorModalComponent, {size: 'xl',ariaLabelledBy: 'modal-basic-title'});

    const data: formula = {
      FormulaName: EditFormula.FormulaName,
      Formula: EditFormula.Formula,
      FormulaTokens: EditFormula.FormulaTokens
    };

    // // const data: formula = EditFormula;
    dialogref.componentInstance.FormulaObject = data;
    dialogref.componentInstance.isEditOn = this.isEditOn;
    dialogref.componentInstance.formulaArr = this.formulaArr;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  closeModal(){
    this.modalService.dismissAll()
  }

  deleteFormula(formulaToDelete: string){
    const indexOfObject = this.formulaArr.findIndex((object) => {
      return object.FormulaName == formulaToDelete;
    })
    this.formulaArr.splice(indexOfObject, 1);
  }
  // (<HTMLInputElement>event.target)
  onCheck(event: any) {
    this.selectedFormula = (this.form.controls['FormulaName'] as FormArray);
    if (event.target.checked) {
      this.selectedFormula.push(new FormControl(event.target.value));
    } else {
      const index = this.selectedFormula.controls.findIndex((x: { value: any; }) => x.value === event.target.value);
      this.selectedFormula.removeAt(index);
    }
  }

  constructor( private modalService: NgbModal, fb: FormBuilder, private getTSIService: GetTSIService,) {
    this.form = fb.group({
      FormulaName: new FormArray([])
    });
  }

  submit() {
    interface Formulas {
      FormulaName: string[]
    }
    const data: Formulas = { FormulaName: [] };
    console.log(this.selectedFormula);
    this.selectedFormula.value.forEach((str: string) => {
      data.FormulaName.push(str);
    })
    console.log(data);
    this.getTSIService.selectedFormulaApi(data);
  }
  
  ngOnInit(): void {}

}

