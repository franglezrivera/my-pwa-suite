import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScannerComponent } from './components/scanner/scanner.component';

//const routes: Routes = [];
const routes: Routes = [{ path: 'scanner', component: ScannerComponent }];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
