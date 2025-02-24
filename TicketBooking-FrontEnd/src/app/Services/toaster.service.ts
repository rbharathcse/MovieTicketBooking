import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private msgService:MessageService){ }
      showToast(severe:string,message:string){
          this.msgService.add({severity:severe, summary: severe, detail:message});
      }
}
