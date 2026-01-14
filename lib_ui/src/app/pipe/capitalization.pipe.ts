import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalization',
  standalone:true
})
export class CapitalizationPipe implements PipeTransform {

  transform(value:string|null|undefined): string {
    if(!value){
      return " ";
    }
   const data= value
   .trim()
   .split(/\s+/)
   .map(word=>
    word.charAt(0).toUpperCase()+word.slice(1)
   )
   .join(' ');

   if(data.length>15){
    return data.slice(0,14)+'...';
   }

   return data;
  }

}
