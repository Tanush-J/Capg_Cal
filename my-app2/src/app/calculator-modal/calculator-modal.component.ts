import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { avaliFunc } from '../interfaces/avaliFunc';
import { avaliVar } from '../interfaces/avaliVar';
import { formula } from '../interfaces/formula';
import { GetTSIService } from '../Services/get-tsi.service';
import { NotificationService } from '../Services/notification.service';
import { SyntaxValidationService } from '../Services/syntax-validation.service';
import { isFunc } from './validation';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-calculator-modal',
  templateUrl: './calculator-modal.component.html',
  styleUrls: ['./calculator-modal.component.scss']
})
export class CalculatorModalComponent implements OnInit {
  funcArr: avaliFunc[] = [
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

  varArr: avaliVar[] = [];

  tsiValue: any;
  trigoCounter: number=0;

  @Input() formulaArr: formula[] = {} as formula[];
  // @Input() public FormulaObject: formula = {} as formula;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private getTSIService: GetTSIService,
    private notifyService: NotificationService,
    private valid: SyntaxValidationService,
    ) {}

  ngOnInit(): void {
    this.getTSIService.getTSI().subscribe(
      (Response: any) => {
        Response.forEach((data: any) => { 
          this.varArr.push({name: data});
       });
      })

      // console.log(this.FormulaObject);
      // this.input = this.FormulaObject.Formula;
      // this.formulaName = this.FormulaObject.FormulaName;
  }

  input: string = "";
  tokens: string[] = [];
  formulaName: string = "";
  isParsingDone:boolean = false;
  isDotUsed:boolean = false;
  radian: string = "/(360*2*PI)";
  // Previous Character CHecking Function 
  PreviousChar(){
    this.isParsingDone = false;
    let prevChar = this.input[this.input.length-1];
    return prevChar;
  }

  // Clear Input Function
  ClearAC(){
    this.input = "";
    this.isParsingDone = false;
  }
  
  // Erase last input character
  Delete(){
    if(this.input.length === 0){
      return;
    }
    const regex = new RegExp(/^[A-Za-z]+$/);
    if(this.input.length > 2 && this.PreviousChar() === '(' && regex.test(this.input[this.input.length-2])){
      this.tokens.pop();
      this.input = this.tokens.join("");
    }
    else if(regex.test(this.PreviousChar()) && regex.test(this.input[this.input.length-2])){
      this.tokens.pop();
      this.input = this.tokens.join("");
    }
    else{
      this.input = this.input.slice(0, this.input.length-1);
      let last_token = this.tokens[this.tokens.length-1];
      this.tokens.pop();
      last_token = last_token.slice(0,last_token.length-1);
      if(last_token.length > 0){
        this.tokens.push(last_token);
      }
    }
    
  }

  // Function For NUmbers
  Numbers(num: string){
    if(this.input.length == 0){
      this.input = this.input + num;
      this.tokens.push(num);
      return ;
    }
    const regex = new RegExp(/[A-Za-z\)\]]/);
    const numRegex = new RegExp(/^\d$/);
    
    if(!regex.test(this.PreviousChar())){
      if(numRegex.test(this.PreviousChar()) || this.PreviousChar() === '.'){
        this.tokens[this.tokens.length-1] += num;
      } else {
        this.tokens.push(num);
      }
      this.input = this.input + num; 
    }
    else{
      this.notifyService.showWarning("Missing Operator (+,-,*,/)"); 
    }
  }

  // Function For Operators
  Operators(op: string){
    if(this.input.length == 0){
      this.notifyService.showWarning("Add variables and functions to perform operation");
      return;
    }
    const regex = new RegExp(/[,\+\-\*\/]/);
    if(!regex.test(this.PreviousChar())){
      this.input = this.input + op;
      this.isDotUsed = false;
      this.tokens.push(op);
    }
    else{
      this.input = this.input.slice(0,this.input.length-1);
      this.input = this.input + op;
      this.tokens.pop()
      this.tokens.push(op);
    }
  }

  //Dot Operator
  DotOperators(dot: string){
    const regex = new RegExp(/[0-9]/);
    if(this.input.length == 0 || !regex.test(this.PreviousChar())){
      this.notifyService.showWarning("Add a number[0-9] before using decimal!");
      return;
    }
    if(this.isDotUsed == false){
      this.isDotUsed = true;
      this.input = this.input + dot;
      this.tokens[this.tokens.length-1] += dot;
    }
    else{
      this.notifyService.showError("Invalid Expression!");
    }
  }
  
  // Variables Handling
  variablesHandling(variable: string){
    if(this.input.length === 0){
      this.input = this.input + variable;
      this.tokens.push(variable);
      return;
    }
    const regex = new RegExp(/[A-Za-z0-9\]\)]/);
    if(!regex.test(this.PreviousChar())){
      this.input = this.input + variable;
      this.tokens.push(variable);
    }
    else{
      this.notifyService.showWarning("Missing arithmetic operator or parenthesis!");
    }
  }

  // Parenthesis Handling
  Symbols(sym: string){
    if(sym === '(' || sym === '['){
      if(this.input.length === 0){
        this.input = this.input + sym;
        this.tokens.push(sym);
        return;
      }

      const regex = new RegExp(/[A-Za-z0-9\)\]]/);
      if(regex.test(this.PreviousChar())){
        this.notifyService.showWarning("Missing arithmetic operator");
        return;
      }
    }

    if(sym === ')' || sym === ']'){
      const regex = new RegExp(/[/(/[]/);
      if(regex.test(this.PreviousChar())){
        this.notifyService.showWarning("Missing arithmetic operator");
        return;
      }
      else{
        this.input = this.input + sym;
        this.tokens.push(sym);
      }
    }
    
  }

  //Special Functions
  specialFunctions(func: string){
    if(this.input.length === 0){
      this.input = this.input + func;
      this.tokens.push(func);
      return;
    }

    const regex = new RegExp(/[A-Za-z0-9\)\]]/);
    if(!regex.test(this.PreviousChar())){
      this.input = this.input + func;
      this.tokens.push(func);
    }
    else{
      this.notifyService.showWarning("Missing arithmetic operator!");
    }
  }

  // Single variable checking
  singleVariableChecking(){
    let flag = false;

    const regex = new RegExp(/[A-Za-z\(\)]/);
    for(let i=0; i < this.input.length; i++){
      if(regex.test(this.input[i])){
        flag =  false;
      }
      else{
        flag =  true;
        break;
      }
    }
    
    const isNum = new RegExp(/^\d$/);
    for(let i = 0; i < this.input.length; i++){
      if(isNum.test(this.input[i])){
        flag = false;
      }
      else{
        flag = true;
        break;
      }
    }
    return flag;
  }
  // Parsing the input string
  parseFunction(){

    if(this.formulaName.length === 0){
      this.notifyService.showWarning("Formula Name can't be empty!");
      return;
    }

    if(this.input.length != 0 && this.valid.isValid(this.input) && this.singleVariableChecking()){
      this.isParsingDone = true;
      this.notifyService.showSuccess("Formula is Correct");
    }
    else{
      this.isParsingDone = false;
      this.tokens = [];
      this.notifyService.showError("Formula is Wrong");
    }

  }

  // SumOf(sin(36/(360*2*Math.PI)/(360*2*Math.PI))/(360*2*Math.PI)/(360*2*Math.PI))
  // Degree to radians
  DegreeToRadians(){
    let start = [];
    for(let i = 0; i < this.tokens.length; i++){
      let dummyString = this.tokens[i];
      if(dummyString === 'sin(' || dummyString === 'cos(' || dummyString === 'tan('){
          start.push(i);
      }
    }
    for(let j = start.length-1; j >= 0; j--){
      let count = 1;
      for(let k = j+1; k < this.tokens.length; k++){
        let dummyString = this.tokens[k];
        if(isFunc(this.funcArr, dummyString)){
          count += 1;
        }
        if(dummyString === ')'){
          count -= 1;
        }
        if(count === 0){
          this.tokens.splice(k,0, this.radian);
          break;
        }
      }
    }
  }
  // On Save
  saveFormula(){
    let formula = { FormulaName: this.formulaName, Formula: this.input , FormulaTokens: this.tokens};
    this.formulaArr.push(formula);
    this.DegreeToRadians();
    this.input = this.tokens.join("");
    let formula2 = { FormulaName: this.formulaName, Formula: this.input, FormulaTokens: this.tokens};;
    this.isParsingDone = false;
    this.closeModal.emit();
    this.writeForm(formula2);
  }

  saveFromulaError(){
    this.notifyService.showWarning("Parse the formula and then click on save button!");
  }

  writeForm(formula: formula){
    let isFormulaSaved: boolean;
    let obj = {
      FormulaName: formula.FormulaName,
      Formula: formula.Formula
    }
    this.getTSIService.writeFormula(obj).
    subscribe(data => {
    });
  }

  
}

