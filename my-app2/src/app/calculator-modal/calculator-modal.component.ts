import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AvaliFunc } from '../interfaces/avaliFunc';
import { AvaliVar } from '../interfaces/avaliVar';
import { Formula } from '../interfaces/formula';
import { GetTSIService } from '../Services/get-tsi.service';
import { NotificationService } from '../Services/notification.service';
import { SyntaxValidationService } from '../Services/syntax-validation.service';
import { isFunc, isVar } from './validation';
import * as $ from 'jquery';

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
  isSave = false;
  openPCount = 0;
  closePCount = 0;
  isFunctionOn = false;

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
  startDateTime: any;
  endDateTime: any;

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
    this.startDateTime = new Date(new Date().getTime() - (24 * 60 * 60 * 1000) + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 16);
    this.endDateTime = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 16);

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

  scrollfix = () => {
    // tslint:disable-next-line: no-non-null-assertion
    const disp = document.getElementById('inputDisplay')!;
    // disp.focus();
    disp.scrollLeft += disp.scrollWidth ;
    console.warn(disp.scrollLeft, disp.scrollWidth);
  }

  // Previous Character CHecking Function
  PreviousChar = () => {
    this.isParsingDone = false;
    this.isSave = false;
    const prevChar = this.input[this.input.length - 1];
    return prevChar;
  }
  // Clear Input Function
  ClearAC = () => {
    this.input = '';
    this.tokens = [];
    this.isParsingDone = false;
    this.isSave = false;
    this.openPCount = 0;
    this.closePCount = 0;
    this.isFunctionOn = false;
    this.isDotUsed = false;
  }

  // Erase last input character
  Delete = () => {
    this.isParsingDone = false;
    const lastToken = this.tokens[this.tokens.length - 1];
    if (this.tokens.length === 0) {
      return;
    } else {
      if (lastToken === '(') {
        this.openPCount = this.openPCount - 1;
      } else if (lastToken === ')') {
        this.closePCount = this.closePCount - 1;
      } else if (lastToken === 'SumOf(' ||
        lastToken === 'AvgOf(' ||
        lastToken === 'Min' ||
        lastToken === 'Max') {
          this.isFunctionOn = false;
      } else if (isFunc(this.funcArr, lastToken)) {
        this.openPCount = this.openPCount - 1;
      } else if (isVar(this.varArr, lastToken)) {
        this.isFunctionOn = true;
      } else if (/\./.test(lastToken)) {
        this.isDotUsed = false;
      }
      this.tokens.pop();
      this.input = this.tokens.join('');
    }
    this.scrollfix();
  }

  // Function For NUmbers
  Numbers = (num: string) => {
    if (this.isFunctionOn === true) {
      this.notifyService.showWarning('Invalid parameter');
      return;
    }
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
    this.scrollfix();
  }

  // Function For Operators
  Operators = (op: string): void => {
    if (this.tokens.length === 0 || this.isFunctionOn === true) {
      this.notifyService.showWarning('Add parameter or functions to perform operation');
      return;
    }
    if (this.PreviousChar() === '.') {
      this.notifyService.showWarning('Missing a number! 0-9');
      return;
    }
    if (this.PreviousChar() === '(') {
      if (op === '-' || op === '+') {
        this.input = this.input + op;
        this.tokens.push(op);
      } else {
        this.notifyService.showWarning('Invalid Expression');
        return;
      }
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
    this.scrollfix();
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
    this.scrollfix();
  }
  // Variables Handling
  variablesHandling = (variable: string): void => {
    if (this.input.length === 0) {
      // this.tokens.push(variable);
      // this.input = this.tokens.join('');
      this.notifyService.showWarning('Prefixed it with either SumOf, AvgOf, MinOf, MaxOf Function!');
      return;
    }
    if (this.tokens[this.tokens.length - 1] === 'SumOf(' ||
     this.tokens[this.tokens.length - 1] === 'AvgOf(' ||
      this.tokens[this.tokens.length - 1] === 'Min(' ||
      this.tokens[this.tokens.length - 1] === 'Max(') {
      variable = variable + ')';
      this.tokens.push(variable);
      this.input = this.tokens.join('');
      this.isFunctionOn = false;
    } else {
      this.notifyService.showWarning('Prefixed it with either SumOf, AvgOf, MinOf, MaxOf Function!');
    }
  }

  // Parenthesis Handling
  Symbols = (sym: string) => {
    if (sym === '(') {
      if (this.input.length === 0) {
        this.input = this.input + sym;
        this.tokens.push(sym);
        this.openPCount = this.openPCount + 1;
        return;
      }

      const regex = new RegExp(/[A-Za-z0-9\)\]]/);
      if (regex.test(this.PreviousChar())) {
        this.notifyService.showWarning('Missing arithmetic operator');
        return;
      } else {
        this.input = this.input + sym;
        this.tokens.push(sym);
        this.openPCount = this.openPCount + 1;
        this.scrollfix();
      }
    }

    if (sym === ')') {
      const regex = new RegExp(/[/(/[,\+\-\*\/]/);
      if (this.input.length === 0 || regex.test(this.PreviousChar()) || this.openPCount <= this.closePCount) {
        this.notifyService.showWarning('Invalid Expression');
        return;
      } else {
        this.input = this.input + sym;
        this.tokens.push(sym);
        this.closePCount = this.closePCount + 1;
        this.scrollfix();
      }
    }
  }

  // Special Functions
  specialFunctions = (func: string): void => {
    this.isParsingDone = false;
    if (this.isFunctionOn === true) {
      this.notifyService.showWarning('Invalid parameter!');
      return;
    } else if (func === 'SumOf(' || func === 'AvgOf(' || func === 'Min(' || func === 'Max(') {
      this.isFunctionOn = true;
      this.openPCount = this.openPCount - 1;
    }
    if (this.input.length === 0) {
      this.input = this.input + func;
      this.tokens.push(func);
      this.openPCount = this.openPCount + 1;
      return;
    }
    const regex = new RegExp(/[A-Za-z0-9\.\)\]]/);
    if (!regex.test(this.PreviousChar())) {
      this.tokens.push(func);
      this.input = this.tokens.join('');
      this.openPCount = this.openPCount + 1;
    } else {
      this.notifyService.showWarning('Missing arithmetic operator!');
    }
    this.scrollfix();
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
    this.writeForm(formula2);
    this.isSave = true;
  }

  closeModal = (): void => {
    this.notifyService.dismissToastrs();
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
      this.notifyService.showHttpResponse(data);
    });
  }

  // Apply Button
  getResult = (): void => {
    const data = {
      FormulaName: ['Average'],
      LineId: 'Line03',
      MachineId: 'chocolateSupply',
      StartDate: new Date(this.startDateTime).toISOString(),
      EndDate: new Date(this.endDateTime).toISOString(),
    };
    $('.calculator').find('button').attr('disabled', 'disabled');
    this.getTSIService.selectedFormulaApi(data).subscribe((result) => {
      const value = result;
      if (result) {
        this.input = value.Average;
        this.tokens = [];
      }
    });
  }
}

