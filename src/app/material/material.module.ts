import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
const mat = [
  MatInputModule,
  MatCardModule, 
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatPaginatorModule
]

@NgModule({

  imports: [...mat],
  exports: [...mat],
})
export class MaterialModule { }
