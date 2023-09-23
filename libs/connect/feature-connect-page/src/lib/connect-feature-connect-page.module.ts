import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ConnectPageComponent } from "./connect-page.component"
import { TuiFieldErrorPipeModule, TuiInputCopyModule, TuiInputModule } from "@taiga-ui/kit"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { TuiButtonModule, TuiErrorModule } from "@taiga-ui/core"

@NgModule({
  imports: [ CommonModule, TuiInputCopyModule, FormsModule, TuiInputModule, ReactiveFormsModule, TuiButtonModule, TuiErrorModule, TuiFieldErrorPipeModule ],
  declarations: [ ConnectPageComponent ],
  exports: [ ConnectPageComponent ]
})
export class ConnectFeatureConnectPageModule {
}
