import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public users:any = [];

  constructor(private authService: AuthService,
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getUsers()
    .subscribe(res=>{
      this.users = res;
    });
  }

  logout(){
    this.authService.logout();
  }
}
