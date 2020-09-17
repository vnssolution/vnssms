import { Component, OnInit,ViewChild } from '@angular/core';
import { Validators, ValidatorFn, AbstractControl, FormControl, FormGroup,FormArray, FormBuilder } from '@angular/forms';
import { ToastrService  } from 'ngx-toastr';
import { Routes, Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { ContactService } from '../../services/contact.service';
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver'; 
import * as Papa from 'papaparse';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
  createTemplateForm:FormGroup;
  submitted= false;
  templatesList:any;
  dtOptions: any;
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  constructor(private toastr:ToastrService,private contactService:ContactService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router,
    private formBuilder: FormBuilder) { 
      this.createTemplateForm = this.formBuilder.group({
        'template_name':['',Validators.required],
        'template_msg':['',Validators.required],
       });
    }

  ngOnInit(): void {
    this.getTemplatesList();
  }
  onSubmit(postData:any){
    this.submitted = true;
    if (this.createTemplateForm.invalid) {
      this.toastr.warning('','Please enter required fileds'); return false;
    }
   // console.log(postData);
  if (postData){
     const data = {"action":"create","template_name":postData["template_name"],"template":postData["template_msg"]}
      this.loader.start();
        this.contactService.createTemplate(data)
        .subscribe(  
          response=>{
            this.loader.stop();
          if(response['status_code'] == 200){  
                    this.toastr.success('', response['success'].message);
                    $('#exampleModal .close').trigger('click');
                    this.createTemplateForm.reset();
                    this.getTemplatesList();
                  }else {
                    this.toastr.warning('', response['error'].message);
                  }
                  },error =>{
                  console.log("Some thing went wrong");
        });
    }
  }
  getTemplatesList(){
    const data ={"action":"list","free_text":"","status":"","page":1,"per_page":100} 
    this.contactService.createTemplate(data)
    .subscribe(  
       response=>{
        if(response['status_code'] == 200){  
                this.templatesList = response['data']['template_list'];
                this.rerender();
              }else {
                  this.toastr.warning('', response['error'].message);
                }
                },error =>{
                console.log("Some thing went wrong");
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    try {
   // this.ngxService.start();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  } catch (err) {
    console.log(err);
  }
    this.loader.stop();
  }
  ngAfterViewInit() {
    // this.ngxService.start();
     this.dtTrigger.next();
     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
       dtInstance.on('draw.dt', function () {
         if (jQuery('.dataTables_empty').length > 0) {
           jQuery('.dataTables_empty').remove();
         }
       });
     });
    // this.ngxService.start();
   }
   deleteTemplate(id:number){
     console.log(id);
     if (id){
      const data = {"action":"delete","template_id":id}
       this.loader.start();
         this.contactService.createTemplate(data)
         .subscribe(  
           response=>{
             this.loader.stop();
           if(response['status_code'] == 200){  
                     this.toastr.success('', 'Template deleted successfully');
                     this.getTemplatesList();
                   }else {
                     this.toastr.warning('', response['error'].message);
                   }
                   },error =>{
                   console.log("Some thing went wrong");
         });
     }
   }
}
