import { AvaliFunc } from '../interfaces/avaliFunc';
import { AvaliVar } from '../interfaces/avaliVar';

export function isFunc(Arr: AvaliFunc[], target: string): boolean {
    for (const i of Arr) {
        if (i.insertChar === target) {
            return true;
        }
    }
    return false;
}
export function isVar(Arr: AvaliVar[], target: string): boolean {
    for (const i of Arr) {
        if (i.name === target) {
            return true;
        }
    }
    return false;
}
