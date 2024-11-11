import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customcurrency',
  standalone: true
})
export class CustomcurrencyPipe implements PipeTransform {
    transform(value: number | undefined, ...args: unknown[]): string {
      if (value === null || value === undefined) {
        return ''; // se o valor for nulo ou indefinido
      } return value.toFixed(0) + '€'; // Remove casas decimais + símbolo do euro
    }
}