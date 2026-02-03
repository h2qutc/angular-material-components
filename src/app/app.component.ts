import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  public nameApp = 'angular-material-components';

  isHandset: boolean;
  sidenavMode: 'side' | 'over' | 'push';
  sidenavHasBackdrop: boolean;
  sidenavOpened: boolean;


  protected _destroyed = new Subject<void>();

  constructor(
    protected breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([Breakpoints.XSmall])
      .pipe(takeUntil(this._destroyed))
      .subscribe(resp => {
        this.isHandset = resp?.matches;
        if (this.isHandset) {
          this.activateHandsetLayout();
        } else {
          this.activateWebLayout();
        }
      })
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  protected activateHandsetLayout() {
    this.sidenavMode = 'over';
    this.sidenavHasBackdrop = true;
    this.sidenavOpened = false;
  }

  protected activateWebLayout() {
    this.sidenavMode = 'side';
    this.sidenavHasBackdrop = false;
    this.sidenavOpened = true;
  }

}
