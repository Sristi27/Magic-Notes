import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion'
const mat = [
  MatInputModule,
  MatCardModule, 
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule
]

@NgModule({

  imports: [...mat],
  exports: [...mat],
})
export class MaterialModule { }
