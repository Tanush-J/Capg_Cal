import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AvaliFunc } from '../interfaces/avaliFunc';
import { AvaliVar } from '../interfaces/avaliVar';
import { Formula } from '../interfaces/formula';
import { GetTSIService } from '../Services/get-tsi.service';
import { NotificationService } from '../Services/notification.service';
import { SyntaxValidationService } from '../Services/syntax-validation.service';
import { isFunc, isVar } from './validation';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-calculator-modal',
  templateUrl: './calculator-modal.component.html',
  styleUrls: ['./calculator-modal.component.scss']
})
export class CalculatorModalComponent implements OnInit {
  input = '';
  tokens: string[] = [];
  formulaName = '';
  isParsingDone = false;
  isDotUsed = false;
  radian = '/(360*2*PI)';
  isFormulaName = false;

  funcArr: AvaliFunc[] = [
    {
      name: 'SumOf',
      insertChar: 'SumOf('
    },
    {
      name: 'AvgOf',
      insertChar: 'AvgOf('
    },
    {
      name: 'Log',
      insertChar: 'Log('
    },
    {
      name: 'sin',
      insertChar: 'sin('
    },
    {
      name: 'cos',
      insertChar: 'cos('
    },
    {
      name: 'tan',
      insertChar: 'tan('
    },
    {
      name: 'Min',
      insertChar: 'Min('
    },
    {
      name: 'Max',
      insertChar: 'Max('
    },
    {
      name: 'Sqrt',
      insertChar: 'Sqrt('
    },
    {
      name: 'PercOf',
      insertChar: 'PercOf('
    },
    {
      name: 'Root',
      insertChar: 'Root('
    },
    {
      name: 'Inverse',
      insertChar: 'Inverse('
    },
  ];

  varArr: AvaliVar[] = [];

  tsiValue: any;
  trigoCounter = 0;

  @Input() formulaArr: Formula[] = {} as Formula[];
  @Input() public FormulaObject: Formula = {} as Formula;
  @Input() isEditOn?: boolean;

  constructor(
    private getTSIService: GetTSIService,
    private notifyService: NotificationService,
    private valid: SyntaxValidationService,
    private modalService: NgbModal,
    ) {}

  ngOnInit(): void {
    this.getTSIService.getTSI().subscribe(
      (Response: any) => {
        Response.forEach((data: any) => {
          this.varArr.push({name: data});
       });
      });
      if (this.isEditOn) {
        this.input = this.FormulaObject.Formula;
        this.formulaName = this.FormulaObject.FormulaName;
        this.tokens = this.FormulaObject.FormulaTokens;
        this.isFormulaName = true;
      }
  }
  // Previous Character CHecking Function
  PreviousChar = () => {
    this.isParsingDone = false;
    const prevChar = this.input[this.input.length - 1];
    return prevChar;
  }

  // Clear Input Function
  ClearAC = () => {
    this.input = '';
    this.tokens = [];
    this.isParsingDone = false;
  }

  // Erase last input character
  Delete = () => {
    this.isParsingDone = false;
    if (this.tokens.length === 0) {
      return;
    } else {
      this.tokens.pop();
      this.input = this.tokens.join('');
    }
  }

  // Function For NUmbers
  Numbers = (num: string) => {
    if (this.tokens.length === 0) {
      this.tokens.push(num);
      this.input = this.tokens.join('');
      return ;
    }

    const regex = new RegExp(/[A-Za-z\)\]]/);
    const numRegex = new RegExp(/^\d$/);

    if (!regex.test(this.PreviousChar())) {
      if (numRegex.test(this.PreviousChar()) || this.PreviousChar() === '.') {
        this.tokens[this.tokens.length - 1] += num;
      } else {
        this.tokens.push(num);
      }
      this.input = this.tokens.join('');
    } else {
      this.notifyService.showWarning('Missing Operator (+,-,*,/)');
    }
  }

  // Function For Operators
  Operators = (op: string): void => {
    if (this.tokens.length === 0) {
      this.notifyService.showWarning('Add variables and functions to perform operation');
      return;
    }
    if (this.PreviousChar() === '.') {
      this.notifyService.showWarning('Missing a number! 0-9');
      return;
    }
    const regex = new RegExp(/[,\+\-\*\/]/);
    if (!regex.test(this.PreviousChar())) {
      this.input = this.input + op;
      this.isDotUsed = false;
      this.tokens.push(op);
    } else {
      this.tokens.pop();
      this.tokens.push(op);
      this.input = this.tokens.join('');
    }
  }

  // Dot Operator
  DotOperators = (dot: string) => {
    const regex = new RegExp(/[0-9]/);
    if (this.input.length === 0 || !regex.test(this.PreviousChar())) {
      this.notifyService.showWarning('Add a number[0-9] before using decimal!');
      return;
    }

    if (this.isDotUsed === false) {
      this.isDotUsed = true;
      this.input = this.input + dot;
      this.tokens[this.tokens.length - 1] += dot;
    } else {
      this.notifyService.showError('Invalid Expression!');
    }

  }
  // Variables Handling
  variablesHandling = (variable: string): void => {
    if (this.input.length === 0) {
      this.tokens.push(variable);
      this.input = this.tokens.join('');
      return;
    }

    const regex = new RegExp(/[A-Za-z0-9\.\]\)]/);
    if (!regex.test(this.PreviousChar())) {
      this.input = this.input + variable;
      this.tokens.push(variable);
    } else {
      this.notifyService.showWarning('Missing arithmetic operator or parenthesis!');
    }
  }

  // Parenthesis Handling
  Symbols = (sym: string) => {
    if (sym === '(' || sym === '[') {
      if (this.input.length === 0) {
        this.input = this.input + sym;
        this.tokens.push(sym);
        return;
      }

      const regex = new RegExp(/[A-Za-z0-9\)\]]/);
      if (regex.test(this.PreviousChar())) {
        this.notifyService.showWarning('Missing arithmetic operator');
        return;
      } else {
        this.input = this.input + sym;
        this.tokens.push(sym);
      }
    }

    if (sym === ')' || sym === ']') {
      const regex = new RegExp(/[/(/[,\+\-\*\/]/);
      if (regex.test(this.PreviousChar())) {
        this.notifyService.showWarning('Invalid Expression');
        return;
      } else {
        this.input = this.input + sym;
        this.tokens.push(sym);
      }
    }
  }

  // Special Functions
  specialFunctions = (func: string): void => {
    this.isParsingDone = false;
    if (this.input.length === 0) {
      this.input = this.input + func;
      this.tokens.push(func);
      return;
    }
    const regex = new RegExp(/[A-Za-z0-9\.\)\]]/);
    if (!regex.test(this.PreviousChar())) {
      this.input = this.input + func;
      this.tokens.push(func);
    } else {
      this.notifyService.showWarning('Missing arithmetic operator!');
    }
  }

  // Single variable checking
  singleVariableChecking = (): boolean => {
    let flag = false;

    const regex = new RegExp(/[A-Za-z\(\)]/);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.input.length; i++) {
      if (regex.test(this.input[i])) {
        flag =  false;
      } else {
        flag =  true;
        break;
      }
    }
    const isNum = new RegExp(/^\d$/);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.input.length; i++) {
      if (isNum.test(this.input[i])) {
        flag = false;
      } else {
        flag = true;
        break;
      }
    }
    return flag;
  }
  // Parsing the input string
  parseFunction = (): void => {

    if (this.formulaName.length === 0) {
      this.notifyService.showWarning('Formula Name cannot be empty!');
      return;
    }

    if (this.input.length !== 0 && this.valid.isValid(this.input) && this.singleVariableChecking()) {
      this.isParsingDone = true;
      this.notifyService.showSuccess('Formula is Correct');
    } else {
      this.isParsingDone = false;
      this.notifyService.showError('Formula is Wrong');
    }

  }

  // SumOf(sin(36/(360*2*Math.PI)/(360*2*Math.PI))/(360*2*Math.PI)/(360*2*Math.PI))
  // Degree to radians
  DegreeToRadians = () => {
    const start = [];
    for (let i = 0; i < this.tokens.length; i++) {
      const dummyString = this.tokens[i];
      if (dummyString === 'sin(' || dummyString === 'cos(' || dummyString === 'tan(') {
          start.push(i);
      }
    }
    for (let j = start.length - 1; j >= 0; j--) {
      let count = 1;
      for (let k = j + 1; k < this.tokens.length; k++) {
        const dummyString = this.tokens[k];
        if (isFunc(this.funcArr, dummyString)) {
          count += 1;
        }
        if (dummyString === ')') {
          count -= 1;
        }
        if (count === 0) {
          this.tokens.splice(k, 0, this.radian);
          break;
        }
      }
    }
  }

  // On Save
  saveFormula = () => {
    if (this.isEditOn) {
      this.isFormulaName = true;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.formulaArr.length; i++) {
        if (this.formulaArr[i].FormulaName === this.formulaName) {
          this.formulaArr[i].Formula = this.input;
          this.formulaArr[i].FormulaTokens = this.tokens;
        }
      }
    } else {
      const formula = { FormulaName: this.formulaName, Formula: this.input , FormulaTokens: this.tokens};
      this.formulaArr.push(formula);
    }

    this.DegreeToRadians();
    this.input = this.tokens.join('');
    const formula2 = { FormulaName: this.formulaName, Formula: this.input, FormulaTokens: this.tokens};
    this.isParsingDone = false;
    this.closeModal();
    this.writeForm(formula2);
  }

  closeModal = (): void => {
    this.modalService.dismissAll();
  }

  saveFromulaError = () => {
    this.notifyService.showWarning('Parse the formula and then click on save button!');
  }

  writeForm = (formula: Formula) => {
    // let isFormulaSaved: boolean;
    const obj = {
      FormulaName: formula.FormulaName,
      Formula: formula.Formula
    };
    this.getTSIService.writeFormula(obj)
    .subscribe(data => {

    });
  }
}

