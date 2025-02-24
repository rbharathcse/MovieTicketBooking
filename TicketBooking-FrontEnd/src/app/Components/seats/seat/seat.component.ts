import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { movieStore } from '../../../Stores/movieStore/movie.store';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../../Services/auth-service.service';
import { ToasterService } from '../../../Services/toaster.service';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ButtonModule} from 'primeng/button'
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-seat',
  imports: [CommonModule,ConfirmDialogModule,ButtonModule],
  providers:[ConfirmationService,MessageService],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css'
})
export class SeatComponent implements OnInit {
  seatsLeft: number[] = Array.from({ length: 50 }, (_, index) => index + 1); 
  seatsRight: number[] = Array.from({ length: 50 }, (_, index) => index + 51); 
  seatsPerRow: number = 10;
  selectedSeats: number[] = []; 
  totSeats:number=0;
  movieStore$=inject(movieStore);
  ticketPrice:number=0;
  selectedMovieId:string="";
  bookedSeats: number[] = [];
  selectedDate:string|undefined;
  selectedShow:string|undefined;
  bookedDates: string[] = [];
  bookedShows: string[] = [];

  constructor(private router:ActivatedRoute,private route:Router, private authService:AuthServiceService,private toast:ToasterService,private confirmationService:ConfirmationService){
   this.totSeats=Number(router.snapshot.paramMap.get('seats'));
   this.selectedMovieId=router.snapshot.paramMap.get('id') as string;
   this.selectedDate=router.snapshot.paramMap.get('selectedDate') as string;
   this.selectedShow=router.snapshot.paramMap.get('show') as string;
  }
  ngOnInit(): void {
 this.loadDetails();


  }
  loadDetails(){
    this.movieStore$.getMovieDetails();
    this.movieStore$.getBooking(this.selectedMovieId);
    const ticketPrice=setInterval(()=>{
      if(this.movieStore$.ShowDetails()){
        this.ticketPrice=this.movieStore$.ShowDetails().find(x=>x.movieId==this.selectedMovieId)?.ticketPrice as number;
        clearInterval(ticketPrice);
      }
      
    },100);
    const bookedSeats = setInterval(() => {
      if (this.movieStore$.Booking()) {
        this.bookedSeats = this.movieStore$
          .Booking()
          .map((booking: any) =>
            booking.seats.split(',').map((seat: string) => parseInt(seat))
          )
          .flat();
    
        const filteredBookings = this.movieStore$
          .Booking()
          .filter(
            (booking: any) =>
              booking.selectedDate === this.selectedDate &&
              booking.show === this.selectedShow
          );
    
        this.bookedSeats = filteredBookings
          .map((booking: any) =>
            booking.seats.split(',').map((seat: string) => parseInt(seat))
          )
          .flat();
    
        clearInterval(bookedSeats);
      }
    }, 100);
    
  
  }
  
  isBooked(seat: number): boolean {
    return this.bookedSeats.includes(seat);
  }
  toggleSeat(seat: number): void {
    if (this.selectedSeats.includes(seat)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat);
    } else if(this.selectedSeats.length<this.totSeats) {
      this.selectedSeats.push(seat);
    }
  }
  isSelected(seat: number): boolean {
    return this.selectedSeats.includes(seat);
  }
  addBooking(event:Event){
    if(this.selectedSeats.length==0){
      this.toast.showToast("warn","Please select seats")
    }
    else{
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'Are you sure that you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    header:'Confirmation',
    rejectButtonProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
   },
    acceptButtonProps: {
      label: 'Pay',
      severity:'info'
   },
    accept: () => {
      if(this.selectedSeats.length<0){
        this.toast.showToast("warn","Please select seats")
      }

      else{
       let seatString=this.selectedSeats.join(',');
        const  book={
          movieId:this.selectedMovieId,
          userId:this.authService.currentUser.id,
          seats:seatString,
          selectedDate:this.selectedDate,
          Show:this.selectedShow,
          
        };
  
        this.movieStore$.addBooking(book).add(this.toast.showToast("success","Booking added successfully"));
        this.route.navigate(['']);
      }
    },
    reject: () => {
      this.toast.showToast("warn","Booking cancelled");
  }});
 
  }
}

}
