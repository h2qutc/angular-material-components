import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { NgxMatDateAdapter } from './date-adapter';
import { NgxMatNativeDateAdapter } from './native-date-adapter';
import { NGX_MAT_NATIVE_DATE_FORMATS } from './native-date-formats';
import { NGX_MAT_DATE_FORMATS } from './date-formats';
import * as i0 from "@angular/core";
export class NgxNativeDateModule {
}
/** @nocollapse */ NgxNativeDateModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxNativeDateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ NgxNativeDateModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.2", ngImport: i0, type: NgxNativeDateModule, imports: [PlatformModule] });
/** @nocollapse */ NgxNativeDateModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxNativeDateModule, providers: [
        { provide: NgxMatDateAdapter, useClass: NgxMatNativeDateAdapter },
    ], imports: [PlatformModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxNativeDateModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [PlatformModule],
                    providers: [
                        { provide: NgxMatDateAdapter, useClass: NgxMatNativeDateAdapter },
                    ],
                }]
        }] });
export class NgxMatNativeDateModule {
}
/** @nocollapse */ NgxMatNativeDateModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatNativeDateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ NgxMatNativeDateModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.2", ngImport: i0, type: NgxMatNativeDateModule, imports: [NgxNativeDateModule] });
/** @nocollapse */ NgxMatNativeDateModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatNativeDateModule, providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: NGX_MAT_NATIVE_DATE_FORMATS }], imports: [NgxNativeDateModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatNativeDateModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NgxNativeDateModule],
                    providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: NGX_MAT_NATIVE_DATE_FORMATS }],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0aXZlLWRhdGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZGF0ZXRpbWUtcGlja2VyL3NyYy9saWIvY29yZS9uYXRpdmUtZGF0ZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDaEUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDcEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBU3RELE1BQU0sT0FBTyxtQkFBbUI7O21JQUFuQixtQkFBbUI7b0lBQW5CLG1CQUFtQixZQUxsQixjQUFjO29JQUtmLG1CQUFtQixhQUpqQjtRQUNQLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSx1QkFBdUIsRUFBRTtLQUNwRSxZQUhTLGNBQWM7MkZBS2YsbUJBQW1CO2tCQU4vQixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDekIsU0FBUyxFQUFFO3dCQUNQLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSx1QkFBdUIsRUFBRTtxQkFDcEU7aUJBQ0o7O0FBT0QsTUFBTSxPQUFPLHNCQUFzQjs7c0lBQXRCLHNCQUFzQjt1SUFBdEIsc0JBQXNCLFlBTnRCLG1CQUFtQjt1SUFNbkIsc0JBQXNCLGFBRnBCLENBQUMsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLDJCQUEyQixFQUFFLENBQUMsWUFEM0UsbUJBQW1COzJGQUdwQixzQkFBc0I7a0JBSmxDLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7b0JBQzlCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSwyQkFBMkIsRUFBRSxDQUFDO2lCQUN4RiIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5pbXBvcnQgeyBQbGF0Zm9ybU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4TWF0RGF0ZUFkYXB0ZXIgfSBmcm9tICcuL2RhdGUtYWRhcHRlcic7XG5pbXBvcnQgeyBOZ3hNYXROYXRpdmVEYXRlQWRhcHRlciB9IGZyb20gJy4vbmF0aXZlLWRhdGUtYWRhcHRlcic7XG5pbXBvcnQgeyBOR1hfTUFUX05BVElWRV9EQVRFX0ZPUk1BVFMgfSBmcm9tICcuL25hdGl2ZS1kYXRlLWZvcm1hdHMnO1xuaW1wb3J0IHsgTkdYX01BVF9EQVRFX0ZPUk1BVFMgfSBmcm9tICcuL2RhdGUtZm9ybWF0cyc7XG5cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbUGxhdGZvcm1Nb2R1bGVdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IE5neE1hdERhdGVBZGFwdGVyLCB1c2VDbGFzczogTmd4TWF0TmF0aXZlRGF0ZUFkYXB0ZXIgfSxcbiAgICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hOYXRpdmVEYXRlTW9kdWxlIHsgfVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtOZ3hOYXRpdmVEYXRlTW9kdWxlXSxcbiAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5HWF9NQVRfREFURV9GT1JNQVRTLCB1c2VWYWx1ZTogTkdYX01BVF9OQVRJVkVfREFURV9GT1JNQVRTIH1dLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hNYXROYXRpdmVEYXRlTW9kdWxlIHsgfVxuIl19