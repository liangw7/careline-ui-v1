import { Component, OnInit, OnChanges,Input,ViewChild, AfterViewInit, Inject, AfterContentInit  } from '@angular/core';
import { Chart } from 'chart.js';
import { Router} from '@angular/router';

import { NgStyle } from '@angular/common';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../common-services';



@Component({
  selector: 'graph-summary',
  templateUrl: './graph-summary.component.html',
  styleUrls: ['./graph-summary.component.scss']
})


export class GraphSummaryComponent implements OnInit, OnChanges, AfterViewInit {
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
    @Input() isFlowsheet:any;
    @Input() visits:any;
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
    obIDs:any;
    visitIDs:any;
    filter:any;
 
  constructor(public router: Router,
              public allServices:AllServices,
              @Inject(SESSION_STORAGE) private storage: StorageService
              ) {

    this.bigScreen=this.storage.get('bigScreen');
    
   }

  ngOnInit() {
    this.visitIDs=[];
    if (this.visits){
      for (let visit of this.visits){
        this.visitIDs.push(visit._id)
      }
    }
        
        this.refresh=false;
  }
  ngOnChanges() {
    this.visitIDs=[];
    if (this.visits){
      for (let visit of this.visits){
        this.visitIDs.push(visit._id)
      }
    }
        
    this.refresh=false;
    this.searchObName='';
    if (!this.obSet.dataViewerType){
      this.obSet.dataViewerType='table'
    }

     this.loading=true;
//  console.log ('this.ob',this.ob.name)

// console.log ('this.profile',this.profile)
          this.obs=this.obSet.obs;
  
          console.log ('this.obSet',this.obSet)
          this.dataViewerType=this.obSet.dataViewerType;
          this.obSet.obs=[];
         // this.getData(this.obSet);
     //    if (this.profile&&!this.profile.profileUrl)
            this.getSummary(this.obSet);
      //   else
        // this.getDeviceSummary(this.obSet);
         this.loading=false;
         
      
     
    
      
}

ngAfterViewInit (){
  
}
findLevel(indexX:any, indexY:any){

    //console.log ('result',this.obSet.dataSet[indexX].alertLevelSet[indexY])
       return this.obSet.dataSet[indexX].alertLevelSet[indexY];
    
    }
getValue(valueItem:any,dataItem:any){
  // console.log('ob dataItem=================',dataItem)
  for (let item of dataItem.data){
    if (valueItem==item){
      var index=dataItem.data.indexOf(item)
    }
  }
//  console.log('index===================',index)
//  console.log(dataItem.label,dataItem.data[index],index,dataItem.datas[index])
  return(dataItem.datas[index])
}
 
getSummary(obSet:any){
   
    
        obSet.dataSet=[];
        obSet.timeList=[];
        console.log ('obSet==============', obSet)
     this.obIDs=[];
     this.allServices.categoryService.getCategory(obSet._id).then((data)=>{
      this.temp=data;
      obSet.obs=this.temp.obs;
    
     for(let ob of obSet.obs){
      this.obIDs.push(ob._id);
     }
     if (this.visitIDs.length>0){
       this.filter={patientID: this.selectedPatient._id,
        obID:{'$in':this.obIDs},
        visitID:{'$in':this.visitIDs}};
     }
     else{
       this.filter={patientID: this.selectedPatient._id,
                   obID:{'$in':this.obIDs}};
     }
    
      //console.log('table ==================filter====================',filter)
     this.allServices.datasService.getDatasByFilter2(this.filter).then((data)=>{
                      this.temp=data;
                   //   console.log('data====================',this.temp)
                      for(let ob of obSet.obs){
                        ob.alertLevelSet=[];
                        ob.timeSet=[];
                        ob.valueSet=[];
                        ob.valuesSet=[];
                          for (let item of this.temp){
                              if(ob._id==item.obID){
                                if(item.values&&item.values.length>0)
                                {
                                 
                                  if (item.values[0].alertLevel){
                                    ob.alertLevelSet.push(item.values[0].alertLevel);
                                  }
                                  else if (!item.values[0].alertLevel){
                                    for(let option of ob.options){
                                      if (option.text==item.values[0]){
                                        ob.alertLevelSet.push(option.alertLevel);
                                      }
                                    }
                                  }
                                 
                                }
                                  ob.timeSet.push(item.createdAt);
                                  if (item.value)
                                     ob.valueSet.push(item.value);
                                   if (item.values)   
                                  ob.valuesSet.push(item.values);
                               
                              }
                              }
                           
                          }

                         // console.log('obSet=========',obSet)
                          for (let ob of obSet.obs){
                            //if (obSet.obs.indexOf(ob)==obSet.obs.length-1)
                                  this.makeGraph(ob, obSet);
           
                            }
                     })
                    })
     /*   this.categoryService.getSummary(
            {patientID: this.selectedPatient._id,
            obSetID:obSet._id, 
            limit: this.limit}).then((data)=>{

                    this.temp=data;
         

           if (this.temp.length>0)
            obSet.obs=this.temp[0].obs;
          
        
       
        for (let ob of obSet.obs){
           
            if (!ob.valueSet)
                ob.valueSet=[];
            
            this.makeGraph(ob, obSet);
           
            

    }
      

    
    });*/

}
getNotes(obSet:any){
   
    
  obSet.dataSet=[];
  obSet.timeList=[];
  console.log ('obSet==============', obSet)
this.obIDs=[];
this.allServices.categoryService.getCategory(obSet._id).then((data)=>{
this.temp=data;
obSet.obs=this.temp.obs;

for(let ob of obSet.obs){
this.obIDs.push(ob._id);
}
var  filter={patientID: this.selectedPatient._id,
                  obID:{'$in':this.obIDs}
            };
//console.log('table ==================filter====================',filter)
this.allServices.datasService.getDatasByFilter2(filter).then((data)=>{
                this.temp=data;
             //   console.log('data====================',this.temp)
                for(let ob of obSet.obs){
                  ob.alertLevelSet=[];
                  ob.timeSet=[];
                  ob.valueSet=[];
                  ob.valuesSet=[];
                    for (let item of this.temp){
                        if(ob._id==item.obID){
                          if(item.values&&item.values.length>0)
                          {
                           
                            if (item.values[0].alertLevel){
                              ob.alertLevelSet.push(item.values[0].alertLevel);
                            }
                            else if (!item.values[0].alertLevel){
                              for(let option of ob.options){
                                if (option.text==item.values[0]){
                                  ob.alertLevelSet.push(option.alertLevel);
                                }
                              }
                            }
                           
                          }
                            ob.timeSet.push(item.createdAt);
                            if (item.value)
                               ob.valueSet.push(item.value);
                            if (item.values)   
                               ob.valuesSet.push(item.values);
                          
                          
                        
                        }
                        }
                     
                    }

                   // console.log('obSet=========',obSet)
                    for (let ob of obSet.obs){
                      //if (obSet.obs.indexOf(ob)==obSet.obs.length-1)
                            this.makeGraph(ob, obSet);
     
                      }
               })
              })
/*   this.categoryService.getSummary(
      {patientID: this.selectedPatient._id,
      obSetID:obSet._id, 
      limit: this.limit}).then((data)=>{

              this.temp=data;
   

     if (this.temp.length>0)
      obSet.obs=this.temp[0].obs;
    
  
 
  for (let ob of obSet.obs){
     
      if (!ob.valueSet)
          ob.valueSet=[];
      
      this.makeGraph(ob, obSet);
     
      

}



});*/

}
findTime(time:any,timeList:any){
  console.log('timeList',timeList)
  console.log('time',time)
  

 
  for(let item of timeList){
    
    if (time.getDate()==item.getDate()&&time.getMonth()==item.getMonth()&&time.getFullYear()==item.getFullYear() ){
      return true;
    }
  }
  return false;
}
makeGraph(ob:any, obSet:any){

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
       
            var temp={
                data: ob.valueSet,
                label: label,
                datas:ob.valuesSet,
                alertLevelSet:ob.alertLevelSet,
                borderColor: dynamicColors(),
                backgroundColor: dynamicColors(),
                responsive: true,
                fill: false,
                options: options
            };
        
   

        obSet.dataSet.push(temp);
    
        // console.log ('this.obSet.dataSet',this.obSet.dataSet)
        obSet.timeList=[]; 
        obSet.timeListOri=[]; 
        if (obSet.obs[0].timeSet&&obSet.obs[0].timeSet.length>0){
          for ( let ob of obSet.obs){

          
            for(let time of ob.timeSet){

              
              var currentDate = new Date(time);
    
              var date = currentDate.getDate();
              var month = currentDate.getMonth(); //Be careful! January is 0 not 1
              var year = currentDate.getFullYear();
              var hour= currentDate.getHours();
              var minute= currentDate.getMinutes();
  
              var timeItem = (month + 1) + "-" +date +' '+hour+':'+minute;
             
    
                
                if (!this.findTime(currentDate,obSet.timeListOri)){
                  obSet.timeListOri.push(currentDate)
                obSet.timeList.push(timeItem)
              }
            }
          }
        }
       

        this.loading=false;
      //  console.log ('obSet.dataSet',obSet.dataSet)
        if (this.dataViewerType=='line chart'&&obSet.dataSet.length>0){
           
       
            this.createLineChart(obSet.timeList,obSet.dataSet,obSet.label.ch )
        }
        else if (this.dataViewerType=='bar chart'&&obSet.dataSet.length>0)
            this.createBarGraph(obSet.timeList,obSet.dataSet,obSet.label.ch )

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
     
          options: {
            hover: {mode: undefined},
           legend: { display: true,
               labels: {
                   fontSize: 8
               } },
           title: {
             display: true,
             text: text,
          
            },
           responsive:false
            
          }
        

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



