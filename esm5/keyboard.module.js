import { __decorate } from "tslib";
// External modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// Angular CDK
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
// Angular material
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
// Configs
import { keyboardDeadkeys, MAT_KEYBOARD_DEADKEYS } from './configs/keyboard-deadkey.config';
import { keyboardLayouts, MAT_KEYBOARD_LAYOUTS } from './configs/keyboard-layouts.config';
// Components and directives
import { MatKeyboardContainerComponent } from './components/keyboard-container/keyboard-container.component';
import { MatKeyboardKeyComponent } from './components/keyboard-key/keyboard-key.component';
import { MatKeyboardComponent } from './components/keyboard/keyboard.component';
import { MatKeyboardDirective } from './directives/keyboard.directive';
// Providers
import { MatKeyboardKebabCasePipe } from './pipes/kebab-case.pipe';
import { MatKeyboardService } from './services/keyboard.service';
var ɵ0 = keyboardDeadkeys, ɵ1 = keyboardLayouts;
var MatKeyboardModule = /** @class */ (function () {
    function MatKeyboardModule() {
    }
    MatKeyboardModule = __decorate([
        NgModule({
            imports: [
                // Angular modules
                CommonModule,
                OverlayModule,
                // Cdk modules
                PortalModule,
                // Material modules
                MatButtonModule,
                MatCommonModule,
                MatIconModule,
                MatInputModule
            ],
            exports: [
                MatKeyboardComponent,
                MatKeyboardContainerComponent,
                MatKeyboardKeyComponent,
                MatKeyboardDirective
            ],
            declarations: [
                MatKeyboardKebabCasePipe,
                MatKeyboardComponent,
                MatKeyboardContainerComponent,
                MatKeyboardKeyComponent,
                MatKeyboardDirective
            ],
            entryComponents: [
                MatKeyboardComponent,
                MatKeyboardContainerComponent,
                MatKeyboardKeyComponent
            ],
            providers: [
                MatKeyboardService,
                { provide: MAT_KEYBOARD_DEADKEYS, useValue: ɵ0 },
                { provide: MAT_KEYBOARD_LAYOUTS, useValue: ɵ1 }
            ]
        })
    ], MatKeyboardModule);
    return MatKeyboardModule;
}());
export { MatKeyboardModule };
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbImtleWJvYXJkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUJBQW1CO0FBQ25CLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLGNBQWM7QUFDZCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELG1CQUFtQjtBQUNuQixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDekQsVUFBVTtBQUNWLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzVGLE9BQU8sRUFBRSxlQUFlLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUMxRiw0QkFBNEI7QUFDNUIsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDN0csT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDM0YsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDaEYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsWUFBWTtBQUNaLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO1NBcUNqQixnQkFBZ0IsT0FDakIsZUFBZTtBQUc5RDtJQUFBO0lBQWdDLENBQUM7SUFBcEIsaUJBQWlCO1FBdkM3QixRQUFRLENBQUM7WUFDUixPQUFPLEVBQUU7Z0JBQ1Asa0JBQWtCO2dCQUNsQixZQUFZO2dCQUNaLGFBQWE7Z0JBRWIsY0FBYztnQkFDZCxZQUFZO2dCQUVaLG1CQUFtQjtnQkFDbkIsZUFBZTtnQkFDZixlQUFlO2dCQUNmLGFBQWE7Z0JBQ2IsY0FBYzthQUNmO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLG9CQUFvQjtnQkFDcEIsNkJBQTZCO2dCQUM3Qix1QkFBdUI7Z0JBQ3ZCLG9CQUFvQjthQUNyQjtZQUNELFlBQVksRUFBRTtnQkFDWix3QkFBd0I7Z0JBQ3hCLG9CQUFvQjtnQkFDcEIsNkJBQTZCO2dCQUM3Qix1QkFBdUI7Z0JBQ3ZCLG9CQUFvQjthQUNyQjtZQUNELGVBQWUsRUFBRTtnQkFDZixvQkFBb0I7Z0JBQ3BCLDZCQUE2QjtnQkFDN0IsdUJBQXVCO2FBQ3hCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULGtCQUFrQjtnQkFDbEIsRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxJQUFrQixFQUFFO2dCQUM5RCxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxRQUFRLElBQWlCLEVBQUU7YUFDN0Q7U0FDRixDQUFDO09BQ1csaUJBQWlCLENBQUc7SUFBRCx3QkFBQztDQUFBLEFBQWpDLElBQWlDO1NBQXBCLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEV4dGVybmFsIG1vZHVsZXNcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuLy8gQW5ndWxhciBDREtcclxuaW1wb3J0IHsgT3ZlcmxheU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcclxuaW1wb3J0IHsgUG9ydGFsTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XHJcbi8vIEFuZ3VsYXIgbWF0ZXJpYWxcclxuaW1wb3J0IHsgTWF0Q29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XHJcbmltcG9ydCB7IE1hdEJ1dHRvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XHJcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcclxuaW1wb3J0IHsgTWF0SW5wdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XHJcbi8vIENvbmZpZ3NcclxuaW1wb3J0IHsga2V5Ym9hcmREZWFka2V5cywgTUFUX0tFWUJPQVJEX0RFQURLRVlTIH0gZnJvbSAnLi9jb25maWdzL2tleWJvYXJkLWRlYWRrZXkuY29uZmlnJztcclxuaW1wb3J0IHsga2V5Ym9hcmRMYXlvdXRzLCBNQVRfS0VZQk9BUkRfTEFZT1VUUyB9IGZyb20gJy4vY29uZmlncy9rZXlib2FyZC1sYXlvdXRzLmNvbmZpZyc7XHJcbi8vIENvbXBvbmVudHMgYW5kIGRpcmVjdGl2ZXNcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMva2V5Ym9hcmQtY29udGFpbmVyL2tleWJvYXJkLWNvbnRhaW5lci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZEtleUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9rZXlib2FyZC1rZXkva2V5Ym9hcmQta2V5LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE1hdEtleWJvYXJkQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2tleWJvYXJkL2tleWJvYXJkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE1hdEtleWJvYXJkRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2tleWJvYXJkLmRpcmVjdGl2ZSc7XHJcbi8vIFByb3ZpZGVyc1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZEtlYmFiQ2FzZVBpcGUgfSBmcm9tICcuL3BpcGVzL2tlYmFiLWNhc2UucGlwZSc7XHJcbmltcG9ydCB7IE1hdEtleWJvYXJkU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMva2V5Ym9hcmQuc2VydmljZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIC8vIEFuZ3VsYXIgbW9kdWxlc1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgT3ZlcmxheU1vZHVsZSxcclxuXHJcbiAgICAvLyBDZGsgbW9kdWxlc1xyXG4gICAgUG9ydGFsTW9kdWxlLFxyXG5cclxuICAgIC8vIE1hdGVyaWFsIG1vZHVsZXNcclxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcclxuICAgIE1hdENvbW1vbk1vZHVsZSxcclxuICAgIE1hdEljb25Nb2R1bGUsXHJcbiAgICBNYXRJbnB1dE1vZHVsZVxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgTWF0S2V5Ym9hcmRDb21wb25lbnQsXHJcbiAgICBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCxcclxuICAgIE1hdEtleWJvYXJkS2V5Q29tcG9uZW50LFxyXG4gICAgTWF0S2V5Ym9hcmREaXJlY3RpdmVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgTWF0S2V5Ym9hcmRLZWJhYkNhc2VQaXBlLFxyXG4gICAgTWF0S2V5Ym9hcmRDb21wb25lbnQsXHJcbiAgICBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCxcclxuICAgIE1hdEtleWJvYXJkS2V5Q29tcG9uZW50LFxyXG4gICAgTWF0S2V5Ym9hcmREaXJlY3RpdmVcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gICAgTWF0S2V5Ym9hcmRDb21wb25lbnQsXHJcbiAgICBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCxcclxuICAgIE1hdEtleWJvYXJkS2V5Q29tcG9uZW50XHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIE1hdEtleWJvYXJkU2VydmljZSxcclxuICAgIHsgcHJvdmlkZTogTUFUX0tFWUJPQVJEX0RFQURLRVlTLCB1c2VWYWx1ZToga2V5Ym9hcmREZWFka2V5cyB9LFxyXG4gICAgeyBwcm92aWRlOiBNQVRfS0VZQk9BUkRfTEFZT1VUUywgdXNlVmFsdWU6IGtleWJvYXJkTGF5b3V0cyB9XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTWF0S2V5Ym9hcmRNb2R1bGUge31cclxuIl19