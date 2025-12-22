import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalization',
  standalone:true
})
export class CapitalizationPipe implements PipeTransform {

  transform(value:string|null): string {
    if(!value){
      return " ";
    }
   return value.charAt(0).toUpperCase()+value.slice(1).toLowerCase();
  }

}
