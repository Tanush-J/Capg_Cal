import { avaliFunc } from "../interfaces/avaliFunc";
import { avaliVar } from "../interfaces/avaliVar";

export function isFunc(Arr: avaliFunc[], target: string): boolean{
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