export interface User {
    Name:string;
    Email:string;
    Password:string;
    cpassword:string;
}

export interface UserViewModel{
    name:string;
    email:string;
    password:string;
}

export interface booking{
    userId:string;
    movieId:string;
    seats:string;
    selectedDate:string;
    show:string;
}