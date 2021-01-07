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
const ɵ0 = keyboardDeadkeys, ɵ1 = keyboardLayouts;
let MatKeyboardModule = class MatKeyboardModule {
};
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
export { MatKeyboardModule };
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbImtleWJvYXJkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUJBQW1CO0FBQ25CLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLGNBQWM7QUFDZCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELG1CQUFtQjtBQUNuQixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDekQsVUFBVTtBQUNWLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzVGLE9BQU8sRUFBRSxlQUFlLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUMxRiw0QkFBNEI7QUFDNUIsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDN0csT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDM0YsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDaEYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsWUFBWTtBQUNaLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO1dBcUNqQixnQkFBZ0IsT0FDakIsZUFBZTtBQUc5RCxJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFpQjtDQUFHLENBQUE7QUFBcEIsaUJBQWlCO0lBdkM3QixRQUFRLENBQUM7UUFDUixPQUFPLEVBQUU7WUFDUCxrQkFBa0I7WUFDbEIsWUFBWTtZQUNaLGFBQWE7WUFFYixjQUFjO1lBQ2QsWUFBWTtZQUVaLG1CQUFtQjtZQUNuQixlQUFlO1lBQ2YsZUFBZTtZQUNmLGFBQWE7WUFDYixjQUFjO1NBQ2Y7UUFDRCxPQUFPLEVBQUU7WUFDUCxvQkFBb0I7WUFDcEIsNkJBQTZCO1lBQzdCLHVCQUF1QjtZQUN2QixvQkFBb0I7U0FDckI7UUFDRCxZQUFZLEVBQUU7WUFDWix3QkFBd0I7WUFDeEIsb0JBQW9CO1lBQ3BCLDZCQUE2QjtZQUM3Qix1QkFBdUI7WUFDdkIsb0JBQW9CO1NBQ3JCO1FBQ0QsZUFBZSxFQUFFO1lBQ2Ysb0JBQW9CO1lBQ3BCLDZCQUE2QjtZQUM3Qix1QkFBdUI7U0FDeEI7UUFDRCxTQUFTLEVBQUU7WUFDVCxrQkFBa0I7WUFDbEIsRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxJQUFrQixFQUFFO1lBQzlELEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsSUFBaUIsRUFBRTtTQUM3RDtLQUNGLENBQUM7R0FDVyxpQkFBaUIsQ0FBRztTQUFwQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFeHRlcm5hbCBtb2R1bGVzXHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbi8vIEFuZ3VsYXIgQ0RLXHJcbmltcG9ydCB7IE92ZXJsYXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XHJcbmltcG9ydCB7IFBvcnRhbE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xyXG4vLyBBbmd1bGFyIG1hdGVyaWFsXHJcbmltcG9ydCB7IE1hdENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xyXG5pbXBvcnQgeyBNYXRJY29uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XHJcbmltcG9ydCB7IE1hdElucHV0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXQnO1xyXG4vLyBDb25maWdzXHJcbmltcG9ydCB7IGtleWJvYXJkRGVhZGtleXMsIE1BVF9LRVlCT0FSRF9ERUFES0VZUyB9IGZyb20gJy4vY29uZmlncy9rZXlib2FyZC1kZWFka2V5LmNvbmZpZyc7XHJcbmltcG9ydCB7IGtleWJvYXJkTGF5b3V0cywgTUFUX0tFWUJPQVJEX0xBWU9VVFMgfSBmcm9tICcuL2NvbmZpZ3Mva2V5Ym9hcmQtbGF5b3V0cy5jb25maWcnO1xyXG4vLyBDb21wb25lbnRzIGFuZCBkaXJlY3RpdmVzXHJcbmltcG9ydCB7IE1hdEtleWJvYXJkQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2tleWJvYXJkLWNvbnRhaW5lci9rZXlib2FyZC1jb250YWluZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRLZXlDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMva2V5Ym9hcmQta2V5L2tleWJvYXJkLWtleS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9rZXlib2FyZC9rZXlib2FyZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9rZXlib2FyZC5kaXJlY3RpdmUnO1xyXG4vLyBQcm92aWRlcnNcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRLZWJhYkNhc2VQaXBlIH0gZnJvbSAnLi9waXBlcy9rZWJhYi1jYXNlLnBpcGUnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2tleWJvYXJkLnNlcnZpY2UnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICAvLyBBbmd1bGFyIG1vZHVsZXNcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIE92ZXJsYXlNb2R1bGUsXHJcblxyXG4gICAgLy8gQ2RrIG1vZHVsZXNcclxuICAgIFBvcnRhbE1vZHVsZSxcclxuXHJcbiAgICAvLyBNYXRlcmlhbCBtb2R1bGVzXHJcbiAgICBNYXRCdXR0b25Nb2R1bGUsXHJcbiAgICBNYXRDb21tb25Nb2R1bGUsXHJcbiAgICBNYXRJY29uTW9kdWxlLFxyXG4gICAgTWF0SW5wdXRNb2R1bGVcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIE1hdEtleWJvYXJkQ29tcG9uZW50LFxyXG4gICAgTWF0S2V5Ym9hcmRDb250YWluZXJDb21wb25lbnQsXHJcbiAgICBNYXRLZXlib2FyZEtleUNvbXBvbmVudCxcclxuICAgIE1hdEtleWJvYXJkRGlyZWN0aXZlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIE1hdEtleWJvYXJkS2ViYWJDYXNlUGlwZSxcclxuICAgIE1hdEtleWJvYXJkQ29tcG9uZW50LFxyXG4gICAgTWF0S2V5Ym9hcmRDb250YWluZXJDb21wb25lbnQsXHJcbiAgICBNYXRLZXlib2FyZEtleUNvbXBvbmVudCxcclxuICAgIE1hdEtleWJvYXJkRGlyZWN0aXZlXHJcbiAgXSxcclxuICBlbnRyeUNvbXBvbmVudHM6IFtcclxuICAgIE1hdEtleWJvYXJkQ29tcG9uZW50LFxyXG4gICAgTWF0S2V5Ym9hcmRDb250YWluZXJDb21wb25lbnQsXHJcbiAgICBNYXRLZXlib2FyZEtleUNvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBNYXRLZXlib2FyZFNlcnZpY2UsXHJcbiAgICB7IHByb3ZpZGU6IE1BVF9LRVlCT0FSRF9ERUFES0VZUywgdXNlVmFsdWU6IGtleWJvYXJkRGVhZGtleXMgfSxcclxuICAgIHsgcHJvdmlkZTogTUFUX0tFWUJPQVJEX0xBWU9VVFMsIHVzZVZhbHVlOiBrZXlib2FyZExheW91dHMgfVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkTW9kdWxlIHt9XHJcbiJdfQ==