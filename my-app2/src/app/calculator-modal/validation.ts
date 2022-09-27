import { isOperator } from "./operator";
import { avaliFunc } from "../interfaces/avaliFunc";
import { avaliVar } from "../interfaces/avaliVar";

function stackEmpty(stack: string[]): boolean {
    if(stack.length > 0){
        return false;
    }
    return true;
}

function isDigit(c: string) {
    if (c >= '0' && c <= '9') {
        return true;
    }
    return false;
}

function isFunc(Arr: avaliFunc[], target: string): boolean{
    for(let i of Arr){
        if(i.insertChar === target){
            return true;
        }
    }
    return false;
}

export function isVar(Arr: avaliVar[], target: string): boolean{
    for(let i of Arr){
        if(i.name === target){
            return true;
        }
    }
    return false;
}

export function isValid(tokens: string[], funcArr: avaliFunc[], varArr: avaliVar[]): boolean {
    let result: boolean = true;
    let isTrue: boolean = true;
    const st1: string[] = [];
    const st2: string[] = [];
    const st3: string[] = [];

    for(let i of tokens){
        if(isFunc(funcArr, i)){
            continue;
        }
        if(isDigit(i) || isVar(varArr, i)){
            st1.push(i);
            if(isTrue){
                isTrue = false;
            } else {
                return false;
            }
            console.log('if ',i ,st1, st2, st3);
        } else if(isOperator(i)){
            if(i==='(' || i===')'){
                st3.push(i);
            } else st2.push(i);
            isTrue = true;
            console.log('elseif ',i ,st1, st2, st3);
        } else {
            if(i === '('){
                st3.push(i);
                console.log('else->if ',i ,st1, st2, st3);
            } else {
                let flag = true;
                
                while(!stackEmpty(st2)){
                    let char:string = st2.pop()!;
                    if(char == ')'){
                        flag=false;
                        st3.pop()
                        console.log('else->else->while->if',i ,st1, st2, st3);
                        break;
                    } else {
                        if(st1.length < 2){
                            return false;
                        } else {
                            st1.pop();
                            console.log('else->else->while->else',i ,st1, st2, st3);
                        }
                    }
                }
                if(flag){
                    return false;
                }
            }
        }
    }
    while(!stackEmpty(st2)){
        let char = st2.pop()!;
        if(!isOperator(char)){
            return false;
        }
        if(st1.length < 2){
            console.log('in here')
            return false;
        } else {
            st1.pop();
        }
    }
    if(st1.length > 1 || !stackEmpty(st2) || !stackEmpty(st3)){
        console.log(st3)
        return false;
    }
    return result;
}