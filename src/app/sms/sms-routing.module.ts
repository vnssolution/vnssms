import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutOneComponent } from './components/layout-one/layout-one.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { GroupsComponent } from './components/groups/groups.component';

const routes: Routes = [{
  path: 'vns', component: LayoutOneComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: 'contacts/group/:groupId', component: ContactsComponent },
    { path: 'contacts/groups', component: GroupsComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule { }
