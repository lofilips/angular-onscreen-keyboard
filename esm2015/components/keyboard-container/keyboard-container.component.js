import { __decorate } from "tslib";
import { state, style, trigger } from '@angular/animations';
import { BasePortalOutlet, CdkPortalOutlet } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, EmbeddedViewRef, HostBinding, HostListener, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { AnimationCurves, AnimationDurations } from '@angular/material/core';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { KeyboardAnimationState } from '../../enums/keyboard-animation-state.enum';
// TODO: we can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
export const SHOW_ANIMATION = `${AnimationDurations.ENTERING} ${AnimationCurves.DECELERATION_CURVE}`;
export const HIDE_ANIMATION = `${AnimationDurations.EXITING} ${AnimationCurves.ACCELERATION_CURVE}`;
/**
 * Internal component that wraps user-provided keyboard content.
 * @docs-private
 */
let MatKeyboardContainerComponent = class MatKeyboardContainerComponent extends BasePortalOutlet {
    constructor(_ngZone, _changeDetectorRef) {
        super();
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        /** Whether the component has been destroyed. */
        this._destroyed = false;
        /** The state of the keyboard animations. */
        this._animationState = KeyboardAnimationState.Void;
        /** Subject for notifying that the keyboard has exited from view. */
        this.onExit = new Subject();
        /** Subject for notifying that the keyboard has finished entering the view. */
        this.onEnter = new Subject();
        this.attrRole = 'alert';
    }
    onMousedown(event) {
        event.preventDefault();
    }
    /** Attach a component portal as content to this keyboard container. */
    attachComponentPortal(portal) {
        if (this._portalOutlet.hasAttached()) {
            throw Error('Attempting to attach keyboard content after content is already attached');
        }
        return this._portalOutlet.attachComponentPortal(portal);
    }
    // Attach a template portal as content to this keyboard container
    attachTemplatePortal() {
        throw Error('Not yet implemented');
    }
    /** Handle end of animations, updating the state of the keyboard. */
    onAnimationEnd(event) {
        const { fromState, toState } = event;
        if ((toState === KeyboardAnimationState.Void && fromState !== KeyboardAnimationState.Void) || toState.startsWith('hidden')) {
            this._completeExit();
        }
        if (toState === KeyboardAnimationState.Visible) {
            // Note: we shouldn't use `this` inside the zone callback,
            // because it can cause a memory leak.
            const onEnter = this.onEnter;
            this._ngZone.run(() => {
                onEnter.next();
                onEnter.complete();
            });
        }
    }
    /** Begin animation of keyboard entrance into view. */
    enter() {
        if (!this._destroyed) {
            this._animationState = KeyboardAnimationState.Visible;
            this._changeDetectorRef.detectChanges();
        }
    }
    /** Begin animation of the snack bar exiting from view. */
    exit() {
        this._animationState = KeyboardAnimationState.Hidden;
        return this.onExit;
    }
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     */
    ngOnDestroy() {
        this._destroyed = true;
        this._completeExit();
    }
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     */
    _completeExit() {
        this._ngZone.onMicrotaskEmpty
            .asObservable()
            .pipe(first())
            .subscribe(() => {
            this.onExit.next();
            this.onExit.complete();
        });
    }
};
MatKeyboardContainerComponent.ctorParameters = () => [
    { type: NgZone },
    { type: ChangeDetectorRef }
];
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
                state(`${KeyboardAnimationState.Visible}`, style({ transform: 'translateY(0%)' })),
            ])
        ],
        styles: [":host{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);border-radius:2px;box-sizing:border-box;display:block;margin:0 auto;max-width:960px;min-width:568px}.cdk-high-contrast-active :host{border:1px solid}.cdk-high-contrast-active :host :host{border:1px solid}"]
    })
], MatKeyboardContainerComponent);
export { MatKeyboardContainerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQtY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItb25zY3JlZW4tbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2tleWJvYXJkLWNvbnRhaW5lci9rZXlib2FyZC1jb250YWluZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQTJCLEtBQUssRUFBRSxLQUFLLEVBQWMsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBbUIsTUFBTSxxQkFBcUIsQ0FBQztBQUN6RixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5SyxPQUFPLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDN0UsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFHbkYsNEVBQTRFO0FBQzVFLDJGQUEyRjtBQUMzRixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLElBQUksZUFBZSxDQUFDLGtCQUFrQixFQUFFLENBQUM7QUFDckcsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxJQUFJLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBRXBHOzs7R0FHRztBQXNCSCxJQUFhLDZCQUE2QixHQUExQyxNQUFhLDZCQUE4QixTQUFRLGdC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TUFBTTtZQUNLLGlCQUFpQjs7QUFuQnpEO0lBREMsU0FBUyxDQUFDLGVBQWUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztvRUFDTjtBQUl2QztJQURDLFdBQVcsQ0FBQyxRQUFRLENBQUM7c0VBQ2dEO0FBU3RFO0lBREMsV0FBVyxDQUFDLFdBQVcsQ0FBQzsrREFDTjtBQVduQjtJQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnRUFHckM7QUFrQkQ7SUFEQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7bUVBa0J2QztBQXBFVSw2QkFBNkI7SUFyQnpDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSx3QkFBd0I7UUFDbEMseURBQWtEO1FBRWxELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1FBQy9DLG1CQUFtQixFQUFFLEtBQUs7UUFDMUIsZ0JBQWdCO1FBQ2hCLHVCQUF1QjtRQUN2Qiw4REFBOEQ7UUFDOUQsZ0VBQWdFO1FBQ2hFLDhEQUE4RDtRQUM5RCxPQUFPO1FBQ1AsSUFBSTtRQUNKLFVBQVUsRUFBRTtZQUNWLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2YsS0FBSyxDQUFDLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQzthQUduRixDQUFDO1NBQ0g7O0tBQ0YsQ0FBQztHQUNXLDZCQUE2QixDQXlHekM7U0F6R1ksNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYW5pbWF0ZSwgQW5pbWF0aW9uRXZlbnQsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBCYXNlUG9ydGFsT3V0bGV0LCBDZGtQb3J0YWxPdXRsZXQsIENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xyXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgQ29tcG9uZW50UmVmLCBFbWJlZGRlZFZpZXdSZWYsIEhvc3RCaW5kaW5nLCBIb3N0TGlzdGVuZXIsIE5nWm9uZSwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uQ3VydmVzLCBBbmltYXRpb25EdXJhdGlvbnMgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRDb25maWcgfSBmcm9tICcuLi8uLi9jb25maWdzL2tleWJvYXJkLmNvbmZpZyc7XHJcbmltcG9ydCB7IEtleWJvYXJkQW5pbWF0aW9uU3RhdGUgfSBmcm9tICcuLi8uLi9lbnVtcy9rZXlib2FyZC1hbmltYXRpb24tc3RhdGUuZW51bSc7XHJcbmltcG9ydCB7IEtleWJvYXJkQW5pbWF0aW9uVHJhbnNpdGlvbiB9IGZyb20gJy4uLy4uL2VudW1zL2tleWJvYXJkLWFuaW1hdGlvbi10cmFuc2l0aW9uLmVudW0nO1xyXG5cclxuLy8gVE9ETzogd2UgY2FuJ3QgdXNlIGNvbnN0YW50cyBmcm9tIGFuaW1hdGlvbi50cyBoZXJlIGJlY2F1c2UgeW91IGNhbid0IHVzZVxyXG4vLyBhIHRleHQgaW50ZXJwb2xhdGlvbiBpbiBhbnl0aGluZyB0aGF0IGlzIGFuYWx5emVkIHN0YXRpY2FsbHkgd2l0aCBuZ2MgKGZvciBBb1QgY29tcGlsZSkuXHJcbmV4cG9ydCBjb25zdCBTSE9XX0FOSU1BVElPTiA9IGAke0FuaW1hdGlvbkR1cmF0aW9ucy5FTlRFUklOR30gJHtBbmltYXRpb25DdXJ2ZXMuREVDRUxFUkFUSU9OX0NVUlZFfWA7XHJcbmV4cG9ydCBjb25zdCBISURFX0FOSU1BVElPTiA9IGAke0FuaW1hdGlvbkR1cmF0aW9ucy5FWElUSU5HfSAke0FuaW1hdGlvbkN1cnZlcy5BQ0NFTEVSQVRJT05fQ1VSVkV9YDtcclxuXHJcbi8qKlxyXG4gKiBJbnRlcm5hbCBjb21wb25lbnQgdGhhdCB3cmFwcyB1c2VyLXByb3ZpZGVkIGtleWJvYXJkIGNvbnRlbnQuXHJcbiAqIEBkb2NzLXByaXZhdGVcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWF0LWtleWJvYXJkLWNvbnRhaW5lcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2tleWJvYXJkLWNvbnRhaW5lci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4va2V5Ym9hcmQtY29udGFpbmVyLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXHJcbiAgLy8gYW5pbWF0aW9uczogW1xyXG4gIC8vICAgdHJpZ2dlcignc3RhdGUnLCBbXHJcbiAgLy8gICAgIHN0YXRlKCd2aXNpYmxlJywgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCUpJ30pKSxcclxuICAvLyAgICAgdHJhbnNpdGlvbigndmlzaWJsZSA9PiBoaWRkZW4nLCBhbmltYXRlKEhJREVfQU5JTUFUSU9OKSksXHJcbiAgLy8gICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gdmlzaWJsZScsIGFuaW1hdGUoU0hPV19BTklNQVRJT04pKSxcclxuICAvLyAgIF0pXHJcbiAgLy8gXVxyXG4gIGFuaW1hdGlvbnM6IFtcclxuICAgIHRyaWdnZXIoJ3N0YXRlJywgW1xyXG4gICAgICBzdGF0ZShgJHtLZXlib2FyZEFuaW1hdGlvblN0YXRlLlZpc2libGV9YCwgc3R5bGUoeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDAlKScgfSkpLFxyXG4gICAgICAvLyB0cmFuc2l0aW9uKGAke0tleWJvYXJkQW5pbWF0aW9uVHJhbnNpdGlvbi5IaWRlfWAsIGFuaW1hdGUoSElERV9BTklNQVRJT04pKSxcclxuICAgICAgLy8gdHJhbnNpdGlvbihgJHtLZXlib2FyZEFuaW1hdGlvblRyYW5zaXRpb24uU2hvd31gLCBhbmltYXRlKFNIT1dfQU5JTUFUSU9OKSlcclxuICAgIF0pXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTWF0S2V5Ym9hcmRDb250YWluZXJDb21wb25lbnQgZXh0ZW5kcyBCYXNlUG9ydGFsT3V0bGV0IGltcGxlbWVudHMgT25EZXN0cm95IHtcclxuXHJcbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXHJcbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG4gIC8qKiBUaGUgcG9ydGFsIG91dGxldCBpbnNpZGUgb2YgdGhpcyBjb250YWluZXIgaW50byB3aGljaCB0aGUga2V5Ym9hcmQgY29udGVudCB3aWxsIGJlIGxvYWRlZC4gKi9cclxuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwgeyBzdGF0aWM6IHRydWUgfSlcclxuICBwcml2YXRlIF9wb3J0YWxPdXRsZXQ6IENka1BvcnRhbE91dGxldDtcclxuXHJcbiAgLyoqIFRoZSBzdGF0ZSBvZiB0aGUga2V5Ym9hcmQgYW5pbWF0aW9ucy4gKi9cclxuICBASG9zdEJpbmRpbmcoJ0BzdGF0ZScpXHJcbiAgX2FuaW1hdGlvblN0YXRlOiBLZXlib2FyZEFuaW1hdGlvblN0YXRlID0gS2V5Ym9hcmRBbmltYXRpb25TdGF0ZS5Wb2lkO1xyXG5cclxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoYXQgdGhlIGtleWJvYXJkIGhhcyBleGl0ZWQgZnJvbSB2aWV3LiAqL1xyXG4gIG9uRXhpdDogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcclxuXHJcbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGF0IHRoZSBrZXlib2FyZCBoYXMgZmluaXNoZWQgZW50ZXJpbmcgdGhlIHZpZXcuICovXHJcbiAgb25FbnRlcjogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKVxyXG4gIGF0dHJSb2xlID0gJ2FsZXJ0JztcclxuXHJcbiAgLy8gdGhlIGtleWJvYXJkIGNvbmZpZ3VyYXRpb25cclxuICBrZXlib2FyZENvbmZpZzogTWF0S2V5Ym9hcmRDb25maWc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX25nWm9uZTogTmdab25lLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfVxyXG5cclxuICAvKiogQXR0YWNoIGEgY29tcG9uZW50IHBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMga2V5Ym9hcmQgY29udGFpbmVyLiAqL1xyXG4gIGF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUPik6IENvbXBvbmVudFJlZjxUPiB7XHJcbiAgICBpZiAodGhpcy5fcG9ydGFsT3V0bGV0Lmhhc0F0dGFjaGVkKCkpIHtcclxuICAgICAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRpbmcgdG8gYXR0YWNoIGtleWJvYXJkIGNvbnRlbnQgYWZ0ZXIgY29udGVudCBpcyBhbHJlYWR5IGF0dGFjaGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3BvcnRhbE91dGxldC5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcclxuICB9XHJcblxyXG4gIC8vIEF0dGFjaCBhIHRlbXBsYXRlIHBvcnRhbCBhcyBjb250ZW50IHRvIHRoaXMga2V5Ym9hcmQgY29udGFpbmVyXHJcbiAgYXR0YWNoVGVtcGxhdGVQb3J0YWwoKTogRW1iZWRkZWRWaWV3UmVmPGFueT4ge1xyXG4gICAgdGhyb3cgRXJyb3IoJ05vdCB5ZXQgaW1wbGVtZW50ZWQnKTtcclxuICB9XHJcblxyXG4gIC8qKiBIYW5kbGUgZW5kIG9mIGFuaW1hdGlvbnMsIHVwZGF0aW5nIHRoZSBzdGF0ZSBvZiB0aGUga2V5Ym9hcmQuICovXHJcbiAgQEhvc3RMaXN0ZW5lcignQHN0YXRlLmRvbmUnLCBbJyRldmVudCddKVxyXG4gIG9uQW5pbWF0aW9uRW5kKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xyXG4gICAgY29uc3QgeyBmcm9tU3RhdGUsIHRvU3RhdGUgfSA9IGV2ZW50O1xyXG5cclxuICAgIGlmICgodG9TdGF0ZSA9PT0gS2V5Ym9hcmRBbmltYXRpb25TdGF0ZS5Wb2lkICYmIGZyb21TdGF0ZSAhPT0gS2V5Ym9hcmRBbmltYXRpb25TdGF0ZS5Wb2lkKSB8fCB0b1N0YXRlLnN0YXJ0c1dpdGgoJ2hpZGRlbicpKSB7XHJcbiAgICAgIHRoaXMuX2NvbXBsZXRlRXhpdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0b1N0YXRlID09PSBLZXlib2FyZEFuaW1hdGlvblN0YXRlLlZpc2libGUpIHtcclxuICAgICAgLy8gTm90ZTogd2Ugc2hvdWxkbid0IHVzZSBgdGhpc2AgaW5zaWRlIHRoZSB6b25lIGNhbGxiYWNrLFxyXG4gICAgICAvLyBiZWNhdXNlIGl0IGNhbiBjYXVzZSBhIG1lbW9yeSBsZWFrLlxyXG4gICAgICBjb25zdCBvbkVudGVyID0gdGhpcy5vbkVudGVyO1xyXG5cclxuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgb25FbnRlci5uZXh0KCk7XHJcbiAgICAgICAgb25FbnRlci5jb21wbGV0ZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBCZWdpbiBhbmltYXRpb24gb2Yga2V5Ym9hcmQgZW50cmFuY2UgaW50byB2aWV3LiAqL1xyXG4gIGVudGVyKCkge1xyXG4gICAgaWYgKCF0aGlzLl9kZXN0cm95ZWQpIHtcclxuICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSBLZXlib2FyZEFuaW1hdGlvblN0YXRlLlZpc2libGU7XHJcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBCZWdpbiBhbmltYXRpb24gb2YgdGhlIHNuYWNrIGJhciBleGl0aW5nIGZyb20gdmlldy4gKi9cclxuICBleGl0KCk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSBLZXlib2FyZEFuaW1hdGlvblN0YXRlLkhpZGRlbjtcclxuICAgIHJldHVybiB0aGlzLm9uRXhpdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2VzIHN1cmUgdGhlIGV4aXQgY2FsbGJhY2tzIGhhdmUgYmVlbiBpbnZva2VkIHdoZW4gdGhlIGVsZW1lbnQgaXMgZGVzdHJveWVkLlxyXG4gICAqL1xyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgIHRoaXMuX2NvbXBsZXRlRXhpdCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV2FpdHMgZm9yIHRoZSB6b25lIHRvIHNldHRsZSBiZWZvcmUgcmVtb3ZpbmcgdGhlIGVsZW1lbnQuIEhlbHBzIHByZXZlbnRcclxuICAgKiBlcnJvcnMgd2hlcmUgd2UgZW5kIHVwIHJlbW92aW5nIGFuIGVsZW1lbnQgd2hpY2ggaXMgaW4gdGhlIG1pZGRsZSBvZiBhbiBhbmltYXRpb24uXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfY29tcGxldGVFeGl0KCkge1xyXG4gICAgdGhpcy5fbmdab25lLm9uTWljcm90YXNrRW1wdHlcclxuICAgICAgLmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgIC5waXBlKGZpcnN0KCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMub25FeGl0Lm5leHQoKTtcclxuICAgICAgICB0aGlzLm9uRXhpdC5jb21wbGV0ZSgpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19