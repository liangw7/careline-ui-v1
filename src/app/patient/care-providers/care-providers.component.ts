import {
  Component, OnInit, OnChanges, Inject, Injectable, HostListener, ViewChild, Input,
  AfterViewInit, OnDestroy, AfterContentInit, Output, EventEmitter
} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DomSanitizer } from '@angular/platform-browser';
import { AllServices } from '../../core/common-services';
//const URL = 'https://careline-server.azurewebsites.net/api/upload/';
import { environment } from '../../../environments/environment';

var URL: string = environment.apiUrl + 'upload/';
var QRCodeURL: string = 'https://www.digitalbaseas.com/';

@Component({
  selector: 'care-providers',
  templateUrl: './care-providers.component.html',
  styleUrls: ['./care-providers.component.scss']
})
export class CareProvidersComponent implements OnInit, OnChanges {
  @Input() provider: any;
  @Input() providers: any;
  @Input() service: any;
  @Input() profile: any;
  @Input() detailID: any;
  @Input() language: any;
  @Output() getSelectedProvider = new EventEmitter();
  temp: any;
  selectedProvider: any;
  forms: any;
  newPatient: any;
  color: any;
  user: any;
  addPatient: any;
  timeOut: any;
  filter: any;
  photo: any;
  loading: any;
  formIDs: any;
  email: any;
  password: any;
  ssn: any;
  missing: any;
  educations: any;
  //@ViewChild('template') template: FormComponent;

  constructor(
    public allServices: AllServices,
    public sanitizer: DomSanitizer,
    private titleService: Title,
    @Inject(SESSION_STORAGE) private storage: StorageService
  ) {

    this.selectedProvider = this.storage.get('provider');
    //this.getService();
    if (!this.language) {
      this.language = this.storage.get('language')
    }
    console.log('language', this.language)
  }


  findProviders(profile: any) {
    console.log('got profile==========', profile)
    if (profile) {
      this.allServices.usersService.getByFilter({ 'profiles': { '$elemMatch': { '_id': profile._id } }, 'role': 'provider' }).then((data) => {
        this.temp = data;
        this.providers = [];
        this.providers = this.temp;
      })
    }
  }


  ngOnInit() {
    this.findProviders(this.profile)
  }


  getDetail(provider: any) {
    this.detailID = provider._id;
    this.getService();
  }


  goToService() {
    this.detailID = this.provider.service._id;
    this.provider = null;
    this.getService();
  }


  getList(desc: any) {
    var list = [];
    if (desc) {
      list = desc.split(', ');
    }
    return list;
  }


  ngOnChanges() {
  }

  select(provider: any, providers: any) {
    if (provider.selected) {
      provider.selected = false;
    } else {
      for (let item of providers) {
        item.selected = false;
      }
      provider.selected = true;
      this.storage.set('selectedProvider', provider)
      this.getSelectedProvider.emit(provider);
    }
  }


  getService() {
    this.forms = [];
    this.educations = [];
    if (this.detailID != 'undefined') {
      this.loading = true;
      this.allServices.usersService.getProviders({ serviceID: this.detailID }).then((data) => {
        this.temp = data;
        if (this.temp.length > 0) {
          this.service = this.temp[0];
          console.log('service', this.temp)
          this.loading = false;
        } else {
          //get provider
          this.allServices.usersService.findUserById(this.detailID).then((data) => {
            this.temp = data;
            this.provider = this.temp;
            //this.titleService.setTitle('数基健康, '+this.profileID.label.ch+', '+this.provider.name)
            this.loading = false;
            console.log('this.provider', this.provider)
          })
        }
      })
    }
  }


  getUrl(item: any) {
    // console.log ('service photo', this.photo)
    if (item)
      return this.allServices.utilService.getImageUrl(String(item.imageOrigin));
    else
      return null;
  }
}
