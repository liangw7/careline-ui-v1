import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrl } from '../models/api-url';
import { CategoryService } from './category.service';
import { DatasService } from './datas.service';
import { UtilService } from './util.service';

@Injectable()
export class SetFormsService {
  temp: any;
  filter: any;
  loading: any;
  constructor(
    private categoryService: CategoryService,
    private datasService: DatasService,
    private utilService: UtilService,
    public router: Router,
    public entity: ApiUrl
  ) {
  }

  setForm(forms: any, patient: any, registryUser: any, visit: any, order: any, familyMember: any) {
    console.log('--setFormsService--setForm--start--');
    console.log('forms in formcomponent', forms)
    for (let form of forms) {
      this.categoryService.getCategory(form._id).then((data) => {
        this.temp = data;
        form.obSets = [];
        form.obSets = this.temp.obSets;
        form.formType = this.temp.formType;
        //  form.name=this.temp.name;
        for (let obSet of form.obSets) {
          this.categoryService.getCategory(obSet._id).then((obSet_data) => {
            this.temp = obSet_data;
            obSet.selected = true;
            if (obSet.addsIn == true)
              obSet.show = false;
            else
              obSet.show = true;
            //   var obsTemp=[];
            obSet.obIDs = [];
            for (let ob of this.temp.obs) {
              obSet.obIDs.push(ob._id)
            }
            //    obSet.obs=this.temp.obs;
            obSet.name = this.temp.name;
            obSet.internalName = this.temp.internalName;
            obSet.obs = [];
            obSet.obs = this.temp.obs;
            this.loading = false;
            console.log('loading', this.loading)
            console.log('obSet.obs', obSet.obs)
            for (let ob of obSet.obs) {

              this.categoryService.getCategory(ob._id).then((data) => {
                this.temp = data;
                ob.type = this.temp.type;
                ob.options = [];
                ob.options = this.temp.options;

                if (ob.addsIn == true)
                  ob.show = false;
                else
                  ob.show = true;
                if (ob.index == undefined) {
                  ob.index = obSet.obs.indexOf(ob);
                }
                if (patient || registryUser)
                  this.getObValue(ob, obSet, form, patient, registryUser, visit, order, familyMember);
              })
            }

            if (form.formType == 'education') {
              this.categoryService.getCategoriesByFilter({ _id: { $in: obSet.obIDs } }).then((data) => {
                this.temp = data;
                obSet.obs = [];
                obSet.obs = this.temp;
              })
            }
            this.sortObs(obSet.obs);
          })
        }
      })
    }
    console.log('--setFormsService--setForm--end--');
  }

  getMappingValue(ob: any, obSet: any, patient: any, registryUser: any, visit: any, familyMember: any) {
    console.log('--setFormsService--getMappingValue--start--');
    if (!registryUser) {
      if (ob.context == 'visit')
        this.filter = { patientID: patient._id, visitID: visit._id, obID: ob.mappingOb._id }
      else if (ob.context == 'patient')
        this.filter = { patientID: patient._id, obID: ob.mappingOb._id }
      else if (ob.context == 'problem')
        this.filter = { patientID: patient._id, problemID: obSet.problemID, obID: ob.mappingOb._id, familyMember: familyMember }
      else if (ob.context == 'medication')
        this.filter = { patientID: patient._id, medicationID: obSet.medicationID, obID: ob.mappingOb._id }

      else
        this.filter = { patientID: patient._id, visitID: visit._id, obID: ob.mappingOb._id }
    }
    else {
      this.filter = { registryUserID: registryUser._id, obID: ob.mappingOb._id }
    }
    this.datasService.getDatasByFilter2(this.filter).then((data) => {
      this.temp = data;
      if (this.temp.length > 0) {
        ob.value = this.temp[this.temp.length - 1].value;
        ob.valuelist = [];
        ob.valuelist = this.temp[this.temp.length - 1].valueList;
      }
    })
    console.log('--setFormsService--getMappingValue--end--');
  }

  getObValue(ob: any, obSet: any, form: any, patient: any, registryUser: any,
    visit: any, order: any, familyMember: any) {
    console.log('--setFormsService--getObValue--start--');
    if (!registryUser) {
      if (ob.context == 'visit')
        this.filter = { patientID: patient._id, visitID: visit._id, obID: ob._id }
      else if (ob.context == 'patient')
        this.filter = { patientID: patient._id, obID: ob._id }
      else if (ob.context == 'problem')
        this.filter = { patientID: patient._id, problemID: obSet.problemID, obID: ob._id, familyMember: familyMember }
      else if (ob.context == 'medication')
        this.filter = { patientID: patient._id, medicationID: obSet.medicationID, obID: ob._id }
      else if (ob.context == 'order')
        this.filter = { patientID: patient._id, medicationID: obSet.medicationID, obID: ob._id, orderID: order._id }
      else {
        if (visit)
          this.filter = { patientID: patient._id, visitID: visit._id, obID: ob._id }
        else
          this.filter = { patientID: patient._id, obID: ob._id }
      }
    }
    else {
      this.filter = { registryUserID: registryUser._id, obID: ob._id }
    }

    this.datasService.getDatasByFilter2(this.filter).then((data: any) => {

      this.temp = data;
      //    console.log ('this.temp', this.temp)
      if (this.temp.length > 0) {
        var seiry: any;
        if (!ob.seiry || ob.seiry == 0)
          seiry = this.temp.length - 1;
        else if (ob.seiry > 0)
          seiry = ob.seiry;
        //  console.log ('ob.type', ob.type)
        //ob.options=this.temp[seiry].options;
        if (this.temp[seiry])
          ob.value = this.temp[seiry].value;
        if (ob.type == 'image') {
          ob.url = this.utilService.getImageUrl(String(ob.value));
          console.log('image ob.value', ob.value)
          console.log('ob.url', ob.url)
        }
        if (ob.value != undefined) {
          ob.show = true;
          //     this.findRangeValue_2 (ob,obSet, form.obSets);
        }
        if ((ob.type == 'list' || ob.type == 'calculation') && this.temp[seiry].values && this.temp[seiry].values.length > 0) {
          ob.show = true;
          ob.valueList = [];
          ob.valueList = this.temp[seiry].values;
        }
      }

    })
    console.log('--setFormsService--getObValue--end--');
  }


  find(item: any, list: any) {
    console.log('--setFormsService--find--start--');
    for (let i of list) {
      if (item._id == i._id) {
        console.log('--setFormsService--find--end--');
        return true;
      }
    }
    console.log('--setFormsService--find--end--');
    return false;
  }

  findValue(option: any, ob: any) {
    console.log('--setFormsService--findValue--start--');
    for (let value of ob.values) {
      if (value && value.text == option.text) {
        console.log('--setFormsService--findValue--end--');
        return true;
      }
    }
    console.log('--setFormsService--findValue--end--');
    return false;
  }

  findRange(ob: any, obSet: any, obSets: any) {
    console.log('--setFormsService--findRange--start--');
    for (let option of ob.options) {
      option.selected = false;
      ob.value = Number(ob.value);
      option.from = Number(option.from);
      option.to = Number(option.to);

      if (ob.value >= option.from && ob.value < option.to) {
        this.addOption(option, ob, obSet, obSets)
      }
    }
    console.log('--setFormsService--findRange--end--');
  }

  findRangeValue_2(ob: any, obSet: any, obSets: any) {
    console.log('--setFormsService--findRangeValue_2--start--');
    if (ob.values == undefined)
      ob.values = [];
    for (let option of ob.options) {

      if (ob.value && Number(ob.value) >= Number(option.from) && Number(ob.value) < Number(option.to))
        this.addOption(option, ob, obSet, obSets);
    }
    console.log('--setFormsService--findRangeValue_2--end--');
  }

  addOption(option: any, ob: any, obSet: any, obSets: any) {
    console.log('--setFormsService--addOption--start--');
    if (ob.values == undefined)
      ob.values = [];
    option.selected = true;
    if (!this.findValue(option, ob)) {
      ob.values.push(option);

      if (option.items != undefined && option.items.length > 0) {
        for (let item of option.items) {
          for (let obSetItem of obSets) {
            if (obSetItem._id == item._id) {
              obSetItem.show = true;
              if (obSetItem.showTime == undefined)
                obSetItem.showTime = 0;
              //  obSetItem.showTime++;
            }
            for (let obItem of obSet.obs) {

              if (obItem._id == item._id) {
                obItem.show = true;
                if (obItem.showTime == undefined)
                  obItem.showTime = 0;
                //   obItem.showTime++;
              }
            }
          }
        }
      }
    }
    console.log('--setFormsService--addOption--end--');
  }

  getCalculation(calOb: any, obSet: any) {
    console.log('--setFormsService--getCalculation--start--');
    calOb.value = 0;
    var index = 0;
    for (let item of calOb.calculationItems) {
      index++;

      for (let ob of obSet.obs) {

        if (item._id == ob._id) {
          console.log('ob', ob.name)
          if (ob.options.length > 0) {
            for (let option of ob.options) {

              if (ob.value && Number(ob.value) >= option.from && Number(ob.value) < option.to) {
                console.log('ob.value', ob.value)
                console.log('option.number', option.number)
                calOb.value = calOb.value + Number(option.number);

              }
              else if (ob.values && option.text == ob.values[0].text) {
                console.log('ob.values', ob.values)
                console.log('option.number', option.number)
                calOb.value = calOb.value + Number(option.number);

              }
              console.log('calOb.value', calOb.value)
            }

          }
          else if (ob.values[0]) {
            calOb.value = calOb.value + Number(ob.values[0].number);
          }
        }

      }
      //in the loop reaches the last item
      if (index == calOb.calculationItems.length) {
        for (let calOption of calOb.options) {
          if (calOb.value >= calOption.from && calOb.value < calOption.to) {
            calOb.values = [];
            calOb.values = [calOption];
            calOption.selected = true;
            console.log('calOb.values', calOb.values)
          }
        }
      }
    }
    console.log('--setFormsService--getCalculation--end--');
  }

  sortObs(obs: any) {
    console.log('--setFormsService--getCalculation--start--');
    if (obs && obs.length > 0) {
      var temp = [];
      for (let ob of obs) {

        temp[ob.index] = ob;
      }
      obs = temp;
    }
    console.log('--setFormsService--getCalculation--end--');
  }

}