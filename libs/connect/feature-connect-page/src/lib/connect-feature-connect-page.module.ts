import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ConnectPageComponent } from "./connect-page.component"
import { TuiFieldErrorPipeModule, TuiInputCopyModule, TuiInputModule } from "@taiga-ui/kit"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { TuiButtonModule, TuiErrorModule } from "@taiga-ui/core"
import { RxPush } from "@rx-angular/template/push"

@NgModule({
  imports: [ CommonModule, TuiInputCopyModule, FormsModule, TuiInputModule, ReactiveFormsModule, TuiButtonModule, TuiErrorModule, TuiFieldErrorPipeModule, RxPush ],
  declarations: [ ConnectPageComponent ],
  exports: [ ConnectPageComponent ]
})
export class ConnectFeatureConnectPageModule {
}
