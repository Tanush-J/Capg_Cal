import { Component, OnInit } from '@angular/core';

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Formula } from '../interfaces/formula';
import { CalculatorModalComponent } from '../calculator-modal/calculator-modal.component';
import { FormArray, FormBuilder, FormControl, FormGroup, } from '@angular/forms';
import { GetTSIService } from '../Services/get-tsi.service';

interface Formulas {
  FormulaName: string[];
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})

export class CalculatorComponent implements OnInit {
  formulaArr: Formula[] = [
    {
      FormulaName: 'dummy1',
      Formula: 'SumOf(Time)',
      FormulaTokens: ['SumOf(', 'Time', ')']
    },
    {
      FormulaName: 'dummy2',
      Formula: 'AvgOf(Speed)',
      FormulaTokens: ['AvgOf(', 'Speed', ')']
    },
    {
      FormulaName: 'dummy3',
      Formula: 'Speed*Time',
      FormulaTokens: ['Speed', '*', 'Time']
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
  calculatedValue: any;

  title = 'appBootstrap';
  closeResult = '';
  isEditOn = false;

  form: FormGroup;
  selectedFormula: any;
  data: Formulas = {} as Formulas;

  open = (content: any): void => {
    this.modalService.open(content, {size: 'xl', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openToEdit = (EditFormula: Formula, content: any): void => {
    this.isEditOn = true;
    const dialogref = this.modalService.open(CalculatorModalComponent, {size: 'xl', ariaLabelledBy: 'modal-basic-title'});

    const data: Formula = {
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

  closeModal = (): void => {
    this.modalService.dismissAll();
  }

  deleteFormula = (formulaToDelete: string): void => {
    const indexOfObject = this.formulaArr.findIndex((object) => {
      return object.FormulaName === formulaToDelete;
    });
    this.formulaArr.splice(indexOfObject, 1);
  }

  onCheck = (event: any): void => {
    this.selectedFormula = (this.form.controls['FormulaName'] as FormArray);
    if (event.target.checked) {
      this.selectedFormula.push(new FormControl(event.target.value));
    } else {
      const index = this.selectedFormula.controls.findIndex((x: { value: any; }) => x.value === event.target.value);
      this.selectedFormula.removeAt(index);
    }
  }

  constructor( private modalService: NgbModal, fb: FormBuilder, private getTSIService: GetTSIService) {
    this.form = fb.group({
      FormulaName: new FormArray([])
    });
  }

  submit = (): void => {
    this.data = { FormulaName: ['Average'] };
    // console.log(this.selectedFormula);
    // this.selectedFormula.value.forEach((str: string) => {
    //   data.FormulaName.push(str);
    // })

    this.getTSIService.selectedFormulaApi(this.data).subscribe((result) => {
      const value = result;
      if (result) {
        this.calculatedValue = value.Average;
      }
    });
  }
  ngOnInit(): void {}

}

