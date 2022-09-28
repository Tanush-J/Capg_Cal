import { avaliFunc } from "../interfaces/avaliFunc";

export function isFunc(Arr: avaliFunc[], target: string): boolean{
    for(let i of Arr){
        if(i.insertChar === target){
            return true;
        }
    }
    return false;
}