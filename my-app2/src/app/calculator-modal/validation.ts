import { avaliVar } from "../interfaces/avaliVar";

export function isVar(Arr: avaliVar[], target: string): boolean{
    for(let i of Arr){
        if(i.name === target){
            return true;
        }
    }
    return false;
}