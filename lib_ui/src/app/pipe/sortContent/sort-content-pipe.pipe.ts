import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortContentPipe'
})
export class SortContentPipePipe implements PipeTransform {

  transform(value:any): string {
    if(!value){
      return '';
    }

    if(value.length>10){
      value=value.slice(0,9)+"...";
    }

    return value;
  }

}
