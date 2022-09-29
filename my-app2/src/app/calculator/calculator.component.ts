import { Component, OnInit } from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { formula } from '../interfaces/formula';
import { CalculatorModalComponent } from '../calculator-modal/calculator-modal.component';
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
      FormulaTokens: []
    },
    {
      FormulaName: 'dummy2',
      Formula: 'AvgOf(speed)',
      FormulaTokens: []
    },
    {
      FormulaName: 'dummy3',
      Formula: 'Speed*Time',
      FormulaTokens: []
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

  open(content:any) {
    this.modalService.open(content, {size: 'xl',ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  } 
  // openToEdit(EditFormula: formula){
  //   const dialogref = this.modalService.open(CalculatorModalComponent, {size: 'xl',ariaLabelledBy: 'modal-basic-title'});

  //   const data: formula = {
  //     FormulaName: EditFormula.FormulaName,
  //     Formula: EditFormula.Formula,
  //     FormulaTokens: EditFormula.FormulaTokens
  //   };
  //   // // const data: formula = EditFormula;
  //   dialogref.componentInstance.FormulaObject = data;
  // }

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
  constructor( private modalService: NgbModal) {
  }

  submit(){
    alert("");
  }
  
  ngOnInit(): void {}

}

