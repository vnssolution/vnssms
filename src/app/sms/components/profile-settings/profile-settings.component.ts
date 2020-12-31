import { Component, OnInit,ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService  } from 'ngx-toastr';
import { Routes, Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { AccountService } from '../../services/account.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  updateUserForm:FormGroup;
  userData:any;

  constructor(private toastr:ToastrService,private accountService:AccountService,
    private loader:NgxUiLoaderService,private route: ActivatedRoute,private router:Router,
    private formBuilder: FormBuilder) {

      this.updateUserForm = this.formBuilder.group({
        'username':['',Validators.required],
        'email': ['', [
          Validators.required, 
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
           ]],
        'mobile': ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        'orgnaization':[''],
      });

     }

  ngOnInit(): void {
    this.loader.start();
    this.getUserInfo();
  }

  getUserInfo(){
    this.accountService.getUserData()
    .subscribe(  
       response=>{
         this.loader.stop();
        if(response['status_code'] == 200){  
                  this.userData = response['data'];
                  console.log("jall",this.userData);
                  var uploadFile = $(".imagePreview");
                  uploadFile.css("background-image", "url("+this.userData['profile_pic']+")");
               }else {
                  this.toastr.warning('', response['error'].message);
                }
                },error =>{
                console.log("Some thing went wrong");
          });
  }

  image_urls = new Array<string>();
  profilePicSelection(event) {
    console.log(event); 
    this.loader.start();
    this.image_urls = [];
    let files = event.target.files;
    var sFileName =files[0].name;
    var sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
    var iFileSize = files[0].size;
    var iConvert = (iFileSize / 1048576).toFixed(2);
  if (!(sFileExtension === "png" ||
      sFileExtension === "jpeg" ||
      sFileExtension === "jpg") || iFileSize > 1048576) { /// 1 mb
      var txt = "File type : " + sFileExtension + "\n\n";
      txt += "Size: " + iConvert + " MB \n\n";
      txt += "Please make sure your file is in image format and less than 1 MB.\n\n";
      this.toastr.warning('',txt);
      this.loader.stop();
  }else{
    if (files) {
      for (let file of files) {
        var uploadFile = $(".imagePreview");
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.image_urls.push(e.target.result);
          uploadFile.css("background-image", "url("+this.image_urls+")");

          const profile_pic = {
            "type": "profile_pic",
            "profile_pic": e.target.result
           };

          this.accountService.updateProfile(profile_pic)
          .subscribe(
            response=>{
              this.loader.stop();
                        if(response['status_code'] == 200){
                          this.toastr.success('', response['success'].message);
                          this.getUserInfo();
                        }else {
                          this.toastr.warning('', response['error'].message);
                        }          
                  },error =>{
                    console.log("Some thing went wrong please try again");  
                  });
        } 
        reader.readAsDataURL(file);
      }
    }

  }

  
    }

    updateForm(){
      $('#exampleModal').modal('show');
      this.updateUserForm.patchValue({
        username:this.userData?.name,
        email:this.userData?.email,
        mobile:this.userData?.phone,
        orgnaization:this.userData?.organization,
      })

    }

  onSubmit(post){
    console.log(post);
    const data = {"type":"basic","name":post['username'],"email":post['email'],"std_code":"+91","phone":post['mobile'],"organization":post['orgnaization']}
    console.log('test123',data);
    this.accountService.updateProfile(data)
    .subscribe(
      response=>{
          this.loader.stop();
            if(response['status_code'] == 200){
              this.toastr.success('', response['success'].message);
              $('#exampleModal').trigger('click');
              this.getUserInfo();
            }else {
              this.toastr.warning('', response['error'].message);
            }          
            },error =>{
              console.log("Some thing went wrong please try again");  
            });
  }
}
