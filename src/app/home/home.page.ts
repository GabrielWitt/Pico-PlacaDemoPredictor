import { AlertsService } from './../services/alerts.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { filter } from 'minimatch';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  //Set listeners input 1 and 2
  @ViewChild('platecode1',{static:false}) public platecode1: ElementRef;
  @ViewChild('platecode2',{static:false}) public platecode2: ElementRef;

  //Set plate parts empty
  public carPlate1 = ""; public carPlate2 = "";

  //Set primary variables empty
  public plate = "";
  public dateSelected = new Date();
  public results = "SÍ";

  //Set Pico y placa rules by days 1=mon,2=tue,3=wed... 0=sun
  private weekdays = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
  private days = [false,[1,2],[3,4],[5,6],[7,8],[9,0],false];

  //Show today date in placeholder to use it in case that the user don't give the date.
  public today = "";
  public day = this.weekdays[this.dateSelected.getDay()];

  constructor(private alerts:AlertsService) {this.dateFormat()}

  //Verify if press enter start the verification of the info.
  enterPlate(key){
    if (key.keyCode == 13) {
      this.verifyPlate();
    }
  }

  //Start the plate verifiers, if all goes fine, calculate the result;
  verifyPlate(){
    this.alerts.presentLoading("Calculando");
    //Verify if input1 / input2 are not empty and whether input1 have only characters
    if((this.carPlate1!="")&&(this.carPlate2!="")&&!this.checkNumbers(this.carPlate1)){
      this.carPlate1 = this.carPlate1.toUpperCase();
      //Verify if input2 is not NaN and if have three digits
      if(!isNaN(parseInt(this.carPlate2))&&(99<parseInt(this.carPlate2))){
        this.dateSelected = new Date(this.dateSelected); this.day = this.weekdays[this.dateSelected.getDay()];
        this.dateFormat()
        if(parseInt(this.carPlate2)<1000){ this.carPlate2 = "0"+parseInt(this.carPlate2) }else{ this.carPlate2 = ""+parseInt(this.carPlate2) }
        let lastposition = this.carPlate2.length-1;
        this.checkRules(this.dateSelected.getDay(),this.dateSelected.getHours(),this.dateSelected.getMinutes(),this.carPlate2[lastposition])
      }else{
        this.failPlate();
      }
    }else{
      this.failPlate();
    }
  }

  //Rules verificator, if you can use your the car respond a si (yes) else no;
  checkRules(day,hour,minutes,lastnumber){
    console.log(day,hour,minutes,lastnumber)
    //Check if the day have Pico y placa
    if(!this.days[day]){
      this.results = "SÍ";
    }else{
      //Check if the last digit match with that day numbers
      if(this.days[day][0]==lastnumber||this.days[day][1]==lastnumber){
        //check available hours
        if(7>hour&&hour>19){
          this.results = "SÍ";
        }else if(16>hour&&hour>10){
          this.results = "SÍ";
        }else if(hour==9&&minutes>30){
          this.results = "SÍ";
        }else if(hour==19&&minutes>30){
          this.results = "SÍ";
        }else{
          this.results = "NO";
        }
      }else{
        this.results = "SÍ";
      }
    }
    this.plate = this.carPlate1+" - "+this.carPlate2;
  }

  //Verify if a string have a number
  checkNumbers(x){
    return /\d/.test(x);
  }

  //reset all variables to start again
  resetAll(){
    this.carPlate1 = ""; this.carPlate2 = "";
    this.plate = "";
    this.dateSelected = new Date();
    this.dateFormat()
  }

  //Allows to check avaliability with the now hour and date.
  CheckNow(){
    this.dateSelected = new Date();
    this.dateFormat()
    this.verifyPlate();
  }

  //Shows a message that the data is incorrect
  failPlate(){    
    this.alerts.presentToast("Placa ingresada incorrectamente, por favor, vuelva a ingresar.");
    this.carPlate1 = ""; this.carPlate2 = "";
  }

  dateFormat(){
    let minutes = "";
    if(this.dateSelected.getMinutes()<10) {minutes="0"+this.dateSelected.getMinutes()}else{this.dateSelected.getMinutes()}
    this.today = ""+this.dateSelected.toLocaleDateString('es-ES')+" "+this.dateSelected.getHours()+":"+minutes;
  }

}
