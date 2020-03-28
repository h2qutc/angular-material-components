import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import * as hljs from 'highlight.js';

@Directive({
    selector: 'code[ngxMatHighlight]'
})
export class NgxMatHighlightDirective implements AfterViewInit {
    constructor(private eltRef: ElementRef) {
    }
    ngAfterViewInit() {
        hljs.highlightBlock(this.eltRef.nativeElement);
    }
}
