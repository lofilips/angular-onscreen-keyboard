import { __decorate, __extends } from "tslib";
import { state, style, trigger } from '@angular/animations';
import { BasePortalOutlet, CdkPortalOutlet } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, EmbeddedViewRef, HostBinding, HostListener, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { AnimationCurves, AnimationDurations } from '@angular/material/core';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { KeyboardAnimationState } from '../../enums/keyboard-animation-state.enum';
// TODO: we can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
export var SHOW_ANIMATION = AnimationDurations.ENTERING + " " + AnimationCurves.DECELERATION_CURVE;
export var HIDE_ANIMATION = AnimationDurations.EXITING + " " + AnimationCurves.ACCELERATION_CURVE;
/**
 * Internal component that wraps user-provided keyboard content.
 * @docs-private
 */
var MatKeyboardContainerComponent = /** @class */ (function (_super) {
    __extends(MatKeyboardContainerComponent, _super);
    function MatKeyboardContainerComponent(_ngZone, _changeDetectorRef) {
        var _this = _super.call(this) || this;
        _this._ngZone = _ngZone;
        _this._changeDetectorRef = _changeDetectorRef;
        /** Whether the component has been destroyed. */
        _this._destroyed = false;
        /** The state of the keyboard animations. */
        _this._animationState = KeyboardAnimationState.Void;
        /** Subject for notifying that the keyboard has exited from view. */
        _this.onExit = new Subject();
        /** Subject for notifying that the keyboard has finished entering the view. */
        _this.onEnter = new Subject();
        _this.attrRole = 'alert';
        return _this;
    }
    MatKeyboardContainerComponent.prototype.onMousedown = function (event) {
        event.preventDefault();
    };
    /** Attach a component portal as content to this keyboard container. */
    MatKeyboardContainerComponent.prototype.attachComponentPortal = function (portal) {
        if (this._portalOutlet.hasAttached()) {
            throw Error('Attempting to attach keyboard content after content is already attached');
        }
        return this._portalOutlet.attachComponentPortal(portal);
    };
    // Attach a template portal as content to this keyboard container
    MatKeyboardContainerComponent.prototype.attachTemplatePortal = function () {
        throw Error('Not yet implemented');
    };
    /** Handle end of animations, updating the state of the keyboard. */
    MatKeyboardContainerComponent.prototype.onAnimationEnd = function (event) {
        var fromState = event.fromState, toState = event.toState;
        if ((toState === KeyboardAnimationState.Void && fromState !== KeyboardAnimationState.Void) || toState.startsWith('hidden')) {
            this._completeExit();
        }
        if (toState === KeyboardAnimationState.Visible) {
            // Note: we shouldn't use `this` inside the zone callback,
            // because it can cause a memory leak.
            var onEnter_1 = this.onEnter;
            this._ngZone.run(function () {
                onEnter_1.next();
                onEnter_1.complete();
            });
        }
    };
    /** Begin animation of keyboard entrance into view. */
    MatKeyboardContainerComponent.prototype.enter = function () {
        if (!this._destroyed) {
            this._animationState = KeyboardAnimationState.Visible;
            this._changeDetectorRef.detectChanges();
        }
    };
    /** Begin animation of the snack bar exiting from view. */
    MatKeyboardContainerComponent.prototype.exit = function () {
        this._animationState = KeyboardAnimationState.Hidden;
        return this.onExit;
    };
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     */
    MatKeyboardContainerComponent.prototype.ngOnDestroy = function () {
        this._destroyed = true;
        this._completeExit();
    };
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     */
    MatKeyboardContainerComponent.prototype._completeExit = function () {
        var _this = this;
        this._ngZone.onMicrotaskEmpty
            .asObservable()
            .pipe(first())
            .subscribe(function () {
            _this.onExit.next();
            _this.onExit.complete();
        });
    };
    MatKeyboardContainerComponent.ctorParameters = function () { return [
        { type: NgZone },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        ViewChild(CdkPortalOutlet, { static: true })
    ], MatKeyboardContainerComponent.prototype, "_portalOutlet", void 0);
    __decorate([
        HostBinding('@state')
    ], MatKeyboardContainerComponent.prototype, "_animationState", void 0);
    __decorate([
        HostBinding('attr.role')
    ], MatKeyboardContainerComponent.prototype, "attrRole", void 0);
    __decorate([
        HostListener('mousedown', ['$event'])
    ], MatKeyboardContainerComponent.prototype, "onMousedown", null);
    __decorate([
        HostListener('@state.done', ['$event'])
    ], MatKeyboardContainerComponent.prototype, "onAnimationEnd", null);
    MatKeyboardContainerComponent = __decorate([
        Component({
            selector: 'mat-keyboard-container',
            template: "<ng-template cdkPortalHost></ng-template>\r\n",
            changeDetection: ChangeDetectionStrategy.OnPush,
            preserveWhitespaces: false,
            // animations: [
            //   trigger('state', [
            //     state('visible', style({transform: 'translateY(0%)'})),
            //     transition('visible => hidden', animate(HIDE_ANIMATION)),
            //     transition('void => visible', animate(SHOW_ANIMATION)),
            //   ])
            // ]
            animations: [
                trigger('state', [
                    state("" + KeyboardAnimationState.Visible, style({ transform: 'translateY(0%)' })),
                ])
            ],
            styles: [":host{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);border-radius:2px;box-sizing:border-box;display:block;margin:0 auto;max-width:960px;min-width:568px}.cdk-high-contrast-active :host{border:1px solid}.cdk-high-contrast-active :host :host{border:1px solid}"]
        })
    ], MatKeyboardContainerComponent);
    return MatKeyboardContainerComponent;
}(BasePortalOutlet));
export { MatKeyboardContainerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQtY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItb25zY3JlZW4tbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2tleWJvYXJkLWNvbnRhaW5lci9rZXlib2FyZC1jb250YWluZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQTJCLEtBQUssRUFBRSxLQUFLLEVBQWMsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBbUIsTUFBTSxxQkFBcUIsQ0FBQztBQUN6RixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5SyxPQUFPLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDN0UsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFHbkYsNEVBQTRFO0FBQzVFLDJGQUEyRjtBQUMzRixNQUFNLENBQUMsSUFBTSxjQUFjLEdBQU0sa0JBQWtCLENBQUMsUUFBUSxTQUFJLGVBQWUsQ0FBQyxrQkFBb0IsQ0FBQztBQUNyRyxNQUFNLENBQUMsSUFBTSxjQUFjLEdBQU0sa0JBQWtCLENBQUMsT0FBTyxTQUFJLGVBQWUsQ0FBQyxrQkFBb0IsQ0FBQztBQUVwRzs7O0dBR0c7QUFzQkg7SUFBbUQsaURBQWdCO0lBeUJqRSx1Q0FBb0IsT0FBZSxFQUNmLGtCQUFxQztRQUR6RCxZQUVFLGlC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QVMsQ0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7d0VBQ047SUFJdkM7UUFEQyxXQUFXLENBQUMsUUFBUSxDQUFDOzBFQUNnRDtJQVN0RTtRQURDLFdBQVcsQ0FBQyxXQUFXLENBQUM7bUVBQ047SUFXbkI7UUFEQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7b0VBR3JDO0lBa0JEO1FBREMsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3VFQWtCdkM7SUFwRVUsNkJBQTZCO1FBckJ6QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsd0JBQXdCO1lBQ2xDLHlEQUFrRDtZQUVsRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtZQUMvQyxtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLGdCQUFnQjtZQUNoQix1QkFBdUI7WUFDdkIsOERBQThEO1lBQzlELGdFQUFnRTtZQUNoRSw4REFBOEQ7WUFDOUQsT0FBTztZQUNQLElBQUk7WUFDSixVQUFVLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLE9BQU8sRUFBRTtvQkFDZixLQUFLLENBQUMsS0FBRyxzQkFBc0IsQ0FBQyxPQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQztpQkFHbkYsQ0FBQzthQUNIOztTQUNGLENBQUM7T0FDVyw2QkFBNkIsQ0F5R3pDO0lBQUQsb0NBQUM7Q0FBQSxBQXpHRCxDQUFtRCxnQkFBZ0IsR0F5R2xFO1NBekdZLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIEFuaW1hdGlvbkV2ZW50LCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHsgQmFzZVBvcnRhbE91dGxldCwgQ2RrUG9ydGFsT3V0bGV0LCBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcclxuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIENvbXBvbmVudFJlZiwgRW1iZWRkZWRWaWV3UmVmLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyLCBOZ1pvbmUsIE9uRGVzdHJveSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFuaW1hdGlvbkN1cnZlcywgQW5pbWF0aW9uRHVyYXRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IE1hdEtleWJvYXJkQ29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlncy9rZXlib2FyZC5jb25maWcnO1xyXG5pbXBvcnQgeyBLZXlib2FyZEFuaW1hdGlvblN0YXRlIH0gZnJvbSAnLi4vLi4vZW51bXMva2V5Ym9hcmQtYW5pbWF0aW9uLXN0YXRlLmVudW0nO1xyXG5pbXBvcnQgeyBLZXlib2FyZEFuaW1hdGlvblRyYW5zaXRpb24gfSBmcm9tICcuLi8uLi9lbnVtcy9rZXlib2FyZC1hbmltYXRpb24tdHJhbnNpdGlvbi5lbnVtJztcclxuXHJcbi8vIFRPRE86IHdlIGNhbid0IHVzZSBjb25zdGFudHMgZnJvbSBhbmltYXRpb24udHMgaGVyZSBiZWNhdXNlIHlvdSBjYW4ndCB1c2VcclxuLy8gYSB0ZXh0IGludGVycG9sYXRpb24gaW4gYW55dGhpbmcgdGhhdCBpcyBhbmFseXplZCBzdGF0aWNhbGx5IHdpdGggbmdjIChmb3IgQW9UIGNvbXBpbGUpLlxyXG5leHBvcnQgY29uc3QgU0hPV19BTklNQVRJT04gPSBgJHtBbmltYXRpb25EdXJhdGlvbnMuRU5URVJJTkd9ICR7QW5pbWF0aW9uQ3VydmVzLkRFQ0VMRVJBVElPTl9DVVJWRX1gO1xyXG5leHBvcnQgY29uc3QgSElERV9BTklNQVRJT04gPSBgJHtBbmltYXRpb25EdXJhdGlvbnMuRVhJVElOR30gJHtBbmltYXRpb25DdXJ2ZXMuQUNDRUxFUkFUSU9OX0NVUlZFfWA7XHJcblxyXG4vKipcclxuICogSW50ZXJuYWwgY29tcG9uZW50IHRoYXQgd3JhcHMgdXNlci1wcm92aWRlZCBrZXlib2FyZCBjb250ZW50LlxyXG4gKiBAZG9jcy1wcml2YXRlXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ21hdC1rZXlib2FyZC1jb250YWluZXInLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9rZXlib2FyZC1jb250YWluZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2tleWJvYXJkLWNvbnRhaW5lci5jb21wb25lbnQuc2NzcyddLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxyXG4gIC8vIGFuaW1hdGlvbnM6IFtcclxuICAvLyAgIHRyaWdnZXIoJ3N0YXRlJywgW1xyXG4gIC8vICAgICBzdGF0ZSgndmlzaWJsZScsIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDAlKSd9KSksXHJcbiAgLy8gICAgIHRyYW5zaXRpb24oJ3Zpc2libGUgPT4gaGlkZGVuJywgYW5pbWF0ZShISURFX0FOSU1BVElPTikpLFxyXG4gIC8vICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IHZpc2libGUnLCBhbmltYXRlKFNIT1dfQU5JTUFUSU9OKSksXHJcbiAgLy8gICBdKVxyXG4gIC8vIF1cclxuICBhbmltYXRpb25zOiBbXHJcbiAgICB0cmlnZ2VyKCdzdGF0ZScsIFtcclxuICAgICAgc3RhdGUoYCR7S2V5Ym9hcmRBbmltYXRpb25TdGF0ZS5WaXNpYmxlfWAsIHN0eWxlKHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwJSknIH0pKSxcclxuICAgICAgLy8gdHJhbnNpdGlvbihgJHtLZXlib2FyZEFuaW1hdGlvblRyYW5zaXRpb24uSGlkZX1gLCBhbmltYXRlKEhJREVfQU5JTUFUSU9OKSksXHJcbiAgICAgIC8vIHRyYW5zaXRpb24oYCR7S2V5Ym9hcmRBbmltYXRpb25UcmFuc2l0aW9uLlNob3d9YCwgYW5pbWF0ZShTSE9XX0FOSU1BVElPTikpXHJcbiAgICBdKVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkQ29udGFpbmVyQ29tcG9uZW50IGV4dGVuZHMgQmFzZVBvcnRhbE91dGxldCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XHJcblxyXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gZGVzdHJveWVkLiAqL1xyXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IGZhbHNlO1xyXG5cclxuICAvKiogVGhlIHBvcnRhbCBvdXRsZXQgaW5zaWRlIG9mIHRoaXMgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIGtleWJvYXJkIGNvbnRlbnQgd2lsbCBiZSBsb2FkZWQuICovXHJcbiAgQFZpZXdDaGlsZChDZGtQb3J0YWxPdXRsZXQsIHsgc3RhdGljOiB0cnVlIH0pXHJcbiAgcHJpdmF0ZSBfcG9ydGFsT3V0bGV0OiBDZGtQb3J0YWxPdXRsZXQ7XHJcblxyXG4gIC8qKiBUaGUgc3RhdGUgb2YgdGhlIGtleWJvYXJkIGFuaW1hdGlvbnMuICovXHJcbiAgQEhvc3RCaW5kaW5nKCdAc3RhdGUnKVxyXG4gIF9hbmltYXRpb25TdGF0ZTogS2V5Ym9hcmRBbmltYXRpb25TdGF0ZSA9IEtleWJvYXJkQW5pbWF0aW9uU3RhdGUuVm9pZDtcclxuXHJcbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSBrZXlib2FyZCBoYXMgZXhpdGVkIGZyb20gdmlldy4gKi9cclxuICBvbkV4aXQ6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XHJcblxyXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhhdCB0aGUga2V5Ym9hcmQgaGFzIGZpbmlzaGVkIGVudGVyaW5nIHRoZSB2aWV3LiAqL1xyXG4gIG9uRW50ZXI6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcclxuICBhdHRyUm9sZSA9ICdhbGVydCc7XHJcblxyXG4gIC8vIHRoZSBrZXlib2FyZCBjb25maWd1cmF0aW9uXHJcbiAga2V5Ym9hcmRDb25maWc6IE1hdEtleWJvYXJkQ29uZmlnO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKVxyXG4gIG9uTW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEF0dGFjaCBhIGNvbXBvbmVudCBwb3J0YWwgYXMgY29udGVudCB0byB0aGlzIGtleWJvYXJkIGNvbnRhaW5lci4gKi9cclxuICBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD4ge1xyXG4gICAgaWYgKHRoaXMuX3BvcnRhbE91dGxldC5oYXNBdHRhY2hlZCgpKSB7XHJcbiAgICAgIHRocm93IEVycm9yKCdBdHRlbXB0aW5nIHRvIGF0dGFjaCBrZXlib2FyZCBjb250ZW50IGFmdGVyIGNvbnRlbnQgaXMgYWxyZWFkeSBhdHRhY2hlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9wb3J0YWxPdXRsZXQuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XHJcbiAgfVxyXG5cclxuICAvLyBBdHRhY2ggYSB0ZW1wbGF0ZSBwb3J0YWwgYXMgY29udGVudCB0byB0aGlzIGtleWJvYXJkIGNvbnRhaW5lclxyXG4gIGF0dGFjaFRlbXBsYXRlUG9ydGFsKCk6IEVtYmVkZGVkVmlld1JlZjxhbnk+IHtcclxuICAgIHRocm93IEVycm9yKCdOb3QgeWV0IGltcGxlbWVudGVkJyk7XHJcbiAgfVxyXG5cclxuICAvKiogSGFuZGxlIGVuZCBvZiBhbmltYXRpb25zLCB1cGRhdGluZyB0aGUgc3RhdGUgb2YgdGhlIGtleWJvYXJkLiAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ0BzdGF0ZS5kb25lJywgWyckZXZlbnQnXSlcclxuICBvbkFuaW1hdGlvbkVuZChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcclxuICAgIGNvbnN0IHsgZnJvbVN0YXRlLCB0b1N0YXRlIH0gPSBldmVudDtcclxuXHJcbiAgICBpZiAoKHRvU3RhdGUgPT09IEtleWJvYXJkQW5pbWF0aW9uU3RhdGUuVm9pZCAmJiBmcm9tU3RhdGUgIT09IEtleWJvYXJkQW5pbWF0aW9uU3RhdGUuVm9pZCkgfHwgdG9TdGF0ZS5zdGFydHNXaXRoKCdoaWRkZW4nKSkge1xyXG4gICAgICB0aGlzLl9jb21wbGV0ZUV4aXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodG9TdGF0ZSA9PT0gS2V5Ym9hcmRBbmltYXRpb25TdGF0ZS5WaXNpYmxlKSB7XHJcbiAgICAgIC8vIE5vdGU6IHdlIHNob3VsZG4ndCB1c2UgYHRoaXNgIGluc2lkZSB0aGUgem9uZSBjYWxsYmFjayxcclxuICAgICAgLy8gYmVjYXVzZSBpdCBjYW4gY2F1c2UgYSBtZW1vcnkgbGVhay5cclxuICAgICAgY29uc3Qgb25FbnRlciA9IHRoaXMub25FbnRlcjtcclxuXHJcbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xyXG4gICAgICAgIG9uRW50ZXIubmV4dCgpO1xyXG4gICAgICAgIG9uRW50ZXIuY29tcGxldGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIGtleWJvYXJkIGVudHJhbmNlIGludG8gdmlldy4gKi9cclxuICBlbnRlcigpIHtcclxuICAgIGlmICghdGhpcy5fZGVzdHJveWVkKSB7XHJcbiAgICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gS2V5Ym9hcmRBbmltYXRpb25TdGF0ZS5WaXNpYmxlO1xyXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogQmVnaW4gYW5pbWF0aW9uIG9mIHRoZSBzbmFjayBiYXIgZXhpdGluZyBmcm9tIHZpZXcuICovXHJcbiAgZXhpdCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcclxuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gS2V5Ym9hcmRBbmltYXRpb25TdGF0ZS5IaWRkZW47XHJcbiAgICByZXR1cm4gdGhpcy5vbkV4aXQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYWtlcyBzdXJlIHRoZSBleGl0IGNhbGxiYWNrcyBoYXZlIGJlZW4gaW52b2tlZCB3aGVuIHRoZSBlbGVtZW50IGlzIGRlc3Ryb3llZC5cclxuICAgKi9cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB0aGlzLl9jb21wbGV0ZUV4aXQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFdhaXRzIGZvciB0aGUgem9uZSB0byBzZXR0bGUgYmVmb3JlIHJlbW92aW5nIHRoZSBlbGVtZW50LiBIZWxwcyBwcmV2ZW50XHJcbiAgICogZXJyb3JzIHdoZXJlIHdlIGVuZCB1cCByZW1vdmluZyBhbiBlbGVtZW50IHdoaWNoIGlzIGluIHRoZSBtaWRkbGUgb2YgYW4gYW5pbWF0aW9uLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2NvbXBsZXRlRXhpdCgpIHtcclxuICAgIHRoaXMuX25nWm9uZS5vbk1pY3JvdGFza0VtcHR5XHJcbiAgICAgIC5hc09ic2VydmFibGUoKVxyXG4gICAgICAucGlwZShmaXJzdCgpKVxyXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLm9uRXhpdC5uZXh0KCk7XHJcbiAgICAgICAgdGhpcy5vbkV4aXQuY29tcGxldGUoKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==