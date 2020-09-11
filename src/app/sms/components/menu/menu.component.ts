import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(document).ready(function() {
     // $('#example').DataTable();
      $('.custom-upload input[type=file]').change(function(){
        $(this).next().find('input').val($(this).val());
    });
  } );
 
  }

}
