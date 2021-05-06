import { Component, OnInit, OnChanges,Input,ViewChild, AfterViewInit, Inject, AfterContentInit  } from '@angular/core';
import { Chart } from 'chart.js';
import { Router} from '@angular/router';
import { AllServices } from '../../common-services';

import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';



@Component({
  selector: 'graph-report',
  templateUrl: './graph-report.component.html',
  styleUrls: ['./graph-report.component.scss']
})


export class GraphReportComponent implements OnInit, OnChanges, AfterViewInit {
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
    showForm:any;
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
              @Inject(SESSION_STORAGE) private storage: StorageService,
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

this.loading=true;
//  console.log ('this.ob',this.ob.name)

// console.log ('this.profile',this.profile)
this.obs=this.obSet.obs;
      if (!this.isReport){
          console.log ('this.obSet',this.obSet)
          this.dataViewerType=this.obSet.dataViewerType;
          this.obSet.obs=[];
         // this.getData(this.obSet);
         this.getSummary(this.obSet);
         this.loading=false;
         
      }
      else if (this.isReport){
          this.getReportOne();
          
      }
    
      
}
refreshGraph(){
    this.refresh=true;
    if (this.obY){
        this.getMultipleReprot();
  }
  else{
     this.getReportOne();
  }

}
ngAfterViewInit (){
  
}


processReport(valueList:any){
    console.log ('valueSet', valueList)
    for (let item of valueList){
        if (item.values&&!item.values.text){
        var value=item.values.substring(0, 1);
        console.log('value',value)
        if (value=='A'||value=='B'||value=='C'||value=='D'){
           
            value=item.values.substring(0, 1);
            this.ob.labelList.push(item.values);
            console.log('value-2',value)
        }
        else{
            value=item.values
        }
    
      
       
        this.ob.timeList.push(value);
        this.ob.valueSet.push(item.count)
    }
    }

        var coloR=[];
        var dynamicColors = function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        };
    
            for (var i in this.ob.valueSet) {
                coloR.push(dynamicColors());
            }
           if (this.ob.dataViewerType=='pie chart'){
               if (this.ob.label){
                this.temp={
                    data: this.ob.valueSet,
                    label: this.ob.label.ch,
                    backgroundColor: coloR,
                    borderColor: coloR,
                    fill: false
                  };
                }
                  else {

                    this.temp={
                        data: this.ob.valueSet,
                        label: this.ob.name,
                        backgroundColor: coloR,
                        borderColor: coloR,
                        fill: false
                      };
               }
          
           }
           else{
               if ( this.ob.label){
                this.temp={
                    data: this.ob.valueSet,
                    label: this.ob.label.ch,
                    backgroundColor: dynamicColors(),
                    borderColor: dynamicColors(),
                    fill: false
                  };
                }
                  else {
                    this.temp={
                        data: this.ob.valueSet,
                        label: this.ob.name,
                        backgroundColor: dynamicColors(),
                        borderColor: dynamicColors(),
                        fill: false
                      };
                  
               }
           
           }
    
           this.ob.dataSet=[];
           this.ob.dataSet.push(this.temp);
        //   setTimeout(() => {
            if (this.dataViewerType=='line chart'){
                if (this.ob.label)
                this.createLineChart(this.ob.timeList, this.ob.dataSet,this.ob.label.ch );
                else 
                this.createLineChart(this.ob.timeList, this.ob.dataSet,this.ob.name );
              }
             
              
               else if (this.dataViewerType=='bar chart'){
                   if (this.ob.label)
                   this.createBarGraph(this.ob.timeList, this.ob.dataSet,this.ob.label.ch )
                   else 
                   this.createBarGraph(this.ob.timeList, this.ob.dataSet,this.ob.name )
               }
                    
                else if (this.dataViewerType=='pie chart'){
                    if (this.ob.label)
                    this.createDoughnutGraph( this.ob.timeList, this.ob.dataSet,this.ob.label.ch)
                    else 
                    this.createDoughnutGraph( this.ob.timeList, this.ob.dataSet,this.ob.name)
                }
                
           // },600);
                this.loading=false;
              
}
getReportOne(){

    var filter={
        profileID: this.profile._id,
        obSetID: this.obSet._id,
        obXID: this.ob._id,
        obYID: ""
    }
   this.allServices.reportsService.getReportsByFilter(filter).then((data)=>{

        this.temp=data;
        this.ob.timeList=[];
        this.ob.valueSet=[];
        this.ob.saveData=[];
        this.ob.dataSet=[];
        this.ob.saveData=data;
        this.ob.labelList=[];
        this.dataViewerType=this.ob.dataViewerType;
        console.log ('this.dataViewerType',this.dataViewerType)
        console.log ('ob',this.ob)
console.log ('data from report=============',this.temp)
        if (this.temp.length>0&&!this.refresh){
         this.processReport(this.temp[0].dataSet);
        }
        else if (this.temp.length==0||this.refresh){
   
   console.log ('refresh', this.refresh)
//this.dataService.getReport({obID:this.ob._id, profileID:this.profile._id} ).then((data)=>{
    this.allServices.datasService.getReport({limit:this.limit,ob:this.ob, obID:this.ob._id, profileID:this.profile._id} ).then((data)=>{
        this.temp=data;
        this.dataValue=data;
        this.refresh=false;
        console.log (' this.dataValue', this.dataValue)
        this.processReport(this.temp);
        console.log ('data to be saved to report ==================',  this.dataValue)
        this.saveReport(this.dataValue,"");
        })
        }
    })
//console.log ('start graph')
 
   /*var filter={
        profileID: this.profile._id,
        obSetID: this.obSet._id,
        obXID: this.ob._id,
        obYID: ""
    }
   this.reportService.getReportsByFilter(filter).then((data)=>{
        this.temp=data;
      //  console.log ('got report')
        if (this.temp.length==0||this.refresh){
            this.getReport();
        }
        else{
            //console.log ('this.temp', this.temp)
            this.ob.timeList=[];
            this.ob.dataSet=[];
            this.ob.timeList=this.temp[this.temp.length-1].timeList;
            this.ob.dataSet=this.temp[this.temp.length-1].dataSet;
            
                if (this.dataViewerType=='line chart')
                    this.createLineChart(this.ob.timeList, this.ob.dataSet,this.ob.name )
                 else if (this.dataViewerType=='bar chart')
                    this.createBarGraph(this.ob.timeList, this.ob.dataSet,this.ob.name )
                else if (this.dataViewerType=='pie chart'){
                    this.createDoughnutGraph( this.ob.timeList, this.ob.dataSet,this.ob.name)
                }
                  
           sthis.loading=false;
        }
    })*/
}

getMultipleReprot(){
    var filter={
        profileID: this.profile._id,
        obSetID: this.obSet._id,
        obXID: this.ob._id,
        obYID: this.obY._id
    }
   console.log ( 'this.refresh',this.refresh);
    if (!this.refresh){

    
        this.allServices.reportsService.getReportsByFilter(filter).then((data)=>{
        this.temp=data;
        console.log('multi data from report*************', this.temp, this.refresh)
        if (this.temp.length>0){
           this.processMultiReport(this.temp[0].dataSet)
        }
       else if (this.temp.length==0){
        this.loading=true;
        this.allServices.datasService.getMultiReport({limit:this.limit,
            obID:this.ob._id, 
            obYID:this.obY._id}).then((data)=>{
                console.log ('data got', data)
                this.temp=data;
                this.temp=data;
                this.getMultipleReport(this.temp)
               console.log ( 'this.dataValue', this.dataValue)
                //this.dataValue=data;
                this.loading=false;
                this.refresh=false;
                var tempData=[];
                tempData=this.dataValue;
                console.log ('tempData',tempData)
        this.processMultiReport(tempData);
        this.saveReport( this.dataValue, this.obY._id)
       })
    }
  
})
    }
    else{
        this.loading=true;
      
   
     
        this.allServices.datasService.getMultiReport({limit:this.limit,
            obID:this.ob._id, 
            obYID:this.obY._id}).then((data)=>{
                console.log ('data got', data)
                this.temp=data;
                this.getMultipleReport(this.temp)
               console.log ( 'this.dataValue', this.dataValue)
                //this.dataValue=data;
                this.loading=false;
                this.refresh=false;
                var tempData=[];
                tempData=this.dataValue;
                console.log ('tempData',tempData)
        this.processMultiReport(tempData);
        this.saveReport( this.dataValue, this.obY._id)
       })

    }

}

getMultipleReport(temp:any){
    this.dataValue=[];
    var valuesList=[];
    var tempList=[];
    //for values
    for (let item of temp){
       for (let dataItem of item.data){
            if (dataItem.obID==this.ob._id){
                tempList.push({values:dataItem.values, 
                                index:temp.indexOf(item)
                            })
                
             }
        }
    }

    //for valuesYItem
    for (let item of temp){
        for (let dataItem of item.data){
             if (dataItem.obID==this.obY._id){
                 for (let valuesListItem of tempList){
                     if (temp.indexOf(item)==valuesListItem.index){
                       
                        valuesList.push({values:valuesListItem.values,
                                        valueYsItem:{values:dataItem.values,
                                            count:item.count}
                                        })
                     }
                 }
                
              }
         }
     }
        console.log ('valuesList',valuesList)
    for (let item2 of valuesList){
        if (item2.values!=null){
            if (this.findValues(item2.values, this.dataValue)==-1&&item2.valueYsItem!=null){
                this.dataValue.push({values:item2.values,valueYs:[item2.valueYsItem] })
            }
            else if (this.findValues(item2.values, this.dataValue)>=0&&item2.valueYsItem!=null){
                var index=this.findValues(item2.values, this.dataValue);
               
                if (!this.dataValue[index].valueYs)
                this.dataValue[index].valueYs=[];
                this.dataValue[index].valueYs.push(item2.valueYsItem)
            }
        }
      
    }
    for (let dataValueItem of this.dataValue){
      
        
        dataValueItem.valueYs=this.processvalueYs(dataValueItem.valueYs)
    }

    console.log ('this.dataValue',this.dataValue)
}


processvalueYs( valueYs:any){
  
    var list=[]
    var list2=[]
    for (let valueYsItem of valueYs){
       if(this.findValues(valueYsItem.values, list)==-1){
           list.push({values:valueYsItem.values, count:valueYsItem.count})
       }
       else{
            var index=this.findValues(valueYsItem.values, list)
            list[index].count+=valueYsItem.count
       }
    }

    list2=this.sortList(this.optionList, list);
  
return list2
}
findValues(values:any, valuesList:any){
    if (valuesList.length==0){
        return -1
    }
for (let item of valuesList){
    if (values==item.values){
        return valuesList.indexOf(item);
    }
}
return -1;
}
onChangeY($event:any){
this.loading=true;
    
    for (let obItem of this.obSet.obs){
        if ($event.value===obItem.name&&obItem._id!==this.ob._id){
         //   console.log ('ok-change-1')
            this.obY=obItem;
            console.log ('this.obY',this.obY)
            this.optionList=[];
            for (let option of this.obY.options){
                this.optionList.push(option.text)
            }
        }
    }
     this.getMultipleReprot();   
}
processMultiReport_test(data:any){
    this.ob.timeList=[];
    this.ob.dataSet=[];
    console.log('multi report', data)
    this.temp=data;
    this.ob.saveData=[];
    this.ob.saveDate=data;
    for (let item of this.temp){
       
        var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        }
        var countList=[];
        var labelList=[];
        for (let itemY of item.valueYs){
            var value=itemY.values.substring(0, 1);

            if (value=='A'||value=='B'||value=='C'||value=='D'){
                console.log('value',value)
                value=itemY.values.substring(0, 1);
                console.log('value-2',value)
            }
            else{
                value=itemY.values
            }
          
            
           
            countList.push(itemY.count);
            labelList.push(value);
            if (this.ob.timeList.indexOf(value)==-1)
                this.ob.timeList.push(value);
        }
        var value_2=item.values.substring(0, 1);
        if (value_2=='A'||value_2=='B'||value_2=='C'||value_2=='D'){
            console.log('value_2',value_2)
            value_2=item.values.substring(0, 1);
            console.log('value-2',value_2)
        }
        else{
            value_2=item.values
        }
        var dataSetItem={data:countList, 
                        label:value_2,
                        borderColor: dynamicColors(),
                        backgroundColor: dynamicColors(),
                        fill: false}
        this.ob.dataSet.push(dataSetItem);
}

this.dataViewerType='bar chart'
this.createBarGraph(this.ob.timeList,this.ob.dataSet,this.ob.name+'/'+this.obY.name );
this.loading=false;

}
processMultiReport(data:any){
    this.ob.timeList=[];
    this.ob.dataSet=[];
   
   
    var miltiData=data;
    console.log('multi report', miltiData)
    this.ob.saveData=[];
    this.ob.saveDate=data;
    for (let item of miltiData){
       
        var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        }
        var countList=[];
        var labelList=[];
        for (let itemY of item.valueYs){
            if (itemY.values&&!itemY.values.text){
            var value=itemY.values.substring(0, 1);

            if (value=='A'||value=='B'||value=='C'||value=='D'){
                console.log('value',value)
                value=itemY.values.substring(0, 1);
                console.log('value-2',value)
            }
            else{
                value=itemY.values
            }
         
            
           
            countList.push(itemY.count);
            labelList.push(value);
            if (this.ob.timeList.indexOf(value)==-1)
                this.ob.timeList.push(value);
            }
        }
        if (item.values&&!item.values.text){
        var value_2=item.values.substring(0, 1);
        if (value_2=='A'||value_2=='B'||value_2=='C'||value_2=='D'){
            console.log('value_2',value_2)
            value_2=item.values.substring(0, 1);
            console.log('value-2',value_2)
        }
        else{
            value_2=item.values
        }
    
        var dataSetItem={data:countList, 
                        label:value_2,
                        borderColor: dynamicColors(),
                        backgroundColor: dynamicColors(),
                        fill: false}
        this.ob.dataSet.push(dataSetItem);
    }
}

this.dataViewerType='bar chart'
this.createBarGraph(this.ob.timeList,this.ob.dataSet,this.ob.name+'/'+this.obY.name );
this.loading=false;

}
found(patientID:any){

    for (let patient of this.patients){
        if (patientID===patient._id)
        return true;
    }
return false;
}
sortList(list:any, listToSort:any){
    console.log ('list', list)
var tempList=[]
    for (let listItem of list){
        for (let listToSortItem of listToSort){
            
            if (String(listItem)==String(listToSortItem.values)){
                console.log ('listItem',listItem)
                console.log ('listToSortItem.values',listToSortItem.values)
                tempList.push(listToSortItem);
            }
        }
    }
    console.log ('tempList',tempList)
return tempList;
}

saveReport( dataValue:any,obYID:any){
      var filter={
            profileID: this.profile._id,
            obSetID: this.obSet._id,
            obXID: this.ob._id,
            obYID: obYID
        }
        console.log ('this.ob.timeList',this.ob.timeList)
        console.log ('this.ob.dataSet',this.ob.dataSet)
        this.allServices.reportsService.getReportsByFilter(filter).then((data)=>{
            this.temp=data;
         
            if (this.temp.length==0){
                  this.allServices.reportsService.create({
                        profileID: this.profile._id,
                        obSetID: this.obSet._id,
                        obXID:  this.ob._id,
                        obYID:obYID,
                        timeList: this.ob.timeList,
                        dataSet: dataValue
                    }).then((data)=>{
                        console.log ('new report created', data);
                    
            })
        }
        else{
            this.allServices.reportsService.update({
                _id:this.temp[this.temp.length-1]._id,
                profileID: this.profile._id,
                obSetID: this.obSet._id,
                obXID: this.ob._id,
                obYID:obYID,
                timeList: this.ob.timeList,
                dataSet: dataValue
            }).then((data)=>{
                console.log ('new report updated', data);
            })
          
        
        }
        
        })
}
/*    for (let item of this.temp){
                this.reportService.Delete(item._id).then((data)=>{
                 
                   
              })
            }
           
              this.reportService.Create({
                        profileID: this.profile._id,
                        obSetID: this.obSet._id,
                        obXID:  this.ob._id,
                        obYID:obYID,
                        timeList: this.ob.timeList,
                        dataSet: dataValue
                    }).then((data)=>{
                        console.log ('new report created after deletion', data);
                    
            }) */

get2DReport($event:any){

    for (let obItem of this.obSet.obs){
        if ($event.value===obItem.name&&obItem._id!==this.ob._id){
         //   console.log ('ok-change-1')
            this.obY=obItem;
        }
    }
    var filter={
        profileID: this.profile._id,
        obSetID: this.obSet._id,
        obXID: this.ob._id,
        obYID: this.obY._id
    }
   this.allServices.reportsService.getReportsByFilter(filter).then((data)=>{
        this.temp=data;
        if (this.temp.length>0){
            this.temp[0].timeList=this.temp[0].timeList;
            this.temp[0].dataSet=this.temp[0].dataSet;
            this.dataViewerType='bar chart'
            this.createBarGraph(this.ob.timeList,
                this.ob.dataSet,
                this.ob.label.ch+'/'+this.obY.label.ch );
            this.loading=false;
        }
        else{
           this.allServices.datasService.getMultiReport({limit:this.limit,obID:this.ob._id, obYID:this.obY._id}).then((data)=>{
                this.ob.timeList=[];
                this.ob.dataSet=[];
                console.log('multi report', data)
                this.temp=data;
                for (let item of this.temp){
                   
                    var dynamicColors = function() {
                    var r = Math.floor(Math.random() * 255);
                    var g = Math.floor(Math.random() * 255);
                    var b = Math.floor(Math.random() * 255);
                        return "rgb(" + r + "," + g + "," + b + ")";
                    }
                    var countList=[];
                    var labelList=[];
                    for (let itemY of item.valueYs){
                        var value=itemY.values.substring(0, 1);
        
                        if (value=='A'||value=='B'||value=='C'||value=='D'){
                            console.log('value',value)
                            value=itemY.values.substring(0, 1);
                            console.log('value-2',value)
                        }
                        else{
                            value=itemY.values
                        }
                      
                        
                       
                        countList.push(itemY.count);
                        labelList.push(value);
                        if (this.ob.timeList.indexOf(value)==-1)
                            this.ob.timeList.push(value);
                    }
                    var value_2=item.values.substring(0, 1);
                    if (value_2=='A'||value_2=='B'||value_2=='C'||value_2=='D'){
                        console.log('value_2',value_2)
                        value_2=item.values.substring(0, 1);
                        console.log('value-2',value_2)
                    }
                    else{
                        value_2=item.values
                    }
                    var dataSetItem={data:countList, 
                                    label:value_2,
                                    borderColor: dynamicColors(),
                                    backgroundColor: dynamicColors(),
                                    fill: false}
                    this.ob.dataSet.push(dataSetItem);
            }
           // this.saveReport(this.obY._id);
            this.dataViewerType='bar chart'
            this.createBarGraph(this.ob.timeList,this.ob.dataSet,this.ob.name+'/'+this.obY.name );
            this.loading=false;
        })
        }

   })
}
/*getReport(){
 this.ob.timeList=[];
    this.ob.valueSet=[];
     this.categoryService.getCategory(this.ob._id).then((data)=>{
         console.log ('graph data', data)
         this.temp=data;
         this.ob.options=[];
         this.ob.options=this.temp.options;
         this.ob.type=this.temp.type;
         this.ob.label=this.temp.label;
        // ob.dataViewerType=this.temp.dataViewerType;
         if (this.ob.options.length>0){
             for (let option of this.ob.options){
              
                this.ob.timeList.push(option.text);
                this.ob.valueSet.push(0);
                 
                  }
             }
    
 
    // this.timeList=this.ob.options;
   
     for (let patient of this.patients){
         this.dataService.getDatasByPatient(patient._id, this.ob._id).then((data)=> {
             this.temp=data;
          //   console.log('data', this.temp)
             if (this.temp.length>0){
            if (this.ob.options!=undefined&&this.ob.options.length>0){
                for (let option of this.ob.options){
                     for (let value of this.temp[0].values){
                         if (option.text===value){
                             let index=  this.ob.options.indexOf(option);
                             this.ob.valueSet[index]++;
                         }
                     }
                    
                }
            }
         }
        
       //  console.log (' ob.valueSet', ob.valueSet)
         var coloR = [];
            
         var dynamicColors = function() {
         var r = Math.floor(Math.random() * 255);
         var g = Math.floor(Math.random() * 255);
         var b = Math.floor(Math.random() * 255);
         return "rgb(" + r + "," + g + "," + b + ")";
     };
 
         for (var i in this.ob.valueSet) {
             coloR.push(dynamicColors());
         }
        if (this.ob.dataViewerType=='pie chart'){
          this.temp={
             data: this.ob.valueSet,
             label: this.ob.label.ch,
             backgroundColor: coloR,
             borderColor: coloR,
             fill: false
           };
        }
        else{
            this.temp={
                data: this.ob.valueSet,
                label: this.ob.label.ch,
                backgroundColor: dynamicColors(),
                borderColor: dynamicColors(),
                fill: false
              };
        }
 
        this.ob.dataSet=[];
        this.ob.dataSet.push(this.temp);
        if (this.patients.indexOf(patient)==this.patients.length-1){
            this.loading=false;
            var filter={
                profileID: this.profile._id,
                obSetID: this.obSet._id,
                obXID: this.ob._id,
                obYID: ""
            }
           this.reportService.getReportsByFilter(filter).then((data)=>{
                this.temp=data;
                if (this.temp.length==0){
                      this.reportService.Create({
                            profileID: this.profile._id,
                            obSetID: this.obSet._id,
                            obXID: this.ob._id,
                            obYID: "",
                            timeList: this.ob.timeList,
                            dataSet: this.ob.dataSet
                        }).then((data)=>{
                            console.log ('new report created', data);
                        
                })
            }
            else{
                this.reportService.Update({
                    _id:this.temp[this.temp.length-1]._id,
                    profileID: this.profile._id,
                    obSetID: this.obSet._id,
                    obXID: this.ob._id,
                    obYID: "",
                    timeList: this.ob.timeList,
                    dataSet: this.ob.dataSet
                }).then((data)=>{
                    console.log ('new report created', data);
                })
            }
            
            })

         setTimeout(() => {
                    if (this.ob.dataViewerType=='line chart')
                    this.createLineChart(this.ob.timeList,this.ob.dataSet,this.ob.name )
                    else if (this.ob.dataViewerType=='bar chart')
                    this.createBarGraph(this.ob.timeList,this.ob.dataSet,this.ob.name )
                    else if (this.ob.dataViewerType=='pie chart'){
                        this.createDoughnutGraph( this.ob.timeList,this.ob.dataSet,this.ob.name)
                    }
                    
                },3000);           
 }
     })
     }
 })
}*/

getSummary(obSet:any){
   
    
        obSet.dataSet=[];
        obSet.timeList=[];
        console.log ('obSet', obSet)
     this.allServices.categoryService.getSummary(
            {patientID: this.selectedPatient._id,
            obSetID:obSet._id, 
            limit: this.limit}).then((data)=>{

                    this.temp=data;
                console.log ('data', this.temp)

           if (this.temp.length>0)
            obSet.obs=this.temp[0].obs;
          
        
       
        for (let ob of obSet.obs){
            if (!ob.valueSet)
                ob.valueSet=[];
            if (!ob.valuesSet)
                ob.valuesSet=[];
                if (this.profile&&this.profile.profileUrl&&ob.devices&&ob.devices.length>0){
                   //  console.log ('selectedPatient', this.selectedPatient);
                   this.allServices.deviceService.getUserDataByDevice(this.profile.profileUrl.deviceUrl,
                        this.selectedPatient.deviceUserID,
                         ob.devices).then((data)=>{
                            this.temp=data;
                         
                            console.log ('device data', this.temp.data);
                            ob.valueSet=[];
                            for (let item of this.temp.data){
                                if (this.temp.data.indexOf(item)<=10){
                                    var numbers=[];
                                    numbers=item.deviceValue.split(';')
                                    console.log ('numbers', numbers)
                                   ob.valueSet.push(Number(numbers[ob.devices[0].location]));
                                   ob.timeSet.push(item.time);
                                }
                            }
                            console.log (' ob.valueSet',  ob.valueSet)
                            this.makeGraph(ob, obSet);      
                         })
                                 
                       
                 }
             
             
           else {
            this.makeGraph(ob, obSet);
           }
            

    }
      

      //  console.log ('obSet.dataSet',obSet.dataSet)
    });

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
        if (ob.type!='list'){
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
        }
        else{
            temp={
                data: ob.valueSet,
                datas:ob.valuesSet,
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
        // console.log ('this.obSet.dataSet',this.obSet.dataSet)
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
        }
       

        this.loading=false;
        if (this.dataViewerType=='line chart'){
        //     console.log ('this.temp',this.temp)
        if (!this.obSet.label){
            this.obSet.label={ch:this.obSet.name, en:this.obSet.name}
        }
            this.createLineChart(this.obSet.timeList,this.obSet.dataSet,this.obSet.label.ch )
        }
        else if (this.dataViewerType=='bar chart')
            this.createBarGraph(this.obSet.timeList,this.obSet.dataSet,this.obSet.label.ch )

}
findLevel(indexX:any, indexY:any){

//console.log ('result',this.obSet.dataSet[indexX].alertLevelSet[indexY])
   return this.obSet.dataSet[indexX].alertLevelSet[indexY];

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
      
      options: {
        tooltips:{enabled:false},
        legend: { display: true,
           labels: {
              fontSize: 8
           } },
        title: {
          display: true,
       text: text
        },
       // responsive: false
       
      }
  });
  }

  createLineChart(labels:any,dataSet:any,text:any){

 
    //console.log ('obSet.dataSet',this.obSet.dataSet)
   var myChart=new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
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
      responsive: false
        
    }
    });
    myChart.update()
  }

  createDoughnutGraph(labels:any,dataSet:any,text:any) {
   
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



