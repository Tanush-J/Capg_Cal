import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { avaliFunc } from '../interfaces/avaliFunc';
import { avaliVar } from '../interfaces/avaliVar';
import { formula } from '../interfaces/formula';
import { GetTSIService } from '../Services/get-tsi.service';
import { NotificationService } from '../Services/notification.service';
import { SyntaxValidationService } from '../Services/syntax-validation.service';

@Component({
  selector: 'app-calculator-modal',
  templateUrl: './calculator-modal.component.html',
  styleUrls: ['./calculator-modal.component.scss']
})
export class CalculatorModalComponent implements OnInit {
  funcArr: avaliFunc[] = [
    {
      name: 'SumOf ( )',
      insertChar: 'SumOf('
    },
    {
      name: 'AvgOf ( )',
      insertChar: 'AvgOf('
    },
    {
      name: 'tan',
      insertChar: 'tan('
    },
    {
      name: 'sin',
      insertChar: 'sin('
    },
    {
      name: 'cos',
      insertChar: 'cos('
    },
  ]
  varArr: avaliVar[] = [
    {name: 'Time'},
    {name: 'Speed'},
    {name: 'ProdCnt'},
    {name: 'DefectCnt'},
    {name: 'CountIn'},
    {name: 'CountOut'},
  ]

  tsiValue: any;

  @Input() formulaArr: formula[] = {} as formula[];

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  input: string = "";
  formulaName: string = "";
  isParsingDone:boolean = false;
  isDotUsed:boolean = false;
  
  // Previous Character CHecking Function 
  PreviousChar(){
    this.isParsingDone = false;
    var prevChar = this.input[this.input.length-1];
    return prevChar;
  }

  // Clear Input Function
  ClearAC(){
    this.input = "";
    this.isParsingDone = false;
  }
  
  // Erase last input character
  Delete(){
    this.input = this.input.slice(0, this.input.length - 1);
  }

  // Function For NUmbers
  Numbers(num: string){
    if(this.input.length == 0){
      this.input = this.input + num;
      return ;
    }
    const regex = new RegExp(/[A-Za-z\)\]]/);
    if(!regex.test(this.PreviousChar())){
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
    }
    else{
      this.input = this.input.slice(0,this.input.length-1);
      this.input = this.input + op;
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
    }
    else{
      this.notifyService.showError("Invalid Expression!");
    }
  }
  
  // Variables Handling
  variablesHandling(variable: string){
    if(this.input.length === 0){
      this.input = this.input + variable;
      return;
    }
    const regex = new RegExp(/[A-Za-z0-9\]\)]/);
    if(!regex.test(this.PreviousChar())){
      this.input = this.input + variable;
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
        return;
      }
      const regex = new RegExp(/[A-Za-z0-9\)\]]/);
      if(regex.test(this.PreviousChar())){
        this.notifyService.showWarning("Missing arithmetic operator");
        return;
      }
    }
    this.input = this.input + sym;
  }

  //Trignometric Fucntions
  Trignometry(trigo: string){
    if(this.input.length === 0){
      this.input = this.input + trigo;
      return;
    }
    const regex = new RegExp(/[A-Za-z0-9\)\]]/);
    if(!regex.test(this.PreviousChar())){
      this.input = this.input + trigo;
    }
    else{
      this.notifyService.showWarning("Missing arithmetic operator!");
    }
  }

  //Special Functions
  specialFunctions(func: string){
    if(this.input.length === 0){
      this.input = this.input + func;
      return;
    }
    const regex = new RegExp(/[A-Za-z0-9\)\]]/);
    if(!regex.test(this.PreviousChar())){
      this.input = this.input + func;
    }
    else{
      this.notifyService.showWarning("Missing arithmetic operator!");
    }
  }

  // Single variable checking
  singleVariableChecking(){
    const regex = new RegExp(/[A-Za-z\(\)\[\]]/);

    for(let i=0; i < this.input.length; i++){
      if(!regex.test(this.input[i])){
        return true;
      }
    }
    return false;
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
      this.input = "";
      this.notifyService.showError("Formula is Wrong");
    }

  }

  // On Save
  saveFormula(){
    let formula = { FormulaName: this.formulaName, Formula: this.input };

    this.formulaArr.push(formula);
    this.isParsingDone = false;
    this.closeModal.emit();
    this.writeForm(formula)
    console.log(this.tsiValue);
  }

  saveFromulaError(){
    this.notifyService.showWarning("Parse the formula and then click on save button!");
  }

  writeForm(formula: formula){
    let isFormulaSaved: boolean;
    this.getTSIService.writeFormula(formula).
    subscribe(data => {
      console.log(data);
    });
  }
 
  // getPeople(): Observable<Person[]> {
  //   console.log('getPeople '+this.baseURL + 'people')
  //   return this.http.get<Person[]>(this.baseURL + 'people')
  // }
  
  //  refreshPeople() {
  //   this.apiService.getPeople()
  //     .subscribe(data => {
  //       console.log(data)
  //       this.people=data;
  //     })

  constructor(
    private getTSIService: GetTSIService,
    private notifyService: NotificationService,
    private valid: SyntaxValidationService,
    ) { }

  ngOnInit(): void {
    this.getTSIService.getTSI().subscribe(data => {
    this.tsiValue = data;
  })}
}

