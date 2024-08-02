import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, OnDestroy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    RouterModule,
  ],
})
export class AppComponent implements OnDestroy {
  public nameApp = "angular-material-components";

  isHandset: boolean;
  sidenavMode: "side" | "over" | "push";
  sidenavHasBackdrop: boolean;
  sidenavOpened: boolean;

  protected _destroyed = new Subject<void>();

  constructor(protected breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntil(this._destroyed))
      .subscribe((resp) => {
        this.isHandset = resp?.matches;
        if (this.isHandset) {
          this.activateHandsetLayout();
        } else {
          this.activateWebLayout();
        }
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  protected activateHandsetLayout() {
    this.sidenavMode = "over";
    this.sidenavHasBackdrop = true;
    this.sidenavOpened = false;
  }

  protected activateWebLayout() {
    this.sidenavMode = "side";
    this.sidenavHasBackdrop = false;
    this.sidenavOpened = true;
  }
}
