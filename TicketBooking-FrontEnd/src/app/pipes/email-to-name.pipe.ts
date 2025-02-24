import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailToName'
})
export class EmailToNamePipe implements PipeTransform {
  name:string="";
  transform(value: string): unknown {
     this.name=value.split('@')[0];
     this.name=this.name.charAt(0).toUpperCase()+this.name.slice(1,value.length) 
     return this.name;

  }
}
