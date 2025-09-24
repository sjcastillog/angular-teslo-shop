import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'valueEmpty'
})

export class ValueEmptyPipe implements PipeTransform {
    transform(value: any): string {

        if (!value) return "No hay Informaciòn";

        if (value == null) return "No hay Informaciòn";

        if (typeof value === 'string') return value;

        return "No hay Informaciòn";
    }
}