import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AuthDomainModule } from "@undefined/auth/domain"
import { AuthPageComponent } from "./auth-page.component"

@NgModule({
  imports: [CommonModule, AuthDomainModule],
  declarations: [AuthPageComponent],
  exports: [AuthPageComponent]
})
export class AuthFeatureAuthPageModule {}
