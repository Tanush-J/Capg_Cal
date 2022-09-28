import { Component, OnInit } from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { formula } from '../interfaces/formula';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})

export class CalculatorComponent implements OnInit {
  formulaArr: formula[] = [
    {
      FormulaName: 'Sum of time',
      Formula: 'SumOf(Time)'
    },
    {
      FormulaName: 'Avg of speed',
      Formula: 'AvgOf(speed)'
    },
  ]

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

  constructor( private modalService: NgbModal) {}
  
  ngOnInit(): void {}

}

