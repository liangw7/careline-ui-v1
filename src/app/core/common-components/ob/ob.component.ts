import {
  Component, OnInit, OnChanges, Inject, ElementRef,
  ViewChild, Input, AfterViewInit, Output, EventEmitter
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
//import { MessageBoxComponent } from '../message-box/message-box.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../common-services';
import { ApiUrl } from '../../models/api-url';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ob',
  templateUrl: './ob.component.html',
  styleUrls: ['./ob.component.scss'],
  animations: [
    trigger('visibilityChanged',
      [
        state('left', style({ transform: 'translateY(1000px)' })),
        state('center', style({ transform: 'translateY(0px)' })),
        state('right', style({ transform: 'translateY(-1000px)' })),
        transition('left => center', animate('500ms ease-in-out')),
        transition('center => right', animate('500ms ease-in-out')),
        transition('right => left', animate('500ms ease-in-out')),
      ])
  ]

})
export class ObComponent implements OnInit, OnChanges, AfterViewInit {
  id: any;
  obTemp: any;
  @Input() ob: any;
  @Input() noTitle: any;
  @Input() obSet: any;
  @Input() form: any;
  @Input() forms: any;
  obSets: any;
  @Input() emBed: any;
  indexAll: any;
  @Input() visit: any;
  patient: any;
  temp: any;
  temp1: any;
  source: any;
  callIndex: any;
  url: any;
  followup: any;
  visitId: any;
  followupId: any;
  patientId: any;
  imageCode: any;
  dataSource: any;
  initOb: any;
  values: any;
  value: any;
  registryUser: any;
  visitDate: any;
  procedureDate: any;
  language: any;
  @Input() bigScreen: any;
  order: any;
  filter: any;
  currentState = 'left';
  myCheck: any;
  profile: any;
  selectEducation: any;
  selectDoctor: any;
  provider: any;
  color: any;
  loading: any;
  uploadFilter: any;
  user: any;
  viewOnly: any;
  fromFormula: any;
  @Input() currentOb: any;
  age: any;
  @Output() messageEvent = new EventEmitter<String>();
  @Output() obEvent = new EventEmitter<String>();
  @ViewChild('fileInput') myFileInput: any;
  @ViewChild('stringInput', { read: ElementRef })
  stringInput!: ElementRef;
  @ViewChild('textInput', { read: ElementRef })
  textInput!: ElementRef;
  @ViewChild('emailInput', { read: ElementRef })
  emailInput!: ElementRef;
  @ViewChild('passwordInput', { read: ElementRef })
  passwordInput!: ElementRef;
  @ViewChild('numberInput', { read: ElementRef })
  numberInput!: ElementRef;
  @ViewChild('dateInput', { read: ElementRef })
  dateInput!: ElementRef;
  @ViewChild('lineCanvas') lineCanvas: any;

  public uploader: FileUploader = new FileUploader({ url: this.apiUrl.setFormUpload, itemAlias: 'photo' });
  constructor(
    private allService: AllServices,
    private apiUrl: ApiUrl,
    private dialog: MatDialog,
    public sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ObComponent>,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(SESSION_STORAGE) private storage: StorageService,
  ) {
    this.bigScreen = this.storage.get('bigScreen');
    this.user = this.storage.get('user');
    this.color = this.storage.get('color')
    this.selectEducation = true;
    if (data) {
      this.dataSource = true;

      if (data && data.ob) {
        this.ob = data.ob;

      }
      if (this.ob) {
        this.ob.showChart = false;
        this.initOb = this.ob;
      }
      if (data && data.profile)
        this.profile = data.profile
      if (data && data.viewOnly)
        this.viewOnly = data.viewOnly;
      // console.log ('this.viewOnly ================', this.viewOnly)
      //console.log ('this.user ================', this.user)
      //this.value=this.ob.value;
      //this.values=this.ob.values;
      //console.log ('ob', this.initOb)
      if (data && data.obSet)
        this.obSet = data.obSet;
      //  console.log ('this.obSet',this.obSet)
      if (data && data.obSets)
        this.obSets = data.obSets;
      if (data && data.visitDate)
        this.visitDate = data.visitDate;
      if (data && data.procedure)
        this.procedureDate = data.procedureDate;
      if (data && data.visit)
        this.visit = data.visit;
      if (data && data.order)
        this.order = data.order;
      if (data && data.form)
        this.form = data.form;
      if (this.visit)
        this.visitId = this.visit._id;

      if (data && data.followup)
        this.followup = data.followup;
      if (this.followup)
        this.followupId = this.followup._id;

      if (data && data.patient)
        this.patient = data.patient;

      if (this.patient)
        this.patientId = this.patient._id;
      if (data && data.registryUser)
        this.registryUser = data.registryUser;
      if (data && data.language)
        this.language = data.language;
      if (data && data.bigScreen)
        this.bigScreen = data.bigScreen
      // console.log ('this.bigScreen',this.bigScreen);
    }

    this.myCheck = true;
    this.provider = this.storage.get('provider')
  }

  getMappingValue() {

    if (!this.ob.value||(!this.ob.values||this.ob.values&&this.ob.values.length==0)) {
      if (this.ob.type == 'mapping lab' && this.ob.mappingLab) {
        console.log ('got lab', this.ob.value)
        this.getMappingLabValue()
      }
      else if (this.ob.type == 'mapping ob' && this.ob.mappingOb) {
        this.getMappingObValue()
      }
      else if (this.ob.type == 'number' && this.ob.devices && this.ob.devices.length > 0) {
        //   console.log('got device ob ',this.ob)
        this.getMappingDeviceValue()
      }
    }
  }

  getMappingLabValue() {
    if (!this.visit.visitDate){
      this.visit.visitDate=this.visit.createdAt;
    }
    var date = new Date(this.visit.visitDate);
    //date=date.getTime() / (1000 * 3600 * 24) +this.ob.mappingLab.searchDays;
    var compareDate_1 = new Date(date.getTime()
      - 1000 * 3600 * 24 * this.ob.mappingLab.visitFrameDays
      - 1000 * 3600 * 24 * this.ob.mappingLab.searchDays);
    var compareDate_2 = new Date(date.getTime()
      - 1000 * 3600 * 24 * this.ob.mappingLab.visitFrameDays
      + 1000 * 3600 * 24 * this.ob.mappingLab.searchDays);
    // console.log ('compare visit date from',compareDate_1 )
    // console.log ('compare visit date to',compareDate_2 )
    if (this.ob.index == 1) {
      console.log('mapping lab ob=========', this.ob.mappingLab)
      console.log('this.filter', this.filter)
    }
    this.allService.labsService.getByFilter({
      patientID: this.patient._id,
      labItemID: this.ob.mappingLab._id,
      resultAt: { "$gte": compareDate_1, "$lte": compareDate_2 }


      //  createdAt : {"$and":[{"$gte" : compareDate_1},{"$lte" : compareDate_2}]  }
    }).then((data: any) => {
      this.temp = data;
      console.log('lab values', this.ob.label.ch, this.temp)
      //get lab result
      if (this.temp.length > 0) {
       // if (!this.ob.value||this.ob.value!=this.temp[0].value){
          this.ob.value = this.temp[0].value;
          this.getChange(this.ob);
          this.setValueForNumber(this.ob.value);
       // }
       
      }else{
        this.ob.value = '';
      }

    })

  }


  getMappingObValue() {
    // console.log ('mapping ob===============', this.ob.mappingOb)
    if (this.ob.context == 'patient') {
      this.filter = {
        patientID: this.patient._id,
        obID: this.ob.mappingOb._id
      };
    }
    else {
      var date = new Date(this.visit.visitDate);
      //date=date.getTime() / (1000 * 3600 * 24) +this.ob.mappingLab.searchDays;
      var compareDate_1 = new Date(date.getTime()
        - 1000 * 3600 * 24 * this.ob.mappingOb.visitFrameDays
        - 1000 * 3600 * 24 * this.ob.mappingOb.searchDays);
      var compareDate_2 = new Date(date.getTime()
        - 1000 * 3600 * 24 * this.ob.mappingOb.visitFrameDays
        + 1000 * 3600 * 24 * this.ob.mappingOb.searchDays);
      this.filter = {
        patientID: this.patient._id,
        obID: this.ob.mappingOb._id,
        visitID: this.visit._id,
        createdAt: { "$gte": compareDate_1, "$lte": compareDate_2 }
      }

    }
    this.allService.datasService.getDatasByFilter2(this.filter).then((data: any) => {
      console.log('filter', this.filter);
      console.log('data', data);
      this.temp = data;
      if (this.temp.length > 0) {
        if (this.ob.mappingOb.type == 'number') {
          if (!this.ob.value||this.ob.value!=this.temp[0].value){
            this.ob.value = this.temp[0].value;
            this.setValueForNumber(this.ob.value);
            this.getChange(this.ob);
          }
         

        } else {
          if (!this.ob.values){
            this.ob.values = []
            this.ob.values = this.temp[0].values;
            this.getChange(this.ob);
          }
        
         
          
        }
      }
    })
  }


  getMappingDeviceValue() {
    var filter = {
      profileUrl: this.ob.devices[0].url,
      unid: this.patient.deviceUserID,
      limit: 1,
      _id: this.ob._id,
      list: 'yes',
      code: this.ob.devices[0].location,
      fields: `${this.ob.devices[0].ID} as Value`
    }

    //    console.log ('selectedPatient', this.selectedPatient);
    //  this.allService.deviceService.getUserDataByDevice(this.profile.profileUrl.deviceUrl, this.selectedPatient.deviceUserID,ob.devices).then((data)=>{
    this.allService.deviceService.getAxiData(filter).then((data: any) => {
      // console.log ('data', data)
      this.temp = data;
      if (this.temp) {
        // console.log ('device value===========', this.temp)
        if (this.temp.data && this.temp.data.length > 0) {
          if (!this.ob.value||this.ob.value!=Number(this.temp.data[0].Value)){
            this.ob.value = Number(this.temp.data[0].Value);
            this.getChange(this.ob);
            this.setValueForNumber(this.ob.value);
          }
         
        }

      }
    })
  }


  evaluateNumber(event: any) {
    // alert('event.target.value'+event.target.value)
    //  if (this.user||!this.viewOnly){
    //alert('value= '+event.target.value)
    this.getChange(this.ob);
    if (event.target.value) {
      this.setValueForNumber(event.target.value)
    } else {

      if (this.ob.values) {
        console.log('ob.values=====', this.ob.values)
        this.removeForm(this.ob.values[0])
      }
      this.ob.values = [];
      //  this.saveAfterClose(this.ob, this.obSet,this.form);
    }
    // console.log ('ob number', this.ob)
  }

  setValueForNumber(value: any) {
    if (!this.viewOnly) {
      if (this.ob.options) {
        console.log('event.target.value', value)
        for (let option of this.ob.options) {
          if (value >= option.from && value < option.to) {
            // alert('got option')
            this.ob.singleSelection = 'true';
            this.fromFormula = true;
            this.getValue(option, this.ob);
          }
        }
      }
    }
  }


  evalNumber() {
    if (this.ob.type == 'number' || this.ob.type == 'mapping lab') {
      // alert('event.target.value'+event.target.value)
      if (this.ob.options) {
        for (let option of this.ob.options) {
          if (this.ob.value >= option.from && this.ob.value < option.to) {

            //this.ob.values=[option];
            //  console.log ('mapping lab option', option)
            this.getValue(option, this.ob)
            //this.addCalculation(this.obSet)
          }
        }
      }
    }
    // console.log ('ob number', this.ob)
  }

  ngAfterViewInit() {
    //   this.changeState();
  }


  ngOnInit() {
    this.setUp();
  }


  ngOnChanges() {
    this.setUp();

  }


  setUp() {
    // console.log ('this.ob',this.ob);
    //console.log ('this.ob.values',this.ob.values);
    this.ob.changed = false;
    // this.bigScreen = this.storage.get('bigScreen')
    this.reNameFile();
    this.uploadFile();
    if (this.ob.type == 'formula') {
      //  console.log ('got cal-1')
      setTimeout(() => { this.getFormulaValue(this.ob, this.obSet, this.form.obSets, this.visit) }, 0);
      this.getChange(this.ob);

    } else if (this.ob.type == 'image') {
      this.getFiles();
    } else if (this.ob.options) {

      for (let option of this.ob.options) {
        if (this.ob.values && this.ob.values.length > 0) {
          for (let value of this.ob.values) {
            //   console.log ('option-1', option.text)
            //   console.log ('value-1', value)
            if (value && option.text == value.text) {
              //     console.log ('option-2', option.text)
              option.selected = true;
            }
          }
        }
      }
    }
    if (this.obSet)
      this.indexAll = this.obSet.obs.indexOf(this.ob);
    this.adapter.setLocale('zh-cn');

    this.getMappingValue();

    setTimeout(() => {
      if (!this.emBed) {
        this.setFocus();
      }
      this.changeCenter();

    }, 100);
  }


  uploadImage() {
    // if (this.user){
    let fileLoad = this.myFileInput.nativeElement;
    fileLoad.click();
    // }
  }
  reNameFile(){
    if (!this.ob.value){
        this.uploader.onAfterAddingFile = (file) => { 
        if (this.ob.context=='image'){
              this.createImage(file);
        }
        else if (this.ob.context=='lab'){
          this.createLab(file);
        }
        else if (this.ob.context=='record'){
          this.createRecord(file);
        }
        else {
          this.createFileImage(file);
        }
      }
    }
    else if (this.ob.value){
      this.uploader.onAfterAddingFile = (file) => { 
      if (this.ob.context=='image'){
            this.updateImage(file);
      }
      else if (this.ob.context=='lab'){
        this.updateLab(file);
      }
      else if (this.ob.context=='record'){
        this.updateRecord(file);
      }
      else {
        this.updateFileImage(file);
      }
    }
  }
  }
  deleteImageFile(ob:any){
    if (ob.value){
      if (ob.context=='lab'){
        //delete from lab table
        this.loading=true;
        this.allService.labsService.delete(ob.value).then((data)=>{
          console.log ('delete'+ob.label.ch);
          ob.value=null;
          this.loading=false;
        })
      }
      else if (ob.context=='image'){
        //delete from lab table
        this.loading=true;
        this.allService.imagesService.delete(ob.value).then((data)=>{
          console.log ('delete'+ob.label.ch);
          ob.value=null;
          this.loading=false;
        })
      }
      else if (ob.context=='lab'){
        //delete from lab table
        this.loading=true;
        this.allService.labsService.delete(ob.value).then((data)=>{
          console.log ('delete'+ob.label.ch);
          ob.value=null;
          this.loading=false;
        })
      }
      else if (ob.context=='record'){
        //delete from lab table
        this.loading=true;
        this.allService.labsService.delete(ob.value).then((data)=>{
          console.log ('delete'+ob.label.ch);
          ob.value=null;
          this.loading=false;
        })
      }
      else{
        this.loading=true;
        this.allService.uploadService.delete(ob.value).then((data)=>{
          console.log ('delete'+ob.label.ch);
          ob.value=null;
          this.loading=false;
      })
    }
    this.getChange(ob);
  }
  

  }
  createImage(file:any){
    if (this.patient){
      this.uploadFilter={
        patientID:this.patient._id,
        obID:this.ob._id, 
        uploaded:'true'
      }
    }
    else if (!this.patient){
      this.uploadFilter={
       
        obID:this.ob._id,
        uploaded:'true'
      }
    }
    this.allService.imagesService.create(this.uploadFilter).then((data)=>{
      this.temp=data;
      file.file.name=this.temp._id+'.png';
      file.withCredentials = false; 
      this.imageCode=this.temp._id;
      this.url  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      this.uploader.uploadAll();

    })
  }
  updateImage(file:any){
    this.allService.imagesService.delete(this.ob.value).then((data)=>{
      if (this.patient){
        this.uploadFilter={
          patientID:this.patient._id,
          obID:this.ob._id, 
          uploaded:'true'
        }
      }
      else if (!this.patient){
        this.uploadFilter={
         
          obID:this.ob._id,
          uploaded:'true'
        }
      }
      this.allService.imagesService.create(this.uploadFilter).then((data)=>{
        this.temp=data;
        file.file.name=this.temp._id+'.png';
        file.withCredentials = false; 
        this.imageCode=this.temp._id;
        this.url  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
        this.uploader.uploadAll();
  
      })
    })
  }
  createRecord(file:any){
    if (this.patient){
      this.uploadFilter={
        patientID:this.patient._id,
        obID:this.ob._id, 
        uploaded:'true',
        about:'medical file'
      }
    }
    else if (!this.patient){
      this.uploadFilter={
       
        obID:this.ob._id,
        uploaded:'true',
        about:'medical file'
      }
    }
    this.allService.imagesService.create(this.uploadFilter).then((data)=>{
      this.temp=data;
      file.file.name=this.temp._id+'.png';
      file.withCredentials = false; 
      this.imageCode=this.temp._id;
      this.url  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      this.uploader.uploadAll();

    })
  }
  updateRecord(file:any){
    this.allService.imagesService.delete(this.ob.value).then((data)=>{
      if (this.patient){
        this.uploadFilter={
          patientID:this.patient._id,
          obID:this.ob._id, 
          uploaded:'true',
          about:'medical file'
        }
      }
      else if (!this.patient){
        this.uploadFilter={
         
          obID:this.ob._id,
          uploaded:'true',
          about:'medical file'
        }
      }
      this.allService.imagesService.create(this.uploadFile).then((data)=>{
        this.temp=data;
        file.file.name=this.temp._id+'.png';
        file.withCredentials = false; 
        this.imageCode=this.temp._id;
        this.url  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
        this.uploader.uploadAll();
  
      })
    })
  }
  createLab(file:any){
    if (this.patient){
      this.uploadFilter={
        patientID:this.patient._id,
        obID:this.ob._id, 
        uploaded:'true'
       
      }
    }
    else if (!this.patient){
      this.uploadFilter={
       
        obID:this.ob._id,
        uploaded:'true'
     
      }
    }
    this.allService.labsService.create(this.uploadFilter).then((data)=>{
      this.temp=data;
      file.file.name=this.temp._id+'.png';
      file.withCredentials = false; 
      this.imageCode=this.temp._id;
      this.url  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      this.uploader.uploadAll();

    })
  }
  updateLab(file:any){
    this.allService.labsService.delete(this.ob.value).then((data)=>{
      if (this.patient){
        this.uploadFilter={
          patientID:this.patient._id,
          obID:this.ob._id, 
          uploaded:'true'
         
        }
      }
      else if (!this.patient){
        this.uploadFilter={
         
          obID:this.ob._id,
          uploaded:'true'
       
        }
      }
      this.allService.labsService.create(this.uploadFilter).then((data)=>{
        this.temp=data;
        file.file.name=this.temp._id+'.png';
        file.withCredentials = false; 
        this.imageCode=this.temp._id;
        this.url  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
        this.uploader.uploadAll();
  
      })
    })
  }
  createFileImage(file:any){
    this.allService.uploadService.create({obID:this.ob._id}).then((data)=>{
      this.temp=data;
      file.file.name=this.temp._id+'.png';
      file.withCredentials = false; 
      this.imageCode=this.temp._id;
      this.url  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      this.uploader.uploadAll();

    })
  }
  updateFileImage(file:any){
    this.allService.uploadService.delete(this.ob.value).then((data)=>{
      this.allService.uploadService.create({obID:this.ob._id}).then((data)=>{
        this.temp=data;
        file.file.name=this.temp._id+'.png';
        file.withCredentials = false; 
        this.imageCode=this.temp._id;
        this.url  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
        this.uploader.uploadAll();
  
      })
    })
  }

  uploadFile(){
      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        console.log('ImageUpload:uploaded:', item, status, response);
     
        console.log ('photo',  response)
        alert('上传成功!');
        this.ob.value=String(this.imageCode);
       // this.saveAfterClose(this.ob, this.obSet,this.form);
  // this.dialogRef.close(this.ob);
    };
   
    }

  breakLines(str: any) {
    var temp = [];
    //temp=str.match(/\n/g);
    temp = str.split(/\n/g);
    // console.log('temp===========',temp)
    // temp=str.split('/n');
    return temp;
  }


  setFocus() {
    if (this.ob.type == 'string' && this.stringInput && this.bigScreen == 1)
      //setTimeout(() => this.stringInput.nativeElement.focus(), 0); 
      this.stringInput.nativeElement.focus()
    if (this.ob.type == 'number' && this.numberInput && this.bigScreen == 1) {
      //console.log ('this.numberInput',this.numberInput)
      this.numberInput.nativeElement.focus()
      // setTimeout(() => this.numberInput.nativeElement.focus(), 0); 
    }
    if (this.ob.type == 'text' && this.textInput && this.bigScreen == 1)
      this.textInput.nativeElement.focus()
    //setTimeout(() => this.textInput.nativeElement.focus(), 0); 
    if (this.ob.type == 'date' && this.dateInput)
      this.dateInput.nativeElement.focus()
    //setTimeout(() => this.dateInput.nativeElement.focus(), 0);  
    if (this.ob.type == 'email' && this.emailInput)
      this.emailInput.nativeElement.focus()
    //setTimeout(() => this.emailInput.nativeElement.focus(), 0); 
    if (this.ob.type == 'password' && this.passwordInput)
      this.passwordInput.nativeElement.focus()
    // setTimeout(() => this.passwordInput.nativeElement.focus(), 0);  

  }


  changeCenter() {
    //   alert('this.currentState---1'+this.currentState)

    //this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    if (this.currentState == 'left')
      this.currentState = 'center'
    //  alert('this.currentState---2'+this.currentState)
  }


  changeRight() {
    // alert('this.currentState---1'+this.currentState)
    //this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    if (this.currentState == 'center') {
      this.currentState = 'right';
      this.currentState = 'left';
    }
    //  alert('this.currentState---2'+this.currentState)
  }


  changeLeft() {
    // alert('this.currentState---1'+this.currentState)
    //this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    if (this.currentState == 'right') {
      this.currentState = 'left';
    }
    //  alert('this.currentState---2'+this.currentState)
  }



  showObChart() {
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      'message': this.ob.label.ch,
      'ob': this.ob,
      'show': 'growth-chart',
      'patient': this.patient,
      'color': 'blue'
    };
    // this.bigScreen = this.storage.get('bigScreen')
    // if (this.bigScreen==0){
    dialogConfig.maxWidth = '80vw',
      dialogConfig.maxHeight = '80vh',
      dialogConfig.height = '80%',
      dialogConfig.width = '80%'
    //}
    // dialogConfig.position={top: '5%', left:'60%'};
  //  const dialogRef = this.dialog.open(MessageBoxComponent,
  //    dialogConfig);

  }

  getFormulaValue(ob: any, obSet: any, obSets: any, visit: any) {
    // console.log ('ob.type', ob.type)

    if (ob.type == 'formula') {
      var formula = ob.formula;
      //resolve formula with value
      // alert('got here'+ob.formula)
      for (let obItem of obSet.obs) {
        // alert('got here'+obItem._id)
        if (ob.formula && ob.formula.indexOf(obItem._id) > -1) {
          // alert('got here-2')
          formula = formula.split(obItem._id).join(obItem.value);

          if (formula.indexOf('today') > -1 || formula.indexOf('visit') > -1) {
            var dateValue = obItem.value;
            dateValue = new Date(dateValue)
          } else if (formula.includes('growth')) {

            this.percentile(obItem).then((data) => {
              // console.log ('data', data)
              this.temp = data;
              this.temp = this.temp.split('%').join('');
              ob.value = Number(this.temp);
              this.getChange(ob);
              console.log('ob.value', ob.value)

              this.showObSet(ob, obSet, obSets);
              this.showOb(ob, obSet);
            });

          }
        }
      }

      // console.log ('formula-1', formula);
      var timeDiff: any;
      if (formula && (formula.indexOf('today') > -1 || formula.indexOf('visit') > -1)) {
        if (formula.indexOf('today') > -1 && this.ob.context != 'visit') {
          timeDiff = Math.abs(Date.now() - dateValue.getTime());
        }
        else if (formula.indexOf('visit') > -1 || (formula.indexOf('today') > -1 && this.ob.context == 'visit')) {
          if (this.visit) {
            var visitDate = new Date(this.visit.visitDate)
            timeDiff = Math.abs(visitDate.getTime() - dateValue.getTime());
          } else {
            timeDiff = Math.abs(Date.now() - dateValue.getTime());
          }
        }

        console.log('timeDiff', timeDiff)
        //in days
        ob.value = timeDiff / (1000 * 3600 * 24);
        this.getChange(ob);
        this.setValueForNumber(ob.value)

        console.log('age ob', ob.value)
        this.getAge(this.ob);
        this.showObSet(ob, obSet, obSets);
        this.showOb(ob, obSet);
      } else if (formula && !formula.includes('growth')) {
        console.log('formula-2', formula)
        if (formula) {
          ob.value = Math.floor(eval(formula));
          for (let option of ob.options) {
            if (ob.value >= option.from && ob.value < option.to) {
              ob.values = [];
              ob.values = [option];
              this.addCalculation(obSet);
            }
          }
        }
        //   console.log ('ob',ob)
        this.showObSet(ob, obSet, obSets);
        this.showOb(ob, obSet);
      }
      //alert('ob.value2'+ob.value)
    }
  }

  getAge(ob: any) {

    var value = ob.value / 365.25;
    var uom = '';
    if (value > 2) {
      value = Math.floor(value);
      uom = 'y'
    } else if (value <= 2) {

      value = value * 12;
      console.log('value', value)
      if (value > 1) {
        value = Math.floor(value);
        uom = 'm'
      } else {
        value = Math.floor(value * 30);
        uom = 'd'
      }
    }
    this.age = { number: value, uom: uom };
  }


  getEducation() {

    var obIDs = [];
    var educationObs = [];
    for (let ob of this.ob.desc.educationObs) {
      obIDs.push(ob._id)
    }
    this.allService.categoryService.getCategoriesByFilter({ _id: { '$in': obIDs } }).then((data: any) => {
      this.temp = data;
      educationObs = this.temp;
      const dialogConfig = new MatDialogConfig();

      // dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      dialogConfig.data = {
        'message': this.ob.label.ch,
        'educationObs': educationObs,
        'patient': this.patient,
        'color': 'blue'
      };
      // this.bigScreen = this.storage.get('bigScreen')
      // if (this.bigScreen==0){
      dialogConfig.maxWidth = '100vw',
        dialogConfig.maxHeight = '100vh',
        dialogConfig.height = '100%',
        dialogConfig.width = '100%'
      //}

      // dialogConfig.position={top: '5%', left:'60%'};

     // const dialogRef = this.dialog.open(MessageBoxComponent,
     //   dialogConfig);
      //  window.print();
    })
  }


  getLink() {
    window.open(this.ob.desc.hyperlink, this.ob.label.ch, "height=500,width=800");
  }


  findChart(ob: any) {

    var age = 0;
    if (this.patient.ageObj.uom == 'd' || this.patient.ageObj.uom == 'm') {
      age = 0;
    } else if (this.patient.ageObj.uom == 'y')
      age = this.patient.ageObj.number;
    if (this.patient.gender == '女') {
      var gender = 'female'
    } else {
      gender = 'male'
    }
    if (ob.desc.charts && ob.desc.charts.length == 1) {
      ob.chart = ob.desc.charts[0];
    } else if (ob.desc.charts && ob.desc.charts.length > 0) {
      for (let chart of ob.desc.charts) {
        if (chart.desc.gender == gender) {
          if (age >= chart.desc.startYear && age <= chart.desc.endYear) {
            if (this.patient.pregnancyWeeks && this.patient.pregnancyWeeks < 35 && chart.desc.term == 'premature') {
              ob.chart = chart;
            }
            else {
              ob.chart = chart
            }
          }
        }
      }
    }
  }

  percentile(ob: any) {
    return new Promise((resolve, reject) => {
      this.findChart(ob);
      if (ob.chart && !ob.chart.desc.xel) {
        this.allService.categoryService.getCategory(ob.chart._id).then((data: any) => {
          this.temp = data;
          this.loading = false;
          this.data = JSON.parse(this.temp.desc.data);
          console.log('data', this.data)
          // console.log ('this.data============', this.data)
          var dataObjList = []
          for (let timeItem of this.data.label) {
            dataObjList.push({ time: timeItem, data: null })
          }
          //  console.log ('dataObjList',dataObjList)

          var currentDate = new Date(this.visit.visitDate);
          var birthday = new Date(this.patient.birthday);
          var age = currentDate.getTime() - birthday.getTime();
          if (ob.chart.desc.uom == 'd')
            age = age / (1000 * 3600 * 24);
          else if (ob.chart.desc.uom == 'y')
            age = age / (1000 * 3600 * 24) / 365.25;
          else if (ob.chart.desc.uom == 'm')
            age = age / (1000 * 3600 * 24) / 365.25 * 12;
          console.log('age=====', age)

          for (let dataItem of dataObjList) {
            var index: any;
            var dif = age - Number(dataItem.time);
            //console.log ('dif',dif)
            if (dif <= 0.5 && dif >= 0) {
              dataItem.data = ob.value;
              index = dataObjList.indexOf(dataItem)
            } else if (dif < 0 && dif >= -0.5) {
              dataItem.data = ob.value;
              index = dataObjList.indexOf(dataItem)
            }


          }
          console.log('index', index)
          //var percentileList=[];
          console.log('this.data.set', this.data.set)
          for (let item of this.data.set) {
            item.dif = item.data[index] - ob.value;
            if (item.dif < 0)
              item.dif = -item.dif;
          }
          // console.log ('dataList',dataList)
          this.sortByIndex(this.data.set)
          // alert('value'+this.data.set[0].label)
          resolve(this.data.set[0].label);

        }, (err: any) => {
          reject(err);
        });
      } else if (ob.chart && ob.chart.desc.xel) {

        this.allService.categoryService.getCategory(ob.chart._id).then((data: any) => {
          this.temp = data;
          this.loading = false;
          this.data = JSON.parse(this.temp.desc.data);
          console.log('data', this.data)
          // console.log ('this.data============', this.data)
          var dataObjList: any[] = []
          for (let timeItem of this.data.label) {
            dataObjList.push({ time: timeItem, data: null })
          }

          this.allService.datasService.getDatasByFilter2({ obID: ob.chart.desc.xel, visitID: this.visit._id }).then((data: any) => {
            this.temp = data;
            if (this.temp.length > 0) {
              for (let dataItem of dataObjList) {
                var index: any;
                var dif = this.temp[0].value - Number(dataItem.time);
                //console.log ('dif',dif)
                if (dif <= 0.5 && dif >= 0) {
                  dataItem.data = ob.value;
                  index = dataObjList.indexOf(dataItem)
                } else if (dif < 0 && dif >= -0.5) {
                  dataItem.data = ob.value;
                  index = dataObjList.indexOf(dataItem)
                }
              }
              console.log('index', index)
              //var percentileList=[];
              console.log('this.data.set', this.data.set)
              for (let item of this.data.set) {
                item.dif = item.data[index] - ob.value;
                if (item.dif < 0)
                  item.dif = -item.dif;
              }
              this.sortByIndex(this.data.set)

              resolve(this.data.set[0].label);
            }
            // console.log ('dataList',dataList)

          }, (err: any) => {
            reject(err);
          })
        });
      }
    })
  }

  sortByIndex(list: any) {
    list.sort((a: any, b: any) => Number(a.dif) - Number(b.dif));
  }


  getUom(uom: any) {
    if (this.language == 'Chinese') {
      if (uom == 'y') {
        return '岁'
      }
      if (uom == 'm') {
        return '月'
      }
      if (uom == 'd') {
        return '天'
      }

      else return uom
    }
    else return uom
  }


  showObSet(ob: any, obSet: any, obSets: any) {

    //get ob values according to ob value
    for (let option of ob.options) {
      if (ob.value >= option.from && ob.value < option.to)
        ob.values = [option];
    }
    if (ob.values && ob.values.length > 0) {
      for (let item of ob.values[0].items) {
        for (let obSetItem of obSets) {
          obSetItem.show = false;
          for (let obItem of obSetItem.obs) {
            if (obItem._id != ob._id && obSetItem._id != obSet._id) {
              obItem.value = '';
              obItem.values = [];
            }
          }
          if (obSetItem._id == item._id) {
            obSetItem.show = true;
            obSet.show = true;
          }
        }
      }
    }

  }


  showOb(ob: any, obSet: any) {
    //get ob values according to ob value
    for (let option of ob.options) {
      if (ob.value >= option.from && ob.value < option.to)
        ob.values = [option];
    }
    if (ob.values && ob.values.length > 0) {
      for (let item of ob.values[0].items) {
        for (let obItem of obSet.obs) {

          if (obItem._id == item._id) {
            obItem.show = true;
          }
        }
      }
    }
  }

  checkValue(option: any, ob: any) {
    var found = false;
    if (ob.values && ob.values.length > 0) {
      for (let value of ob.values) {
        if (value && value.text == option.text) {
          found = true;
        }
      }
    }
    return found;
  }


  hasForm() {
    for (let value of this.ob.values) {
      if (value.forms) {
        for (let form of value.forms) {
          if (form.formType = 'education') {
            return true
          }
        }
      }
    }
    return false;
  }


  getFiles() {
    this.url = this.allService.utilService.getImageUrl(String(this.ob.value));
  }

  getImage() {
    return this.allService.utilService.getImageUrl(String(this.ob.image));
  }


  getHyperlink() {
    return this.allService.utilService.getUrl("https://www.google.com");
  }


  getImageValue() {
    return this.allService.utilService.getImageUrl(String(this.ob.value));
  }


  findRange(ob: any) {
    //ob.values=[];

    console.log('cal ob-2', ob)
    for (let option of ob.options) {

      option.selected = false;
      ob.value = Number(ob.value);
      option.from = Number(option.from);
      option.to = Number(option.to);

      if (ob.value >= option.from && ob.value < option.to) {
        console.log('cal ob', ob);
        this.getValue(option, ob)
      }
    }
  }


  //for manual enter number as data type
  findRangeValue(ob: any, value: any) {

    if (ob.values == undefined)
      ob.values = [];
    for (let option of ob.options) {

      if (option.selected == true) {
        option.selected = false;
        this.addCalculation(this.obSet)
        for (let value_item of ob.values) {
          if (value_item.text == option.text) {
            var index = ob.values.indexOf(value_item)
            ob.values.splice(index, 1);
            //  option.selected=false;
          }
        }
      }

      if (value >= option.from && value < option.to) {

        ob.values[0] = option;
        console.log('ob.values[0].number', ob.values[0].number)
        option.selected = true;
        //  ob.values.push(option);
        this.addCalculation(this.obSet);
      }
    }
  }


  geMappingObValue(ob: any, obSet: any) {

    for (let obItem of obSet.obs) {
      console.log('ok1', obItem)
      if (obItem.mappingOb && obItem.mappingOb._id == ob._id) {

        var vDate = new Date(this.visitDate);
        var pDate = new Date(this.procedureDate);

        var tiemDif = Math.abs(vDate.getTime() - pDate.getTime());
        tiemDif = tiemDif / (1000 * 3600 * 24);
        console.log('ok2 tiemDif', tiemDif)
        console.log('ok2 days', obItem.mappingOb.frameDays + obItem.mappingOb.searchDays)
        if (tiemDif <= obItem.mappingOb.frameDays + obItem.mappingOb.searchDays
          && tiemDif >= obItem.mappingOb.frameDays - obItem.mappingOb.searchDays) {
          console.log('ok3')
          obItem.value = ob.value;
          obItem.values = [];
          if (ob.values && ob.values.length > 0) {
            obItem.values = ob.values;
          } else {

            for (let option of obItem.options) {
              if (obItem.value >= option.form && obItem.value < option.to) {
                obItem.values = [option];
              }
            }
          }
        }
      }
    }
  }


  addCalculation(obSet: any) {
    var total = 0;
    for (let obItem of obSet.obs) {
      if (obItem.values && obItem.values.length > 0 && obItem.type != 'calculation') {
        for (let value of obItem.values) {
          //   console.log ('value in calculation',obItem.label.ch,value)
          if (value && value.number != undefined) {
            total = total + Number(value.number);
              console.log ('total',total)
          }
        }
      }
    }
    
    for (let obC of obSet.obs) {
      if (obC.type == 'calculation'){// && this.checkCalculationValue(obC, obSet)) {
        console.log ('obC',obC)
        obC.changed = true;
        obC.value = total;
        obSet.value = total;
        this.getChange(obC);
        for (let option of obC.options) {
          if (obC.value >= option.from && obC.value < option.to) {

            obC.values = [option];
            //  obC.values.push(option);
            console.log('obC.values', obC.values)
            obSet.values = [option];
            if (!obSet.value)
              obSet.values = [];
            obSet.values.push(option)
            if (option.items) {
              for (let item of option.items) {
                item.show = true;
              }
            }
          }
        }
      }
    }
  }

  checkCalculationValue(ob: any, obSet: any) {

    if (ob.calculationItems) {
      for (let item of ob.calculationItems) {
        for (let ob of obSet.obs) {
          if (ob.type != 'calculation' && item._id == ob._id) {
            if (!ob.values || ob.values.length == 0) {
             
              return false;
            }
          }
        }
      }
    }
  
    return true;
  }


  addForm(option: any) {
    var formIDs = []
    if (option.forms && option.forms.length > 0) {

      for (let formItem of option.forms) {
        formIDs.push(formItem._id)
      }
    }

    if (formIDs.length > 0) {
      this.loading = true;
      this.allService.categoryService.getFormById({ formIDs: formIDs }).then((data: any) => {

        this.temp = data;
        option.forms = [];
        option.forms = this.temp;
        this.loading = false;
        var index = this.form.obSets.length;
        for (let form of this.temp) {

          for (let obSet of form.obSets) {
            if (!this.allService.utilService.findItem(obSet, this.form.obSets))
              obSet.index = index;
            index++;
            this.form.obSets.push(obSet)
          }
          //  this.forms.push(form)
        }
        console.log('this.form================', this.form)
        this.messageEvent.emit('add form');
      })
    }
  }


  removeForm(option: any) {
    if (option) {
      if (option.forms && option.forms.length > 0) {

        for (let form of option.forms) {
          if (option.forms) {
            for (let obSet of form.obSets) {
              if (this.allService.utilService.findItem(obSet, this.form.obSets)) {
                var index = this.form.obSets.indexOf(obSet);
                this.form.obSets.splice(index, 1)
              }
            }
          }
        }
      }
    }
    console.log('after removed', this.forms)
  }


  addOption(option: any, ob: any, obSet: any, obSets: any) {
    this.getChange(ob)
    if (ob.values == undefined)
      ob.values = [];
    option.selected = true;

    ob.values.push(option);

    this.addCalculation(obSet);
    if (option.forms) {
      this.addForm(option);
    }
    // console.log ('add value',ob.values)

    if (option.items != undefined && option.items.length > 0) {
      for (let item of option.items) {
        //   console.log ('item', item.label.ch, item._id)
        for (let obSetItem of obSets) {
          if (obSetItem._id == item._id) {
            obSetItem.show = true;

          }
        }
        for (let obItem of obSet.obs) {
          // console.log ('obItem.label-1', obItem.label.ch, obItem._id)
          if (obItem._id == item._id) {
            obItem.show = true;
            // console.log ('obItem.label-2', obItem.label.ch)
          }
        }
      }
    }
  }


  removeOption(option: any, ob: any, obSet: any, obSets: any) {
    this.getChange(ob);
    option.selected = false;
    // ob.value=null;
    // this.removeAfterClose(ob, obSet)
    if (option.forms) {
      this.removeForm(option);
    }
    // if (ob.values==undefined)
    ob.values = [];
    //this is to remove value from values if option is selected
    for (let option of ob.options) {
      if (option.selected) {
        ob.values.push(option)
      }
    }
    this.addCalculation(obSet);
    //console.log ('option-rmove',option)
    if (option.items != undefined && option.items.length > 0) {
      //  console.log ('removed-option here')
      for (let item of option.items) {
        //obset
        for (let obSet_2 of obSets) {
          if (obSet_2._id == item._id) {
            if (obSet_2.showTime == undefined)
              obSet_2.showTime = 0;
            if (obSet_2.showTime > 0)
              obSet_2.showTime--;
            console.log('showTime', obSet_2.showTime)
            if (obSet_2.showTime == 0) {
              obSet_2.show = false;
              for (let ob_2 of obSet_2.obs) {
                ob_2.value = '';
                if (ob_2.options != undefined) {
                  if (ob_2.options.length > 0) {
                    //remove each of the options
                    for (let option_2 of ob_2.options) {
                      if (ob_2.values && ob_2.values.length > 0) {
                        for (let value of ob_2.values) {
                          if (value.text == option_2.text) {
                            this.removeOption(option_2, ob_2, obSet_2, obSets);
                            if (option_2.forms) {
                              this.removeForm(option_2)
                            }
                            console.log('remove ob_2', ob_2);
                            // this.saveAfterClose(ob_2, this.obSet,this.form);
                          }
                        }
                      }
                    }
                  }
                }
                //    ob_2.values=[];
              }
            }
          }
        }
        //ob
        for (let ob_3 of obSet.obs) {
          if (ob_3._id == item._id) {
            console.log('item to be removed', ob_3)
            //   ob_3.showTime--;
            if (!this.checkCondition(ob_3, obSet)) {
              console.log('ob_3', ob_3)
              // ob_3.addsIn=true;
              ob_3.value = null;
              // ob_3.values=[];
              if (ob_3.options != undefined) {
                if (ob_3.options.length > 0) {

                  for (let option_3 of ob_3.options) {

                    if (ob_3.values && ob_3.values.length > 0) {
                      for (let value of ob_3.values) {
                        if (value.text == option_3.text) {
                          this.removeOption(option_3, ob_3, obSet, obSets);
                          if (option_3.forms) {
                            this.removeForm(option_3)
                          }
                          // this.saveAfterClose(ob_3, this.obSet,this.form);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  checkCondition(ob: any, obSet: any) {

    for (let obItem of obSet.obs) {
      if (obItem.values != undefined && obItem.values.length > 0) {

        for (let value of obItem.values) {
          if (value) {
            if (value.items != undefined && value.items.length > 0) {
              for (let item of value.items) {
                if (ob._id == item._id) {
                  ob.show = true;
                  return true;
                }
              }
            }
          }
        }
      }
    }
    console.log('ob condition', ob)
    ob.show = false;
    return false;
  }

  getValue(option: any, ob: any) {
    if (ob.type == 'list' || this.fromFormula) {
      //   console.log ('option.text',option.text);
      //   console.log ('option.selected',option.selected);
      //   console.log ('ob.singleSelection',ob.singleSelection);
      //   console.log ('ob.mappingOb',ob.mappingOb)
      ob.changed = true;
      if (this.user || !this.viewOnly) {
        if ((ob.mappingOb && ob.mappingOb.type == 'number')
          || (ob.type == 'mapping lab')) {
          ob.singleSelection = 'true'
        }
        if (ob.singleSelection !== 'true' && !option.main) {
          console.log('ok-multiple')
          if (option.selected == true)
            this.removeOption(option, ob, this.obSet, this.form.obSets);
          else {

            this.addOption(option, ob, this.obSet, this.form.obSets)
            for (let optionItem of ob.options) {
              //remove main option
              if (optionItem.main) {
                this.removeOption(optionItem, ob, this.obSet, this.form.obSets);
              }
            }
          }
          this.indexAll = this.obSet.obs.indexOf(ob);

        } else {//single 

          if (ob.values) {
            for (let value_item of ob.values) {
              if (value_item && option.text == value_item.text) {
                option.selected = true;

              }
            }
          }

          if (option.selected == true) {

            //option is selected remove the existing option for hand click only
            if (ob.type != 'number'
              && ob.type != 'mapping lab'
              && ob.type != 'calculation'
              && ob.type != 'formula'
              && (ob.type != 'mapping ob')) {
              //  alert('got remove')
              this.removeOption(option, ob, this.obSet, this.obSets);
            } else {
              this.addForm(this.obSet);
              if (ob.values == undefined)
                ob.values = [];

              console.log('values', ob.label.ch, ob.values)
              for (let value_item of ob.values) {
                for (let option_item of ob.options) {
                  if (value_item && option_item.text == value_item.text) {
                    this.removeOption(option_item, ob, this.obSet, this.form.obSets);
                  }
                }
              }

              this.addOption(option, ob, this.obSet, this.form.obSets);
            }
          } 
          else {//option is not selected
            if (ob.values == undefined)
              ob.values = [];

            console.log('values', ob.label.ch, ob.values)
            for (let value_item of ob.values) {
              for (let option_item of ob.options) {
                if (value_item && option_item.text == value_item.text) {
                  this.removeOption(option_item, ob, this.obSet, this.form.obSets);
                }
              }
            }

            this.addOption(option, ob, this.obSet, this.form.obSets);
           
          }
          this.indexAll = ob.index;
          // alert('ob'+ob.label.ch)
          setTimeout(() => {

            this.messageEvent.emit(ob.index + 1);
            

          }, 300);
        }
      }
    }
  }


  getChange(ob: any) {
    // alert('ob.label.ch'+this.currentOb)
    ob.changed = true;

    if (!this.obSet.changeObs)
      this.obSet.changeObs = [];
    this.obSet.changeObs.push(ob._id);

    console.log()
    //this.messageEvent.emit(this.currentOb+200);
    this.messageEvent.emit(this.ob.index + 200);
  }

  findOption(options: any, textValue: any) {

    for (let itemOption of options) {
      itemOption.selected = false;
      if (itemOption.text === textValue) {
        itemOption.selected = true;
        //return itemOption;
      }
    }
  }


  close() {
    if (this.ob.type == 'calculation')
      this.dialogRef.close(this.ob);
    else {
      this.dialogRef.close();
    }
  }


  cancel() {
    this.dialogRef.close();
  }


  receiveMessage($event: any) {
    this.allService.alertDialogService.alert($event);
    if ($event == 'choose provider') {
      this.saveAfterClose(this.ob, this.obSet, this.form);
      this.cancel();
    }
  }


  save() {

    this.evalNumber();
    if ((this.value != this.ob.value) || (this.values && this.ob.values && this.values.length != this.ob.values.length) || (!this.values && this.ob.values))
      //this.ob.changed=true;
      this.getChange(this.ob);
    this.saveAfterClose(this.ob, this.obSet, this.form);

    this.dialogRef.close();
  }

  next() {
    // this.currentState='initial';
    this.myCheck = false;
    this.indexAll++;
    console.log('this.indexAll', this.indexAll)
    // this.changeState();//console.log ('ok1',this.indexAll)
    //this.saveAfterClose(this.ob, this.obSet,this.form);
    if (this.indexAll < this.obSet.obs.length) {
      // console.log ('this.obSet.obs[this.indexAll].show',this.obSet.obs[this.indexAll].show)

      if (this.obSet.obs[this.indexAll].show == true || !this.obSet.obs[this.indexAll].addsIn) {

        // this.currentState='initial';

        this.ob = this.obSet.obs[this.indexAll];
        //this.createLineChart();
        console.log('got here1', this.ob)


        //this.changeState();
        this.myCheck = true;
        this.getFormulaValue(this.ob, this.obSet, this.obSets, this.visit)
        this.setFocus();
      } else {//pass no shown ob within the same obset,

        //  this.saveAfterClose(this.obSet.obs[this.indexAll], this.obSet,this.form);
        this.next();

      }
    } else if (this.indexAll == this.obSet.obs.length
      && this.form && this.form.obSets.indexOf(this.obSet) < this.form.obSets.length - 1) {

      this.obSet = this.form.obSets[this.form.obSets.indexOf(this.obSet) + 1]

      if (this.obSet.show == true || !this.obSet.addsIn) {
        this.indexAll = 0
        // this.currentState='initial';

        this.ob = this.obSet.obs[this.indexAll];
        // this.createLineChart();
        //  this.changeState();
        this.myCheck = true;
        this.getFormulaValue(this.ob, this.obSet, this.obSets, this.visit)
        this.setFocus();

      } else {//pass the whole obset which is not shown
        this.indexAll = this.obSet.obs.length - 1;
        //save the ob value within this obset
        for (let item of this.obSet.obs) {
          if (item.value || item.values) {

            this.saveAfterClose(item, this.obSet, this.form)
          }
        }
        this.next();

      }
    } else if (this.indexAll == this.obSet.obs.length
      && this.form && this.form.obSets.indexOf(this.obSet) == this.form.obSets.length - 1) {
      this.dialogRef.close(this.ob);
    } else {
      this.dialogRef.close(this.ob);
    }
  }


  saveObData(ob: any) {
    console.log('save ob', ob)
    console.log('patient', this.patient)
    console.log('visit', this.visit)
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      ob.valueList = ob.values

    }

    let params: any = {
      patientID: this.patient._id,
      patientEmail: this.patient.email,
      obID: ob._id,
      obName: ob.name,
      obType: ob.type,
      value: ob.value,
      values: ob.valueList
    }
    if (ob.context == 'patient' && this.patient) {
      this.loading = true;
      this.allService.datasService.getDatasByPatient(this.patient._id, ob._id).then((obData: any) => {
        this.temp = obData;
        //  console.log ('patient obData',obData);
        if (this.temp.length > 0) {
          ob.dataID = this.temp[0]._id;
          params._id = ob.dataID;
          this.allService.datasService.update(params).then((data: any) => {
            this.loading = false;
            console.log('update patient data', data);
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allService.datasService.create(params).then((data: any) => {
            this.loading = false;
            console.log('create patient data', data);
          });
        } else {
          this.loading = false;

        }
      });
    } else if (ob.context != 'patient' && this.patient) {
      this.loading = true;
      this.allService.datasService.getDatasByFilter2(
        { visitID: this.visit._id, obID: ob._id, patientID: this.patient._id }).then((obData: any) => {
          this.temp = obData;
          console.log('obdata', this.temp)
          params.visitID = this.visit._id;
          params.visitDate = this.visit.visitDate;
          if (this.temp.length == 1) {

            ob.dataID = this.temp[0]._id;
            params._id = ob.dataID;
            this.allService.datasService.update(params).then((data: any) => {
              console.log('updated visit data', data);
              this.loading = false;
            });
          } else if (this.temp.length == 0) {
            this.allService.datasService.create(params).then((data: any) => {
              console.log('create visit data', data);
              this.loading = false;
            });
          } else if (this.temp.length > 1) { //correct the mistake that a data is inserted more than once
            for (let item of this.temp) {
              this.allService.datasService.delete(item._id);
            }
            this.allService.datasService.create(params).then((data: any) => {
              console.log('create visit data', data);
              this.loading = false;
            });
          }
        });
    }
  }

  saveOrderObData(ob: any, order: any) {
    ob.valueList = [];
    if (ob.values && ob.values.length > 0) {
      ob.valueList = ob.values

    }
    this.loading = true;
    this.allService.datasService.getDatasByFilter2({
      patientID: this.patient._id,
      orderID: order._id,
      obID: ob._id
    }).then((obData: any) => {
      this.temp = obData;
      let params: any = {
        orderID: order._id,
        patientID: this.patient._id,
        patientEmail: this.patient.email,
        visitID: this.visit._id,
        obID: ob._id,
        obName: ob.name,
        obType: ob.type,
        value: ob.value,
        values: ob.valueList
      }
      if (this.temp.length > 0) {

        ob.dataID = this.temp[0]._id;
        params._id = ob.dataID;
        this.allService.datasService.update(params).then((data: any) => {
          console.log('updated data', data);
          this.loading = false;
        });
      } else if ((ob.values && ob.values.length > 0) || ob.value) {
        this.allService.datasService.create(params).then((data: any) => {
          console.log('created data', data);
          this.loading = false;
        });
      }
    });
  }


  saveProblemObData(ob: any, obSet: any) {
    ob.valueList = [];
    if (ob.values) {
      ob.valueList = ob.values

    }
    this.loading = true;
    this.allService.datasService.getDatasByFilter2
      ({ patientID: this.patient._id, problemItemID: obSet._id, obID: ob._id, familyMember: 'self' }).then((obData: any) => {
        this.temp = obData;
        console.log('obData', obData);
        let params: any = {
          patientID: this.patient._id,
          problemItemID: obSet._id,
          familyMember: 'self',
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        };
        if (this.temp.length > 0) {

          ob.dataID = this.temp[0]._id;
          params._id = ob.dataID;
          this.allService.datasService.update(params).then((data: any) => {
            console.log('updated data', data);
            this.loading = false;
          });
        } else if ((ob.values && ob.values.length > 0) || ob.value) {
          this.allService.datasService.create(params).then((data: any) => {
            console.log('created data', data);
            this.loading = false;
          });
        }
      });
  }


  saveMedicationObData(ob: any, obSet: any) {
    console.log('save meds data')
    ob.valueList = [];
    if (ob.values) {
      ob.valueList = ob.values
    }

    // problemID is equvelant to problemItemID
    this.loading = true;
    this.allService.datasService.getDatasByFilter2
      ({
        patientID: this.patient._id,
        medicationItemID: obSet._id,
        obID: ob._id
      }).then((obData: any) => {
        this.temp = obData;
        console.log('obData', obData);
        let params: any = {
          patientID: this.patient._id,
          medicationItemID: obSet._id,
          obID: ob._id,
          obName: ob.name,
          obType: ob.type,
          value: ob.value,
          values: ob.valueList
        };
        if (this.temp.length > 0) {
          ob.dataID = this.temp[0]._id;
          params._id = ob.dataID;
          this.allService.datasService.update(params).then((data: any) => {
            console.log('updated med data', data);
            this.loading = false;
          });
        } else if (this.temp.length == 0 && ((ob.values && ob.values.length > 0) || ob.value)) {
          this.allService.datasService.create(params).then((data: any) => {
            console.log('created meds data', data);
            this.loading = false;
          });
        }
      });
  }


  saveAfterClose(ob: any, obSet: any, form: any) {

    if (this.user) {

      if (this.patient && ((form && form.formType != 'user') || !form)) {
        var valueList = [];
        if (ob.values) {
          for (let value of ob.values) {
            if (value) {
              valueList.push({ text: value.text, comments: value.comments, form: value.form, to: value.to })
            }
          }

        }
        ob.valueList = valueList;
        //save data
        if (obSet.field == 'problem') {
          this.saveProblemObData(ob, obSet)
        } else if (obSet.field == 'medication') {
          this.saveMedicationObData(ob, obSet)
        } else if (form && form.formType == 'order info') {
          this.saveOrderObData(ob, this.order)
        } else {
          this.saveObData(ob)
          console.log('got OB')
        }
        if (ob.values && ob.values.length > 0) {

          //save problam and medication     
          for (let value of ob.values) {

            if (value) {
              if (value.problems && value.problems.length > 0) {
                //find out  if value is family member 
                if (value.comments == 'family') {
                  var familyMember = value.text;
                } else {
                  familyMember = 'self'
                }
                for (let problem of value.problems) {

                  this.allService.problemService.getProblemByFilter
                    ({
                      patientID: this.patient._id,
                      problemItemID: problem._id,
                      familyMember: familyMember
                    }).then((data: any) => {

                      this.temp = data;
                      if (this.temp.length == 0) {
                        this.allService.problemService.create({
                          patientID: this.patient._id,
                          problemItemID: problem._id,
                          familyMember: familyMember,
                          name: problem.name
                        }).then((data: any) => {
                          console.log('problem created', data)
                        })
                      }
                    })
                }
              }

              if (value.medications && value.medications.length > 0) {

                for (let medication of value.medications) {
                  console.log('medication', medication)
                  this.allService.medsService.getMedsByFilter
                    ({
                      patientID: this.patient._id,
                      medicationItemID: medication._id
                    }).then((data: any) => {

                      this.temp = data;

                      if (this.temp.length == 0) {
                        this.allService.medsService.create({
                          patientID: this.patient._id,
                          medicationItemID: medication._id,
                          medicationItem: { _id: medication._id },
                          status: 'active',
                          name: medication.label.ch
                        }).then((data: any) => {
                          console.log('medication created', data)
                        })

                      } else {
                        this.allService.medsService.update({
                          _id: this.temp[0]._id,
                          patientID: this.patient._id,
                          medicationItemID: medication._id,
                          name: medication.label.ch
                        }).then((data: any) => {
                          console.log('medication updated', data)
                        })
                      }
                    })
                }
              }
              if (value.educations && value.educations.length > 0) {

                for (let education of value.educations) {
                  console.log('education', education)
                  if (!this.allService.utilService.findItem(education, this.patient.educations)) {
                    this.patient.educations.push(education);
                    var filter = {
                      openID: this.patient.openID,
                      message: '数基健康分享:' + education.label.ch
                    };
                    this.allService.mailService.sendMessage(filter).then((data: any) => {
                      console.log('message sent')
                    })
                    this.storage.set('patient', this.patient);
                    this.allService.usersService.updateUser(this.patient);
                  }
                }
              }
            }
          }
        } else if ((!ob.values || (ob.values && ob.values.length == 0))) {
          console.log('ob', ob)
          if (ob && ob.options) {
            for (let option of ob.options) {
              if (option.problems) {
                for (let problem of option.problems) {
                  if (option.comments == 'family') {
                    var familyMember = option.text;
                  }
                  else
                    familyMember = 'self'
                  this.allService.problemService.getProblemByFilter
                    ({
                      patientID: this.patient._id,
                      problemItemID: problem._id,
                      familyMember: familyMember
                    }).then((data: any) => {

                      this.temp = data;

                      if (this.temp.length > 0) {
                        for (let item of this.temp) {
                          this.allService.problemService.delete(item._id)
                        }
                      }
                    })
                }
              }

              if (option.medications) {
                for (let medication of option.medications) {

                  console.log('medication', medication)
                  this.allService.medsService.getMedsByFilter
                    ({
                      patientID: this.patient._id,
                      medicationItemID: medication._id
                    }).then((data: any) => {

                      this.temp = data;

                      if (this.temp.length > 0) {
                        for (let item of this.temp) {
                          this.allService.medsService.delete(item._id).then((data: any) => {
                            console.log('medication deleted!!!!!!!', item)
                          })
                        }
                      }
                    })
                }
              }
            }
          }
        }

        console.log('start update patient!!!!!!!!!!!!!!!')
        if (ob.label.en == 'birthday') {
          this.patient.birthday = ob.value;

          this.allService.usersService.updateUser(this.patient).then((data: any) => {
            this.patient = data;

            console.log('patient updated', this.patient)
          })
        } else if (ob.label.en == 'name') {
          this.patient.name = ob.value;

          this.allService.usersService.updateUser(this.patient).then((data: any) => {
            this.patient = data;

            console.log('patient updated', this.patient)
          })
        } else if (ob.label.en == 'gender' && ob.values && ob.values.length > 0) {
          this.patient.gender = ob.values[0].text;

          this.allService.usersService.updateUser(this.patient).then((data: any) => {
            this.patient = data;

            console.log('patient updated', this.patient)
          })
        } else if (ob.label.en == 'ssn') {
          this.patient.ssn = ob.value;

          this.allService.usersService.updateUser(this.patient).then((data: any) => {
            this.patient = data;

            console.log('patient updated', this.patient)
          })
        } else if (ob.label.en == 'telephone') {
          this.patient.phone = ob.value;
          this.allService.usersService.updateUser(this.patient).then((data: any) => {
            this.patient = data;

            console.log('patient updated', this.patient)
          })
        } else if (ob.label.en == 'photo') {
          this.patient.photo = ob.value;
          this.allService.usersService.updateUser(this.patient).then((data: any) => {
            this.patient = data;

            console.log('patient updated', this.patient)
          })
        } else if (ob.label.en == 'device registry ID' && ob.value) {
          this.patient.deviceUserID = ob.value;
          //  alert('got device id')

        } else if (ob.label.en == "pediatric age" || ob.label.en == "user's age") {
          //alert('ob.label.en'+ob.label.en)
          this.patient.age = ob.value;
          this.patient.ageObj = this.getAge(ob);
          this.allService.usersService.updateUser(this.patient).then((data: any) => {
            this.patient = data;

            console.log('patient updated', this.patient)
          })
        }
      }
    }
  }

  submit(ob: any, obSet: any, form: any) {
    this.saveAfterClose(ob, obSet, form);
    setTimeout(() => {
      this.changeRight();
    }, 100);

    setTimeout(() => {
      this.changeLeft();
    }, 100);
    //from left to center
    setTimeout(() => {
      this.changeCenter();
      this.next();
    }, 100);

  }


  cancelNext() {
    //from center to right and then from right to left
    setTimeout(() => {
      this.changeRight();
    }, 100);

    setTimeout(() => {
      this.changeLeft();
    }, 100);

    //from left to center
    setTimeout(() => {
      this.changeCenter();
      this.next();
    }, 100);

    //this.closeWithNext();

  }


  closeWithNext() {
    this.dialogRef.close({ 'next': true });
  }


  selectExpert() {
    this.dialogRef.close({ 'expert': true });
  }
}