import { Component, OnInit, Inject,ElementRef, OnChanges,
  ViewChild, Input, AfterViewInit  } from '@angular/core';
import { Chart } from 'chart.js';
import { AllServices } from '../../common-services';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'growth-chart',
  templateUrl: './growth-chart.component.html',
  styleUrls: ['./growth-chart.component.scss']
})
export class GrowthChartComponent implements OnInit, OnChanges {
  @ViewChild('lineCanvas') lineCanvas:any;
  @ViewChild('img') img:any;
  temp:any;
  bigScreen:any;
  chart:any;
  temp1:any;
  loading:any;
  dataURL:any;
  url:any;
  age:any;
  @Input() width:any;
  @Input() height:any;
  @Input() ob:any;
  @Input() patient:any;
  @Input() toImage:any;
  data:any;
  constructor(private allServices:AllServices,
    @Inject(SESSION_STORAGE) private storage: StorageService) { }

  ngOnInit() {
    this.getPatientAge();
    console.log ('this.ob===================', this.ob)
    var birthday=new Date(this.patient.birthday)
    var timeDiff = Math.abs(Date.now() - birthday.getTime());
    var value = timeDiff / (1000 * 3600 * 24); 
    this.age=value/365;
    console.log ('value================',value)
  if (this.ob.desc&&this.ob.desc.charts){
   // alert('got desc')
  if( this.age<=18){
  
    this.createGrowthChart();
  }
  else{
  
    this.createObChart();
  }
}
  else{
 
    this.createObChart();
  }
  
}
ngOnChanges() {
  this.getPatientAge()
  console.log ('this.ob===================', this.ob)
  var birthday=new Date(this.patient.birthday)
  var timeDiff = Math.abs(Date.now() - birthday.getTime());
  var value = timeDiff / (1000 * 3600 * 24); 
  this.age=value/365;
  console.log ('value================',value)
if (this.ob.desc&&this.ob.desc.charts){
 // alert('got desc')
if( this.age<=18){

  this.createGrowthChart();
}
else{

  this.createObChart();
}
}
else{

  this.createObChart();
}

}
  
getPatientAge(){
  this.patient.ageObj={number:null,uom:null}
   console.log ('this.patient.birthday',this.patient.birthday )
   
      var timeDiff = Math.abs(Date.now() - (new Date(this.patient.birthday)).getTime());
     
     console.log ('timeDiff', timeDiff)
     var value = timeDiff / (1000 * 3600 * 24) / 365.25; 
     if (value >2){
      this.patient.ageObj.number = Math.floor(value);
      this.patient.ageObj.uom='y'
      }
      else if (value <=2){
        
        value=value*12;
        if (value>1){
          this.patient.ageObj.number = Math.floor(value);
          this.patient.ageObj.uom='m'
        }
            
            else{
              this.patient.ageObj.number =Math.floor(value*30);
              this.patient.ageObj.uom='d'
            }
          }
      console.log ('tis.patient.ageObj', this.patient.ageObj)
}
  pedsPatient(){

    /*if (this.patient.ageObj.uom!='y'){
      return true;
    }
    else if (this.patient.ageObj.uom=='y'&&this.patient.ageObj.number<19){
      return true
    }
    else if (this.patient.age){
      return false;
    }
    else
      return false;*/
      var birthday=new Date(this.patient.birthday)
      var timeDiff = Math.abs(Date.now() - birthday.getTime());
      var value = timeDiff / (1000 * 3600 * 24); 
      value=value/365;
      console.log ('value================',value)
      if (value<18){
        return true
      }
      else return false;
   
  }

  PatientYongerThanThree(){
    if (this.patient.ageObj.uom=='d'||this.patient.ageObj.uom=='m')
    return true;
    else if (this.patient.ageObj.number<=3||this.patient.ageObj.uom=='y')
    return true;
    else 
    return false;
  }




  
  public timeList=['0','0.5','1.5','2.5','3.5','4.5','5.5','6.5','7.5',
  '8.5','9.5','10.5','11.5','12.5',
  '13.5','14.5','15.5','16.5','17.5','18.5','19.5','20.5','21.5',
  '22.5','23.5','24.5','25.5','26.5','27.5',
  '28.5','29.5','30.5','31.5','32.5','33.5','34.5','35.5','36'];

  createObChart(){
    this.loading=true;
    this.allServices.datasService.getDatasByFilter2({obID:this.ob._id, patientID:this.patient._id}).then((data)=>{
      this.temp=data;
      var timeList=[];
      var dataList=[];
      this.loading=false;
      for (let item of this.temp){
       var currentDate = new Date(item.createdAt);
       
       var date = currentDate.getDate();
       var month = currentDate.getMonth(); //Be careful! January is 0 not 1
       var year = currentDate.getFullYear();
       var hour= currentDate.getHours();
       var minute= currentDate.getMinutes();
   
       var timeItem = (month + 1) + "-" +date +' '+hour+':'+minute;
     if (item.value&&item.value!=''){
      dataList.push(item.value);
      timeList.push(timeItem);
     }
     
    
      }
    
     //console.log ('obSet.dataSet',this.obSet.dataSet)
    var myChart=new Chart(this.lineCanvas.nativeElement, {
       type: 'line',
       data: {
         labels:  timeList,//['1500','1600','1700','1750','1800','1850','1900','1950','1999','2050'],
         datasets: [{data:dataList,borderColor: "#3e95cd"}]//this.secondDataSet
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
     myChart.update();

      this.url=myChart.toBase64Image();
     
   //   console.log ('this.img.src',this.url)
    
   })
   }
   compareTime(time:any, timeList:any){
     for (let item of timeList){
       if (Number(time)==Number(item)){
         return true;
       }
     }
     return false;
   }

   findChart(){

    var age=0;
    if (this.age<1){
      age=0;
    }
    else if (this.patient.ageObj.uom=='y')
      age=this.patient.ageObj.number;
    if (this.patient.gender=='女'){
      var gender='female'
    }
    else {
      gender='male'
    }
    if (this.ob.desc.charts&&this.ob.desc.charts.length==1){
      this.chart=this.ob.desc.charts[0];
    }
    else if (this.ob.desc.charts&&this.ob.desc.charts.length>0){
      for (let chart of this.ob.desc.charts){
        if (chart.desc.gender==gender){
            if (age>=chart.desc.startYear&&age<=chart.desc.endYear){
              if (this.patient.pregnancyWeeks&&this.patient.pregnancyWeeks<35&&chart.desc.term=='premature'){
                    this.chart=chart;
              }
              else {
                this.chart=chart
              }
            }
          
           
        }
        
      }
    }
   }
   createGrowthChart(){
     console.log ('ob============', this.ob)
     console.log ('this.chart============', this.chart)
     this.findChart();
     if (this.chart){
       if (!this.chart.desc.xel){
            this.buildChart();
       }
       else {
         this.buildXelChart();
       }
     }
       
     else
        this.createObChart()
}

buildXelChart(){
  this.loading=true;
  this.allServices.datasService.getDatasByFilter2({obID:this.ob._id, patientID:this.patient._id}).then((data)=>{
    this.temp=data;
    var visitIDList=[];
    var visitList:any;
    visitList=[];
    for (let item of this.temp){
        visitIDList.push(item.visitID);
        var temp={_id:item.visitID,obValue:null,xelValue:null};
        visitList.push(temp)
    } 
    this.allServices.datasService.getDatasByFilter2({visitID:{'$in':visitIDList}, patientID:this.patient._id}).then((data)=>{
      this.temp1=data;
      for (let item of this.temp1){
        for (let visit of visitList){
          if (item.visitID==visit._id){
              if (item.obID==this.ob._id){
                  visit.obValue=item.value;
              }
              else if (item.obID==this.chart.desc.xel){
                visit.xelValue=item.value
              }
          }
        }
      }
      this.allServices.categoryService.getCategory(this.chart._id).then((data)=>{
          this.temp=data;
          this.loading=false;
          this.data= JSON.parse(this.temp.desc.data);
         console.log ('this.data============', this.data)
          var dataObjList=[]

          for (let timeItem of this.data.label){
            dataObjList.push({time:timeItem, data:0})
          }

          for (let visit of visitList){
            for (let dataItem of dataObjList){
       
              var dif=visit.xelValue-Number(dataItem.time);
              console.log ('dif',dif)
              if (dif<=0.5&&dif>=0){
              // if (age==dataItem.time){
                dataItem.data=Number(visit.obValue);
               // dataList.push(dataItem.data)
                //console.log ('dataItem', dataItem)
              }
              else if (dif<0&&dif>=-0.5)
              dataItem.data=Number(visit.obValue);
              
            }
          }
          var dataList=[];
          for (let dataItem of dataObjList){
            if (dataItem.data>0)
            dataList.push(dataItem.data)
          }
            console.log ('dataList',dataList)
            var dataSet=[];
            for (let item of this.data.set){
              if (this.patient.gender=='男'){
                var dynamicColors = function() {
                  var rand = Math.floor(Math.random() * 10);
                  var r = 180;
                  var g = Math.floor(Math.random() * 100);
                  var b = Math.floor(Math.random() * 100);
                 //return  "rgb(" + (215 - rand * 3) + "," + (185 - rand * 5) + "," + (185 - rand * 10) + ")"
                  return  'hsl(' + r + ', ' + g + '%, ' + b + '%)';
              };
              }
              else{
                var dynamicColors = function() {
                  var rand = Math.floor(Math.random() * 10);
                  var r = 340;
                  var g = Math.floor(Math.random() * 100);
                  var b = Math.floor(Math.random() * 100);
                 //return  "rgb(" + (215 - rand * 3) + "," + (185 - rand * 5) + "," + (185 - rand * 10) + ")"
                  return  'hsl(' + r + ', ' + g + '%, ' + b + '%)';
              };
              }
             
            dataSet.push({
              data:item.data,
              borderColor:dynamicColors(),
              backgroundColor:'transparent',
              label:item.label,
              pointRadius: 0,
              pointBorderWidth: 0
            })
            }
            dataSet.splice(0,0,{data:dataList,borderColor: "red", 
                            backgroundColor:'transparent',
                            label:this.patient.name,
                            pointRadius: 5,pointBorderWidth: 5}
            
            );
            
        var myChart=new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels:  this.data.label,//this.timeList,//['1500','1600','1700','1750','1800','1850','1900','1950','1999','2050'],
            datasets: dataSet,//this.secondDataSet
          },
          options:{
            hover: {mode: undefined}, 
           // pointBackgroundColor:'red'
           responsive: false
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
        myChart.update();
       
          
          this.url=myChart.toBase64Image();
     
      //console.log ('this.img.src',this.url)
        
         
        })
      
    })
  })
}
buildChart(){
  this.loading=true;
  this.allServices.datasService.getDatasByFilter2({obID:this.ob._id, patientID:this.patient._id}).then((data)=>{
    this.temp1=data;
    var dataList:any;
    dataList=[];
   
    console.log ('this.temp1', this.temp1)
  

    this.allServices.categoryService.getCategory(this.chart._id).then((data)=>{
      this.temp=data;
      this.loading=false;
      this.data= JSON.parse(this.temp.desc.data);
     // console.log ('this.data============', this.data)
      var dataObjList=[]
      for (let timeItem of this.data.label){
        dataObjList.push({time:timeItem, data:0})
      }
     // console.log ('dataObjList',dataObjList)
      for (let item of this.temp1){
        var currentDate = new Date(item.visitDate);
        var birthday=new Date(this.patient.birthday);
        var age=currentDate.getTime()-birthday.getTime();
        if (this.chart.desc.uom=='d')
          age=age / (1000 * 3600 * 24);
        else if (this.chart.desc.uom=='y')
          age = age / (1000 * 3600 * 24) / 365.25; 
        else if (this.chart.desc.uom=='m')
          age = age / (1000 * 3600 * 24) / 365.25*12; 
        console.log ('age=====', age)
      
       // age=this.age*12;
       // 
        for (let dataItem of dataObjList){
       
          var dif=age-Number(dataItem.time);
    
          if (dif<=0.5&&dif>=0){
            console.log ('dif',dif);
          // if (age==dataItem.time){
            dataItem.data=Number(item.value);
           // dataList.push(dataItem.data)
            console.log ('dataItem', dataItem)
          }
          else if (dif<0&&dif>=-0.5)
          dataItem.data=Number(item.value);
          
        }
      }
        console.log ('dataObjList',dataObjList)
        for (let dataItem of dataObjList){
          if (dataItem.data>0)
          dataList.push(dataItem.data)
        }
        //  console.log ('dataList',dataList)
        
        
      var dataSet=[];
      for (let item of this.data.set){
        if (this.patient.gender=='男'){
          var dynamicColors = function() {
            var rand = Math.floor(Math.random() * 10);
            var r = 180;
            var g = Math.floor(Math.random() * 100);
            var b = Math.floor(Math.random() * 100);
           //return  "rgb(" + (215 - rand * 3) + "," + (185 - rand * 5) + "," + (185 - rand * 10) + ")"
            return  'hsl(' + r + ', ' + g + '%, ' + b + '%)';
        };
        }
        else{
          var dynamicColors = function() {
            var rand = Math.floor(Math.random() * 10);
            var r = 340;
            var g = Math.floor(Math.random() * 100);
            var b = Math.floor(Math.random() * 100);
           //return  "rgb(" + (215 - rand * 3) + "," + (185 - rand * 5) + "," + (185 - rand * 10) + ")"
            return  'hsl(' + r + ', ' + g + '%, ' + b + '%)';
        };
        }
       
      dataSet.push({
        data:item.data,
        borderColor:dynamicColors(),
        backgroundColor:'transparent',
        label:item.label,
        pointRadius: 0,
        pointBorderWidth: 0
      })
      }
      dataSet.splice(0,0,{data:dataList,borderColor: "red", 
                      backgroundColor:'transparent',
                      label:this.patient.name,
                      pointRadius: 4,pointBorderWidth: 2}
      
      );
  if (dataSet){

  
  var myChart=new Chart(this.lineCanvas.nativeElement, {
    type: 'line',
    data: {
      labels:  this.data.label,//this.timeList,//['1500','1600','1700','1750','1800','1850','1900','1950','1999','2050'],
      datasets: dataSet,//this.secondDataSet
    },
    options:{
      hover: {mode: undefined}, 
     // pointBackgroundColor:'red'
     responsive: false
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
  myChart.update();

  this.url=myChart.toBase64Image();
}
  //console.log ('this.img.src',this.url)
  
 
    })
   
 
    

  })
}
}
