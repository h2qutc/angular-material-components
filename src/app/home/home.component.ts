import { Component } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatListItem, MatNavList } from "@angular/material/list";
import { RouterLink } from "@angular/router";

@Component({
  selector: "ngx-mat-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatDivider,
    MatIcon,
    MatListItem,
    MatNavList,
    RouterLink,
  ],
})
export class HomeComponent {}
