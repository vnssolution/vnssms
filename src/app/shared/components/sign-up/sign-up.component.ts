import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, Validators, FormControl } from '@angular/forms';
import { MustMatch } from '../../../helpers/must-match.validator';
import { SharedService } from '../../../services/shared.service'
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  registerForm:FormGroup;
  verifyPhoneForm:FormGroup;
  submitted = false;
  loginSubmitted=false;
  otp: string;
  showOtpComponent = true;
  phonenumber:any;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: ' * ',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  onOtpChange(otp) {
    this.otp = otp;
  }
  constructor( private formBuilder: FormBuilder, 
    private toastr: ToastrService,
    private loader: NgxUiLoaderService,
    private SharedService:SharedService,
    private router:Router
    ) { 
      this.registerForm = this.formBuilder.group({
        'username':['',Validators.required],
        'orgnaization':[''],
        'credits': [''],
        'senderId': [''],
        'mobile': ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        'email': ['', [
               Validators.required, 
               Validators.email,
               Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
                ]],
      });

      this.verifyPhoneForm = this.formBuilder.group({

      });
 }

  ngOnInit(): void {
    this.loader.start();

    this.loader.stop();

  }
 get f() { return this.registerForm.controls; }

  SignUpSubmit(post:any){
    this.submitted = true;
    if (this.registerForm.invalid) {     
      console.log("invalid"); return false;
     } 
     this.loader.start();
    this.phonenumber = post['mobile'];
    const signupData = {
          "username":post['username'],
          "email":post['email'],
          "std_code":"+91",
          "phone":post['mobile'],
          "organization":post['orgnaization'],
          "credits":post['credits'],
          "sender_id":post['senderId'],
          "profile_pic":""
       }

    this.SharedService.signup(signupData)
    .subscribe(
        response=>{
          this.loader.stop();
          if(response['status_code'] == 200){
           // this.toastr.success('Success', response['success'].message);
           $('#myModal').modal('show');

          }else {
            this.toastr.warning('', response['error'].message);
          } 
        },error =>{
          this.loader.stop();
          console.log("Some thing went wrong");  
  }); 
  }

  verfyPhoneSubmit(post:any){
    
    if(this.otp ==undefined){
      this.toastr.warning('','Pleas enter OTP'); return false;
    }
    const otpverify = {
      "action": "verify",
      "phone": this.phonenumber,
      "otp": this.otp,
     };
     console.log(otpverify);
     this.loader.start();
        this.SharedService.verifyPhoneNumber(otpverify)
          .subscribe(
            response=>{
              this.loader.stop();
              console.log('klm',response);
              if(response['status_code'] == 200){
                $('#myModal .close').trigger('click');
                 this.toastr.success('', "OTP is verified successfully!");
                 //this.toastr.success('', response['message']);
                 localStorage.setItem("vns_auth_user",JSON.stringify(response['data']));
                 localStorage.setItem("vns_auth_token",response['data'].access_token);
                 //this.router.navigate(["jsr/editProfile"]);
                 window.location.href = 'vns/dashboard';
               }else {
                 this.toastr.warning('', response['error'].message);
              }
            },error =>{
              this.loader.stop();
              console.log("Some thing went wrong");  
         });
      }
}
