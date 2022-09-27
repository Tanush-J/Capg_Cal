import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as math from 'mathjs';
import { isOperator, Operator } from './operator';
import { isVar } from './validation';
import { avaliFunc } from '../interfaces/avaliFunc';
import { avaliVar } from '../interfaces/avaliVar';
import { formula } from '../interfaces/formula';

@Component({
  selector: 'app-calculator-modal',
  templateUrl: './calculator-modal.component.html',
  styleUrls: ['./calculator-modal.component.scss']
})
export class CalculatorModalComponent implements OnInit {
  funcArr: avaliFunc[] = [
    {
      name: 'SumOf ( )',
      insertChar: 'SumOf'
    },
    {
      name: 'AvgOf ( )',
      insertChar: 'AvgOf'
    },
  ]
  varArr: avaliVar[] = [
    {name: 'Time'},
    {name: 'Speed'},
    {name: 'Prod-cnt'},
    {name: 'Defect-cnt'},
    {name: 'Count-in'},
    {name: 'Count-out'},
  ]

  tokens: string[] = [];
  result: string[] = this.tokens;
  showResult = false;
  isSave = true;
  isParse = false;
  funcFlag = false;
  isEmptyBracket = false;

  formulaName: string = '';

  @Input() formulaArr: formula[] = {} as formula[];

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  get lastToken(): string {
    return this.tokens[this.tokens.length - 1];
  }

  get beforeLastToken(): string {
    return this.tokens[this.tokens.length - 2];
  }

  get formattedTokens(): string {
    if(!this.isParse) return this.tokens.join(' ').replace(/\*/g, 'x') || '0';
    else return this.result.join(' ').replace(/\*/g, 'x') || '0';
  }

  get input(): string {
    if (this.showResult) {
      try {
        // return math.evaluate(this.tokens).toString();
        return this.tokens.toString();
      } catch (e) {
        return 'Something went wrong';
      }
    }

    return this.tokens
        .slice()
        .reverse()
        .find((t) => !isOperator(t)) || '0';
  }

  insertChar(char: string): void{
    const lastToken = this.lastToken
    const negNum = lastToken === '-' && isOperator(this.beforeLastToken);

    if(this.isParse){
      this.reset();
      this.isParse = false;
    }
    if (!lastToken || (isOperator(lastToken) && !negNum)) {
      if (char === '.') {
        char = '0' + char;
      }
      this.tokens.push(char);
    } else if (this.showResult) {
      this.tokens = [char];
    } else if (isVar(this.varArr, char)){
      this.tokens.push(char);
    } else {
      if(isVar(this.varArr, lastToken)){
        this.tokens.push(char);
      } else {
        this.tokens[this.tokens.length - 1] = lastToken + char;
      }
    }
    console.log(this.tokens)
    this.showResult = false;
  }

  insertOper(operator: Operator): void {
    if(this.isParse){
      this.reset();
      this.isParse = false;
    }
    if (this.showResult) {
      this.tokens = [(this.tokens).toString()];
    }
    if(operator===')'&&this.lastToken==='(') this.isEmptyBracket=true;
    this.tokens.push(operator);
    this.showResult = false;
  }

  insertFunc(func: string): void {
    if(this.isParse){
      this.reset();
      this.isParse = false;
    }
    if(this.lastToken && !isOperator(this.lastToken)) this.funcFlag=true;
    this.tokens.push(func);
    this.tokens.push('(')
  }

  save(): void {
    let str = this.result.join(" ");
    if(!this.formulaName){
      alert('Enter Formula Name');
    } else {
      this.formulaArr.push({name: this.formulaName, formulaStr: str});
      this.closeModal.emit();
    }
  }

  reset(): void {
    this.tokens = [];
    this.result = [];
    this.isSave = true;
    this.showResult = false;
    this.formulaName = '';
  }

  evaluate(): void {
    this.result = this.tokens;
    let str = this.result.join(" ");
    this.isParse = true;

    for(let i of this.varArr){ 
      str = str.replaceAll(i.name , "1");
    }
    console.log(str)
    if(this.funcFlag){
      this.tokens = ['error: invalid Expression'];
      this.funcFlag = false;
    } 
    else if(this.isEmptyBracket){
      this.tokens = ['error: empty brackets/function'];
      this.isEmptyBracket = false;
    }
    else {
      try {
        math.evaluate(str);
        this.tokens = ['valid Expression']
        this.isSave = false;
      } catch (e) {
        if(e instanceof SyntaxError){
          this.tokens = ['error: invalid Expression'];
        } else {
          this.tokens = ['valid Expression']
          this.isSave = false;
        }
      }
      // if (!isValid(this.tokens, this.funcArr, this.varArr)) {
      //   this.tokens = ['invalid Expression'];
      // } else {
      //   this.tokens = ['valid Expression']
      //   this.isSave = false;
      // }
    }

    this.showResult = true;
  }

  constructor() { }

  ngOnInit(): void {}

}
