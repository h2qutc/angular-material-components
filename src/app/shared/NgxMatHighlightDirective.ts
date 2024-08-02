import { AfterViewInit, Directive, ElementRef } from "@angular/core";
import hljs from "highlight.js";

@Directive({
  selector: "code[ngxMatHighlight]",
  standalone: true,
})
export class NgxMatHighlightDirective implements AfterViewInit {
  constructor(private eltRef: ElementRef) {}

  ngAfterViewInit() {
    hljs.highlightElement(this.eltRef.nativeElement);
  }
}
