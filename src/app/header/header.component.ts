import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy{
  constructor(private dataStorageService: DataStorageService,private authservice: AuthService) {}

  private userSub!: Subscription;
  isAuthenticated = false;

  ngOnInit(): void {
      this.userSub = this.authservice.user.subscribe(user =>{
        this.isAuthenticated = !!user;
      });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
   this.userSub =  this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authservice.Logout();
  }

  ngOnDestroy(): void {
      this.userSub.unsubscribe();
  }
}
