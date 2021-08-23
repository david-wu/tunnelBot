import {
  Component,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dwu-user-login-success',
  templateUrl: './user-login-success.component.html',
  styleUrls: ['./user-login-success.component.scss']
})
export class UserLoginSuccessComponent {

  constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    console.log('route', this.route);
  }
}
