import { Component, OnInit, Input, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PosterComponent } from '../poster/poster.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AllServices } from '../../common-services';

@Component({
  selector: 'user-registry',
  templateUrl: './user-registry.component.html',
  styleUrls: ['./user-registry.component.scss']
})
export class UserRegistryComponent implements OnInit {
  forms: any;
  temp: any;
  registryUser: any;
  user: any;
  search:any;
  role: any;
  profiles: any;
  selectedProfiles: any;
  serviceList: any;
  selectedServiceList: any;
  marketList: any;
  selectedMarketList: any;
  providers: any;
  source: any;
  selectedProviders: any;
  selectedService: any;
  loading: any;
  result: any;
  addUser: any;
  specialtyList: any;
  specialty: any;
  language: any;
  initialProfiles: any;
  bigScreen: any;
  selectedForms: any;
  poolForms: any;

  constructor(
    private allService: AllServices,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<UserRegistryComponent>,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.bigScreen = this.storage.get('bigScreen')
    if (data.forms)
      this.forms = data.forms;
    if (data.selectedProfiles) {
      this.selectedProfiles = data.selectedProfiles;
      this.selectedForms = data.selectedForms;
      this.initialProfiles = true;
    }
    if (data.selectedForms) {
      this.selectedForms = data.selectedForms;
    }

    if (data.language)
      this.language = data.language;

    if (data.user) {
      this.user = data.user;
      console.log('user', data.user)
      this.specialty = data.user.specialty;
      this.registryUser = data.user;
      this.role = data.user.role;
      if (data.user.profiles && data.user.profiles.length > 0)
        this.selectedProfiles = data.user.profiles;
      if (data.user.introForms && data.user.introForms.length > 0)
        this.selectedForms = data.user.introForms;
      if (data.user.providers && data.user.providers.length > 0)
        this.selectedProviders = data.user.providers;
      if (data.user.serviceList && data.user.serviceList.length > 0)
        this.selectedServiceList = data.user.serviceList;
      if (data.user.marketList && data.user.marketList.length > 0)
        this.selectedMarketList = data.user.marketList;
    } else {
      this.role = data.role;
      this.addUser = true;
    }
  }

  ngOnInit() {
    if (!this.selectedProfiles) {
      this.selectedProfiles = [];
    }
    if (!this.selectedForms) {
      this.selectedForms = [];
    }
    if (!this.selectedProviders) {
      this.selectedProviders = [];
    }
    console.log('role=====', this.role)

    this.allService.categoryService.getCategoriesByFilter({ 'formType': 'publish' }).then((data: any) => {
      this.temp = data;
      this.poolForms = this.temp;

    })
    if (this.role == 'service' || this.role == 'provider') {
      this.allService.categoryService.getCategoriesByFields(['profile']).then((data: any) => {
        this.temp = data;
        this.profiles = this.temp;

      })
      this.allService.usersService.getUsersByRole('provider').then((data: any) => {
        this.temp = data;
        this.providers = this.temp;
        if (this.providers)
          this.loading = false;
      })


    } else if (this.role == 'market place') {
      this.allService.usersService.getUsersByRole('service').then((data: any) => {
        this.temp = data;
        this.serviceList = this.temp;
        if (this.serviceList)
          this.loading = false;
      })

      if (!this.selectedServiceList) {
        this.selectedServiceList = [];
      }
      this.allService.usersService.getUsersByRole('market').then((data: any) => {
        this.temp = data;
        this.marketList = this.temp;
        if (this.marketList)
          this.loading = false;
      })

      if (!this.selectedMarketList) {
        this.selectedMarketList = [];
      }
    }
  }

  tabSelectionChanged(event: any) {

    // Get the selected tab
    let selectedTab = event.tab;

    if (selectedTab.textLabel == 'Profile'
      || selectedTab.textLabel == 'Form'
      || selectedTab.textLabel == 'Provider'
      || selectedTab.textLabel == 'Market'
      || selectedTab.textLabel == 'Service') {
      if (this.selectedProfiles.length == 0) {
        this.allService.usersService.findUserById(this.user._id).then((data: any) => {
          this.temp = data;
          this.selectedProfiles = this.temp.profiles;
          this.selectedProviders = this.temp.providers;
          this.selectedServiceList = this.temp.serviceList;
        })
      }
    }
  }

  share(profile: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    // this.bigScreen = this.storage.get('bigScreen');
    //find the provider for this profile
    dialogConfig.data = { profile: profile, user: this.user };

    if (this.bigScreen == 0) {
      dialogConfig.maxWidth = '100vw',
        dialogConfig.maxHeight = '90vh',
        dialogConfig.height = '90%',
        dialogConfig.width = '100%'
    }

    const dialogRef = this.dialog.open(PosterComponent,
      dialogConfig);
  }

  find(item: any, list: any) {
    for (let i of list) {
      if (item._id == i._id) {
        return true;
      }
    }
    return false;
  }

  select(item: any, list: any) {
    if (!this.find(item, list)) {
      list.push({ _id: item._id, label: item.label, name: item.name, enName: item.enName, photo: item.photo, image: item.image });
    } else {
      list.splice(list.indexOf(item), 1);
    }
    console.log('list', list)
  }

  save() {

    console.log('forms from resgistry', this.forms)
    console.log('user', this.user)
    if (this.role == 'service') {
      console.log('got service role', this.selectedProfiles)
      this.result = { specialty: this.specialty, forms: this.forms, introForms: this.selectedForms, profiles: this.selectedProfiles, providers: this.selectedProviders };
      this.dialogRef.close(this.result)
    } else if (this.role == 'provider') {
      this.result = { specialty: this.specialty, forms: this.forms, introForms: this.selectedForms, profiles: this.selectedProfiles };
      this.dialogRef.close(this.result)
    } else if (this.role == 'market place') {
      this.result = { forms: this.forms, introForms: this.selectedForms, marketList: this.selectedMarketList, serviceList: this.selectedServiceList };
      this.dialogRef.close(this.result)
    } else {
      this.result = { forms: this.forms, introForms: this.selectedForms, };
      this.dialogRef.close(this.result)
    }

  }


  close() {
    this.dialogRef.close()
  }
}