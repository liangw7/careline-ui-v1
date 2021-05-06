import { Component, OnInit, OnChanges,Input,ViewChild, AfterViewInit, Inject, AfterContentInit  } from '@angular/core';
import { Chart } from 'chart.js';
import { Router} from '@angular/router';

import { NgStyle } from '@angular/common';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../common-services';


@Component({
  selector: 'graph-device-summary',
  templateUrl: './graph-device-summary.component.html',
  styleUrls: ['./graph-device-summary.component.scss']
})


export class GraphDeviceSummaryComponent implements OnInit, OnChanges, AfterViewInit {
    testBar: any;
    @Input() dataSet: any;
    @Input() timeList: any;
    @Input() limit:any;
    @Input() selectedPatient: any;
    @Input() secondDataSet: any;
    @Input() type: any;
    @Input() obSet: any;
    @Input() ob: any;
    @Input() obs: any;
  //  ob: any;
    obY: any;
    tempList: any;
    list: any;
    dataList:any;
    @Input() isReport: any;
    @Input() language: any;
    @Input() patients: any;
    @Input() firstOb: any;
    @Input() profile: any;
    @Input() refresh: any;
    @Input() update: any;
    @ViewChild('barCanvas') barCanvas:any;
    @ViewChild('lineCanvas') lineCanvas:any;
    @ViewChild('pieCanvas') pieCanvas:any;
    temp_2: any;
    temp_3: any;
    temp_4: any;
    valueSet: any;
    temp: any;
    selectedOb: any;
    dataViewerType: any;
    oriOb: any;
    loading: any;
    bigScreen:any;
    dataValue:any;
    searchObName:any;
    optionList:any;
 
  constructor(public router: Router,
              public allServices:AllServices,
              @Inject(SESSION_STORAGE) private storage: StorageService
            ) {

    this.bigScreen=this.storage.get('bigScreen');
    
   }

  ngOnInit() {
   
        this.refresh=false;
  }
  ngOnChanges() {
    this.refresh=false;
    this.searchObName='';
    if (!this.obSet.dataViewerType){
      this.obSet.dataViewerType='table'
    }



  
    console.log ('this.obSet',this.obSet)
    this.dataViewerType=this.obSet.dataViewerType;

    
    this.getDeviceSummary(this.obSet);


    
         
      
     
    
      
}

ngAfterViewInit (){
  
}


getDeviceSummary(obSet:any){
   
    
    obSet.dataSet=[];
    obSet.timeList=[];

    obSet.obs=[];
   this.allServices.categoryService.getCategory(obSet._id).then((data)=>{
       this.temp=data;
  
   obSet.obs=this.temp.obs;
   console.log ('obSet.obs',  obSet.obs)
     for (let ob of obSet.obs){
       
        if (!ob.valueSet)
            ob.valueSet=[];
           // console.log ('this.profile', this.profile);
            if (ob.devices&&ob.devices.length>0){
                var filter={
                    profileUrl:this.profile.profileUrl.deviceUrl,
                    unid:this.selectedPatient.deviceUserID,
                    limit:this.limit,
                    _id:ob._id,
                    list:'yes',
                    code:ob.devices[0].location,
                    fields:`${ob.devices[0].ID} as Value`
                }
                console.log ('device filter', filter)
             //    console.log ('selectedPatient', this.selectedPatient);
               //  this.deviceService.getUserDataByDevice(this.profile.profileUrl.deviceUrl, this.selectedPatient.deviceUserID,ob.devices).then((data)=>{
                   this.allServices.deviceService.getAxiData(filter).then((data)=>{  
                     this.temp=data;
                        
                        console.log ('device data', this.temp);
                        ob.valueSet=[];
                        ob.timeSet=[];
                        if (this.temp&&this.temp.data){
                        for (let item of this.temp.data){
                       //     if (this.temp.data.indexOf(item)<=10){
                              //  var numbers=[];
                              //  numbers=item.deviceValue.split(';')
                             //   console.log ('numbers', numbers)
                            //   ob.valueSet.push(Number(numbers[ob.devices[0].location]));
                               if (item.Value==0)
                               ob.valueSet.push(null);
                                else
                               ob.valueSet.push(Number(item.Value));
                               ob.timeSet.push(item.DateTime);
                            
                        }
                        var coloR = [];
                            
                        var dynamicColors = function() {
                        var r = Math.floor(Math.random() * 255);
                        var g = Math.floor(Math.random() * 255);
                        var b = Math.floor(Math.random() * 255);
                        return "rgb(" + r + "," + g + "," + b + ")";
                            };

                        for (var i in ob.valueSet) {
                            coloR.push(dynamicColors());
                        }
                        if(!ob.label){
                            ob.label={
                                ch:ob.name,
                                en:ob.name
                            }
                        }
                        if (this.language=='Chinese')
                        var label=ob.label.ch;
                        else{
                            var label=ob.label.en;
                        }
                        var options = {
                            responsive: true,
                            maintainAspectRatio: false,
                            animation: {
                                duration: 0
                            },
                            hover: {
                                animationDuration: 0
                            },
                            responsiveAnimationDuration: 0
                        };
                    if (ob.type!='list'){
                      var set=ob.valueSet.reverse();
                        var temp={
                            data:set,
                            label: label,
                            datas:ob.valuesSet,
                            alertLevelSet:ob.alertLevelSet,
                            borderColor: dynamicColors(),
                            backgroundColor: dynamicColors(),
                            responsive: true,
                            fill: false,
                            options: options
                        };
                    }
                    else{
                      set=ob.valueSet.reverse();
                      var sets=ob.valuesSet.reverse();
                        temp={
                            data: set,
                            datas:sets,
                            label: label,
                            alertLevelSet:ob.alertLevelSet,
                            borderColor: dynamicColors(),
                            backgroundColor: dynamicColors(),
                            responsive: true,
                            fill: false,
                            options: options
                        };
                    }

                    obSet.dataSet.push(temp);
                    if (obSet.obs.indexOf(ob)==obSet.obs.length-1){
                        this.makeGraph(obSet); 
                    }
                  }
                                })
                                        
                   
                    }
                    
                    
                        
                    

            }
          
            })


 

  


}
findLevel(indexX:any, indexY:any){

    //console.log ('result',this.obSet.dataSet[indexX].alertLevelSet[indexY])
       return this.obSet.dataSet[indexX].alertLevelSet[indexY];
    
    }
makeGraph( obSet:any){

  
    
         console.log ('this.obSet.dataSet-2',this.obSet.dataSet)
        obSet.timeList=[]; 
        if (obSet.obs[0].timeSet&&obSet.obs[0].timeSet.length>0){
            for(let time of obSet.obs[0].timeSet){
                var currentDate = new Date(time);
    
                var date = currentDate.getDate();
                var month = currentDate.getMonth(); //Be careful! January is 0 not 1
                var year = currentDate.getFullYear();
                var hour= currentDate.getHours();
                var minute= currentDate.getMinutes();
    
                var timeItem = (month + 1) + "-" +date +' '+hour+':'+minute;
                obSet.timeList.push(timeItem)
            }
            obSet.timeList=obSet.timeList.reverse();
        }
       

        this.loading=false;
        if (this.dataViewerType=='line chart'&&this.obSet.dataSet.length>0){
            console.log ('obSet.dataSet',this.obSet.dataSet)
        if (!this.obSet.label){
            this.obSet.label={ch:this.obSet.name, en:this.obSet.name}
        }
            this.createLineChart(this.obSet.timeList,this.obSet.dataSet,this.obSet.label.ch )
        }
        else if (this.dataViewerType=='bar chart'&&this.obSet.dataSet.length>0)
            this.createBarGraph(this.obSet.timeList,this.obSet.dataSet,this.obSet.label.ch )

}

 

public chartType:string = 'line';

public chartDatasets:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset'}
];

public chartLabels:Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

public chartColors:Array<any> = [
    {
        backgroundColor: 'rgba(220,220,220,0.2)',
        borderColor: 'rgba(220,220,220,1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(220,220,220,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(220,220,220,1)'
    },
    {
        backgroundColor: 'rgba(151,187,205,0.2)',
        borderColor: 'rgba(151,187,205,1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(151,187,205,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(151,187,205,1)'
    }
];

public chartOptions:any = {
    responsive: true
};
public chartClicked(e: any): void { }
public chartHovered(e: any): void { }
    
  createBarGraph(labels:any,dataSet:any,text:any) {
    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: dataSet
      },
      options:{
        tooltips:{enabled:false}
      }
     // options: {
       // legend: { display: true,
         //   labels: {
         //       fontSize: 8
         //   } },
      //  title: {
      //    display: true,
      //    text: text
       // },
       // responsive: false
       
     // }
  });
  }

  createLineChart(labels:any,dataSet:any, text:any){

 
    //console.log ('obSet.dataSet',this.obSet.dataSet)
   var myChart=new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels:  labels,//['1500','1600','1700','1750','1800','1850','1900','1950','1999','2050'],
        datasets: dataSet//this.secondDataSet
      },
      options:{
        hover: {mode: undefined}
      }
    //  options: {
      //  legend: { display: true,
      //      labels: {
      //          fontSize: 8
      //      } },
      //  title: {
      //    display: true,
      //    text: text,
      
      //  },
       //responsive: false
        
      
    });
    myChart.update()
  }

  createDoughnutGraph(labels:any,dataSet:any, text:any) {
   
    new Chart(this.pieCanvas.nativeElement, {
        type: 'doughnut',
        data: {
            labels:  labels,//['1500','1600','1700','1750','1800','1850','1900','1950','1999','2050'],
            datasets: dataSet//this.secondDataSet
          },
      options:{
        hover: {mode: undefined}
      }
         // options: {
         //   legend: { display: true,
         //       labels: {
         //           fontSize: 8
         //       } },
         //   title: {
         //     display: true,
         //     text: text,
          
         //   },
           //responsive:false
            
         // }
        

})
}
  randomNumber(min=0, max=0) {
    if(min==0 || max== 0)
        return Math.round(Math.random() * 100);
    else
        return Math.random() * (max - min) + min;
}

randomBar(date:any, lastClose:any) {
    var open = this.randomNumber(lastClose * .95, lastClose * 1.05);
    var close = this.randomNumber(open * .95, open * 1.05);
    var high = this.randomNumber(Math.max(open, close), Math.max(open, close) * 1.1);
    var low = this.randomNumber(Math.min(open, close) * .9, Math.min(open, close));
    return {
        t: date.valueOf(),
        y: close
    };
}



}



