import { __decorate, __param } from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Inject, LOCALE_ID, ViewChildren } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KEYBOARD_ICONS } from '../../configs/keyboard-icons.config';
import { KeyboardClassKey } from '../../enums/keyboard-class-key.enum';
import { KeyboardModifier } from '../../enums/keyboard-modifier.enum';
import { MatKeyboardService } from '../../services/keyboard.service';
import { MatKeyboardKeyComponent } from '../keyboard-key/keyboard-key.component';
/**
 * A component used to open as the default keyboard, matching material spec.
 * This should only be used internally by the keyboard service.
 */
let MatKeyboardComponent = class MatKeyboardComponent {
    // inject dependencies
    constructor(_locale, _keyboardService) {
        this._locale = _locale;
        this._keyboardService = _keyboardService;
        this._darkTheme = new BehaviorSubject(false);
        this._isDebug = new BehaviorSubject(false);
        this._inputInstance$ = new BehaviorSubject(null);
        this._modifier = KeyboardModifier.None;
        this._capsLocked = false;
        this._icons = KEYBOARD_ICONS;
        this.cssClass = true;
        this.keyClick = new EventEmitter();
        this.bkspClick = new EventEmitter();
        this.enterClick = new EventEmitter();
        this.capsClick = new EventEmitter();
        this.altClick = new EventEmitter();
        this.shiftClick = new EventEmitter();
        this.spaceClick = new EventEmitter();
    }
    // returns an observable of the input instance
    get inputInstance() {
        return this._inputInstance$.asObservable();
    }
    set icons(icons) {
        Object.assign(this._icons, icons);
    }
    set darkTheme(darkTheme) {
        if (this._darkTheme.getValue() !== darkTheme) {
            this._darkTheme.next(darkTheme);
        }
    }
    set isDebug(isDebug) {
        if (this._isDebug.getValue() !== isDebug) {
            this._isDebug.next(isDebug);
        }
    }
    get darkTheme$() {
        return this._darkTheme.asObservable();
    }
    get isDebug$() {
        return this._isDebug.asObservable();
    }
    setInputInstance(inputInstance) {
        this._inputInstance$.next(inputInstance);
    }
    attachControl(control) {
        this.control = control;
    }
    ngOnInit() {
        // set a fallback using the locale
        if (!this.layout) {
            this.locale = this._keyboardService.mapLocale(this._locale) ? this._locale : 'en-US';
            this.layout = this._keyboardService.getLayoutForLocale(this.locale);
        }
    }
    /**
     * dismisses the keyboard
     */
    dismiss() {
        this.keyboardRef.dismiss();
    }
    /**
     * checks if a given key is currently pressed
     * @param key
     * @param
     */
    isActive(key) {
        const modifiedKey = this.getModifiedKey(key);
        const isActiveCapsLock = modifiedKey === KeyboardClassKey.Caps && this._capsLocked;
        const isActiveModifier = modifiedKey === KeyboardModifier[this._modifier];
        return isActiveCapsLock || isActiveModifier;
    }
    // retrieves modified key
    getModifiedKey(key) {
        let modifier = this._modifier;
        // `CapsLock` inverts the meaning of `Shift`
        if (this._capsLocked) {
            modifier = this._invertShiftModifier(this._modifier);
        }
        return key[modifier];
    }
    // retrieves icon for given key
    getKeyIcon(key) {
        return this._icons[key[KeyboardModifier.None]];
    }
    /**
     * listens to users keyboard inputs to simulate on virtual keyboard, too
     * @param event
     */
    onKeyDown(event) {
        // 'activate' corresponding key
        this._keys
            .filter((key) => key.key === event.key)
            .forEach((key) => {
            key.pressed = true;
        });
        // simulate modifier press
        if (event.key === KeyboardClassKey.Caps) {
            this.onCapsClick(event.getModifierState(KeyboardClassKey.Caps));
        }
        if (event.key === KeyboardClassKey.Alt && this._modifier !== KeyboardModifier.Alt && this._modifier !== KeyboardModifier.ShiftAlt) {
            this.onAltClick();
        }
        if (event.key === KeyboardClassKey.Shift && this._modifier !== KeyboardModifier.Shift && this._modifier !== KeyboardModifier.ShiftAlt) {
            this.onShiftClick(event);
        }
    }
    /**
     * listens to users keyboard inputs to simulate on virtual keyboard, too
     * @param event
     */
    onKeyUp(event) {
        // 'deactivate' corresponding key
        this._keys
            .filter((key) => key.key === event.key)
            .forEach((key) => {
            key.pressed = false;
        });
        // simulate modifier release
        if (event.key === KeyboardClassKey.Alt && (this._modifier === KeyboardModifier.Alt || this._modifier === KeyboardModifier.ShiftAlt)) {
            this.onAltClick();
        }
        if (event.key === KeyboardClassKey.Shift && (this._modifier === KeyboardModifier.Shift || this._modifier === KeyboardModifier.ShiftAlt)) {
            this.onShiftClick(event);
        }
    }
    /**
     * bubbles event if submit is potentially triggered
     */
    onEnterClick(event) {
        // notify subscribers
        this.enterClick.next(event);
    }
    /**
     * simulates clicking `CapsLock` key
     * @param targetState
     */
    onCapsClick(event, targetState = !this._capsLocked) {
        // not implemented
        this._capsLocked = targetState;
        // notify subscribers
        this.capsClick.next(event);
    }
    /*
     * non-modifier keys are clicked
     */
    onKeyClick(event) {
        if (this._modifier === KeyboardModifier.Shift || this._modifier === KeyboardModifier.ShiftAlt) {
            this._modifier = this._invertShiftModifier(this._modifier);
        }
        if (this._modifier === KeyboardModifier.Alt || this._modifier === KeyboardModifier.ShiftAlt) {
            this._modifier = this._invertAltModifier(this._modifier);
        }
        this.keyClick.next(event);
    }
    /**
     * simulates clicking `Alt` key
     */
    onAltClick() {
        // invert modifier meaning
        this._modifier = this._invertAltModifier(this._modifier);
        // notify subscribers
        this.altClick.next();
    }
    /**
     * simulates clicking `Shift` key
     */
    onShiftClick(event) {
        // invert modifier meaning
        this._modifier = this._invertShiftModifier(this._modifier);
        // notify subscribers
        this.shiftClick.next(event);
    }
    onBkspClick(event) {
        this.bkspClick.next(event);
    }
    onSpaceClick(event) {
        this.spaceClick.next(event);
    }
    _invertAltModifier(modifier) {
        switch (modifier) {
            case KeyboardModifier.None:
                return KeyboardModifier.Alt;
            case KeyboardModifier.Shift:
                return KeyboardModifier.ShiftAlt;
            case KeyboardModifier.ShiftAlt:
                return KeyboardModifier.Shift;
            case KeyboardModifier.Alt:
                return KeyboardModifier.None;
        }
    }
    _invertShiftModifier(modifier) {
        switch (modifier) {
            case KeyboardModifier.None:
                return KeyboardModifier.Shift;
            case KeyboardModifier.Alt:
                return KeyboardModifier.ShiftAlt;
            case KeyboardModifier.ShiftAlt:
                return KeyboardModifier.Alt;
            case KeyboardModifier.Shift:
                return KeyboardModifier.None;
        }
    }
};
MatKeyboardComponent.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
    { type: MatKeyboardService }
];
__decorate([
    ViewChildren(MatKeyboardKeyComponent)
], MatKeyboardComponent.prototype, "_keys", void 0);
__decorate([
    HostBinding('class.mat-keyboard')
], MatKeyboardComponent.prototype, "cssClass", void 0);
__decorate([
    HostListener('document:keydown', ['$event'])
], MatKeyboardComponent.prototype, "onKeyDown", null);
__decorate([
    HostListener('document:keyup', ['$event'])
], MatKeyboardComponent.prototype, "onKeyUp", null);
MatKeyboardComponent = __decorate([
    Component({
        selector: 'mat-keyboard',
        template: "<div class=\"mat-keyboard-wrapper\"\r\n     [class.dark-theme]=\"darkTheme$ | async\"\r\n     [class.debug]=\"isDebug$ | async\"\r\n>\r\n  <nav class=\"mat-keyboard-layout\">\r\n    <div class=\"mat-keyboard-row\"\r\n         *ngFor=\"let row of layout.keys\"\r\n    >\r\n      <ng-container *ngFor=\"let key of row\">\r\n        <mat-keyboard-key class=\"mat-keyboard-col\"\r\n                          *ngIf=\"getModifiedKey(key)\"\r\n                          [key]=\"getModifiedKey(key)\"\r\n                          [icon]=\"getKeyIcon(key)\"\r\n                          [active]=\"isActive(key)\"\r\n                          [input]=\"inputInstance | async\"\r\n                          [control]=\"control\"\r\n                          (enterClick)=\"onEnterClick($event)\"\r\n                          (capsClick)=\"onCapsClick($event)\"\r\n                          (altClick)=\"onAltClick()\"\r\n                          (shiftClick)=\"onShiftClick($event)\"\r\n                          (keyClick)=\"onKeyClick($event)\"\r\n                          (bkspClick)=\"onBkspClick($event)\"\r\n                          (spaceClick)=\"onSpaceClick($event)\">\r\n        </mat-keyboard-key>\r\n      </ng-container>\r\n    </div>\r\n  </nav>\r\n</div>\r\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false,
        styles: [".mat-keyboard-wrapper{background-color:#f5f5f5;border-radius:2px;display:-webkit-box;display:flex;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-size:14px;-webkit-box-pack:justify;justify-content:space-between;line-height:20px;padding:14px 24px}.mat-keyboard-wrapper.dark-theme{background-color:#424242}.mat-keyboard-action{background:0 0;color:inherit;flex-shrink:0;font-family:inherit;font-size:inherit;font-weight:600;line-height:1;margin-left:8px;text-transform:uppercase}:host(.dark-theme) .mat-keyboard-action{color:#f5f5f5}.mat-keyboard-layout{width:100%}.mat-keyboard-row{-webkit-box-align:stretch;align-items:stretch;display:-webkit-box;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;flex-wrap:nowrap}.mat-keyboard-col{box-sizing:border-box;-webkit-box-flex:1;flex:1 1 auto;padding:4px}.mat-keyboard-key{min-width:0;width:100%}:host(.dark-theme) .mat-keyboard-key{background-color:#616161;color:#f5f5f5}:host(.debug) .mat-keyboard-key-deadkey{background-color:#5f9ea0}:host(.debug) .mat-keyboard-key-modifier{background-color:#7fffd4}:host(.debug.dark-theme) .mat-keyboard-key-deadkey{background-color:#663399}:host(.debug.dark-theme) .mat-keyboard-key-modifier{background-color:#9370db}"]
    }),
    __param(0, Inject(LOCALE_ID))
], MatKeyboardComponent);
export { MatKeyboardComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMva2V5Ym9hcmQva2V5Ym9hcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQXFCLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1SyxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBRW5ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUd0RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUVqRjs7O0dBR0c7QUFRSCxJQUFhLG9CQUFvQixHQUFqQyxNQUFhLG9CQUFvQjtJQW1FL0Isc0JBQXNCO0lBQ3RCLFlBQXVDLE9BQWUsRUFDbEMsZ0JBQW9DO1FBRGpCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFvQjtRQW5FaEQsZUFBVSxHQUE2QixJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRSxhQUFRLEdBQTZCLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWhFLG9CQUFlLEdBQXVDLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBS2hGLGNBQVMsR0FBcUIsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1FBRXBELGdCQUFX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QUE7O3lDQXZNYyxNQUFNLFNBQUMsU0FBUztZQUNTLGtCQUFrQjs7QUE1RHhEO0lBREMsWUFBWSxDQUFDLHVCQUF1QixDQUFDO21EQUNZO0FBbUJsRDtJQURDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztzREFDbEI7QUFvR2hCO0lBREMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7cURBbUI1QztBQU9EO0lBREMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7bURBZ0IxQztBQXhLVSxvQkFBb0I7SUFQaEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGNBQWM7UUFDeEIsOHZDQUF3QztRQUV4QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtRQUMvQyxtQkFBbUIsRUFBRSxLQUFLOztLQUMzQixDQUFDO0lBcUVhLFdBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBcEVuQixvQkFBb0IsQ0EyUWhDO1NBM1FZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIEhvc3RMaXN0ZW5lciwgSW5qZWN0LCBMT0NBTEVfSUQsIE9uSW5pdCwgUXVlcnlMaXN0LCBWaWV3Q2hpbGRyZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRSZWYgfSBmcm9tICcuLi8uLi9jbGFzc2VzL2tleWJvYXJkLXJlZi5jbGFzcyc7XHJcbmltcG9ydCB7IEtFWUJPQVJEX0lDT05TIH0gZnJvbSAnLi4vLi4vY29uZmlncy9rZXlib2FyZC1pY29ucy5jb25maWcnO1xyXG5pbXBvcnQgeyBLZXlib2FyZENsYXNzS2V5IH0gZnJvbSAnLi4vLi4vZW51bXMva2V5Ym9hcmQtY2xhc3Mta2V5LmVudW0nO1xyXG5pbXBvcnQgeyBLZXlib2FyZE1vZGlmaWVyIH0gZnJvbSAnLi4vLi4vZW51bXMva2V5Ym9hcmQtbW9kaWZpZXIuZW51bSc7XHJcbmltcG9ydCB7IElLZXlib2FyZEljb25zLCBJTWF0SWNvbiB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMva2V5Ym9hcmQtaWNvbnMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgSUtleWJvYXJkTGF5b3V0IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9rZXlib2FyZC1sYXlvdXQuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMva2V5Ym9hcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hdEtleWJvYXJkS2V5Q29tcG9uZW50IH0gZnJvbSAnLi4va2V5Ym9hcmQta2V5L2tleWJvYXJkLWtleS5jb21wb25lbnQnO1xyXG5cclxuLyoqXHJcbiAqIEEgY29tcG9uZW50IHVzZWQgdG8gb3BlbiBhcyB0aGUgZGVmYXVsdCBrZXlib2FyZCwgbWF0Y2hpbmcgbWF0ZXJpYWwgc3BlYy5cclxuICogVGhpcyBzaG91bGQgb25seSBiZSB1c2VkIGludGVybmFsbHkgYnkgdGhlIGtleWJvYXJkIHNlcnZpY2UuXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ21hdC1rZXlib2FyZCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2tleWJvYXJkLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9rZXlib2FyZC5jb21wb25lbnQuc2NzcyddLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXRLZXlib2FyZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIHByaXZhdGUgX2RhcmtUaGVtZTogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XHJcblxyXG4gIHByaXZhdGUgX2lzRGVidWc6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xyXG5cclxuICBwcml2YXRlIF9pbnB1dEluc3RhbmNlJDogQmVoYXZpb3JTdWJqZWN0PEVsZW1lbnRSZWYgfCBudWxsPiA9IG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCk7XHJcblxyXG4gIEBWaWV3Q2hpbGRyZW4oTWF0S2V5Ym9hcmRLZXlDb21wb25lbnQpXHJcbiAgcHJpdmF0ZSBfa2V5czogUXVlcnlMaXN0PE1hdEtleWJvYXJkS2V5Q29tcG9uZW50PjtcclxuXHJcbiAgcHJpdmF0ZSBfbW9kaWZpZXI6IEtleWJvYXJkTW9kaWZpZXIgPSBLZXlib2FyZE1vZGlmaWVyLk5vbmU7XHJcblxyXG4gIHByaXZhdGUgX2NhcHNMb2NrZWQgPSBmYWxzZTtcclxuXHJcbiAgcHJpdmF0ZSBfaWNvbnM6IElLZXlib2FyZEljb25zID0gS0VZQk9BUkRfSUNPTlM7XHJcblxyXG4gIC8vIHRoZSBzZXJ2aWNlIHByb3ZpZGVzIGEgbG9jYWxlIG9yIGxheW91dCBvcHRpb25hbGx5XHJcbiAgbG9jYWxlPzogc3RyaW5nO1xyXG5cclxuICBsYXlvdXQ6IElLZXlib2FyZExheW91dDtcclxuXHJcbiAgY29udHJvbDogQWJzdHJhY3RDb250cm9sO1xyXG5cclxuICAvLyB0aGUgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBtYWtpbmcgdXAgdGhlIGNvbnRlbnQgb2YgdGhlIGtleWJvYXJkXHJcbiAga2V5Ym9hcmRSZWY6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PjtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tYXQta2V5Ym9hcmQnKVxyXG4gIGNzc0NsYXNzID0gdHJ1ZTtcclxuXHJcbiAga2V5Q2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICBia3NwQ2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICBlbnRlckNsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgY2Fwc0NsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgYWx0Q2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICBzaGlmdENsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgc3BhY2VDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG5cclxuICAvLyByZXR1cm5zIGFuIG9ic2VydmFibGUgb2YgdGhlIGlucHV0IGluc3RhbmNlXHJcbiAgZ2V0IGlucHV0SW5zdGFuY2UoKTogT2JzZXJ2YWJsZTxFbGVtZW50UmVmIHwgbnVsbD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lucHV0SW5zdGFuY2UkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgc2V0IGljb25zKGljb25zOiBJS2V5Ym9hcmRJY29ucykge1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLl9pY29ucywgaWNvbnMpO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRhcmtUaGVtZShkYXJrVGhlbWU6IGJvb2xlYW4pIHtcclxuICAgIGlmICh0aGlzLl9kYXJrVGhlbWUuZ2V0VmFsdWUoKSAhPT0gZGFya1RoZW1lKSB7XHJcbiAgICAgIHRoaXMuX2RhcmtUaGVtZS5uZXh0KGRhcmtUaGVtZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXQgaXNEZWJ1Zyhpc0RlYnVnOiBib29sZWFuKSB7XHJcbiAgICBpZiAodGhpcy5faXNEZWJ1Zy5nZXRWYWx1ZSgpICE9PSBpc0RlYnVnKSB7XHJcbiAgICAgIHRoaXMuX2lzRGVidWcubmV4dChpc0RlYnVnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBkYXJrVGhlbWUkKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhcmtUaGVtZS5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIGdldCBpc0RlYnVnJCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLl9pc0RlYnVnLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gaW5qZWN0IGRlcGVuZGVuY2llc1xyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIF9sb2NhbGU6IHN0cmluZyxcclxuICAgICAgICAgICAgICBwcml2YXRlIF9rZXlib2FyZFNlcnZpY2U6IE1hdEtleWJvYXJkU2VydmljZSkgeyB9XHJcblxyXG4gIHNldElucHV0SW5zdGFuY2UoaW5wdXRJbnN0YW5jZTogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy5faW5wdXRJbnN0YW5jZSQubmV4dChpbnB1dEluc3RhbmNlKTtcclxuICB9XHJcblxyXG4gIGF0dGFjaENvbnRyb2woY29udHJvbDogQWJzdHJhY3RDb250cm9sKSB7XHJcbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvLyBzZXQgYSBmYWxsYmFjayB1c2luZyB0aGUgbG9jYWxlXHJcbiAgICBpZiAoIXRoaXMubGF5b3V0KSB7XHJcbiAgICAgIHRoaXMubG9jYWxlID0gdGhpcy5fa2V5Ym9hcmRTZXJ2aWNlLm1hcExvY2FsZSh0aGlzLl9sb2NhbGUpID8gdGhpcy5fbG9jYWxlIDogJ2VuLVVTJztcclxuICAgICAgdGhpcy5sYXlvdXQgPSB0aGlzLl9rZXlib2FyZFNlcnZpY2UuZ2V0TGF5b3V0Rm9yTG9jYWxlKHRoaXMubG9jYWxlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRpc21pc3NlcyB0aGUga2V5Ym9hcmRcclxuICAgKi9cclxuICBkaXNtaXNzKCkge1xyXG4gICAgdGhpcy5rZXlib2FyZFJlZi5kaXNtaXNzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBjaGVja3MgaWYgYSBnaXZlbiBrZXkgaXMgY3VycmVudGx5IHByZXNzZWRcclxuICAgKiBAcGFyYW0ga2V5XHJcbiAgICogQHBhcmFtXHJcbiAgICovXHJcbiAgaXNBY3RpdmUoa2V5OiAoc3RyaW5nIHwgS2V5Ym9hcmRDbGFzc0tleSlbXSk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbW9kaWZpZWRLZXk6IHN0cmluZyA9IHRoaXMuZ2V0TW9kaWZpZWRLZXkoa2V5KTtcclxuICAgIGNvbnN0IGlzQWN0aXZlQ2Fwc0xvY2s6IGJvb2xlYW4gPSBtb2RpZmllZEtleSA9PT0gS2V5Ym9hcmRDbGFzc0tleS5DYXBzICYmIHRoaXMuX2NhcHNMb2NrZWQ7XHJcbiAgICBjb25zdCBpc0FjdGl2ZU1vZGlmaWVyOiBib29sZWFuID0gbW9kaWZpZWRLZXkgPT09IEtleWJvYXJkTW9kaWZpZXJbdGhpcy5fbW9kaWZpZXJdO1xyXG4gICAgcmV0dXJuIGlzQWN0aXZlQ2Fwc0xvY2sgfHwgaXNBY3RpdmVNb2RpZmllcjtcclxuICB9XHJcblxyXG4gIC8vIHJldHJpZXZlcyBtb2RpZmllZCBrZXlcclxuICBnZXRNb2RpZmllZEtleShrZXk6IChzdHJpbmcgfCBLZXlib2FyZENsYXNzS2V5KVtdKTogc3RyaW5nIHtcclxuICAgIGxldCBtb2RpZmllcjogS2V5Ym9hcmRNb2RpZmllciA9IHRoaXMuX21vZGlmaWVyO1xyXG5cclxuICAgIC8vIGBDYXBzTG9ja2AgaW52ZXJ0cyB0aGUgbWVhbmluZyBvZiBgU2hpZnRgXHJcbiAgICBpZiAodGhpcy5fY2Fwc0xvY2tlZCkge1xyXG4gICAgICBtb2RpZmllciA9IHRoaXMuX2ludmVydFNoaWZ0TW9kaWZpZXIodGhpcy5fbW9kaWZpZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBrZXlbbW9kaWZpZXJdO1xyXG4gIH1cclxuXHJcbiAgLy8gcmV0cmlldmVzIGljb24gZm9yIGdpdmVuIGtleVxyXG4gIGdldEtleUljb24oa2V5OiAoc3RyaW5nIHwgS2V5Ym9hcmRDbGFzc0tleSlbXSk6IElNYXRJY29uIHtcclxuICAgIHJldHVybiB0aGlzLl9pY29uc1trZXlbS2V5Ym9hcmRNb2RpZmllci5Ob25lXV07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBsaXN0ZW5zIHRvIHVzZXJzIGtleWJvYXJkIGlucHV0cyB0byBzaW11bGF0ZSBvbiB2aXJ0dWFsIGtleWJvYXJkLCB0b29cclxuICAgKiBAcGFyYW0gZXZlbnRcclxuICAgKi9cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlkb3duJywgWyckZXZlbnQnXSlcclxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIC8vICdhY3RpdmF0ZScgY29ycmVzcG9uZGluZyBrZXlcclxuICAgIHRoaXMuX2tleXNcclxuICAgICAgLmZpbHRlcigoa2V5OiBNYXRLZXlib2FyZEtleUNvbXBvbmVudCkgPT4ga2V5LmtleSA9PT0gZXZlbnQua2V5KVxyXG4gICAgICAuZm9yRWFjaCgoa2V5OiBNYXRLZXlib2FyZEtleUNvbXBvbmVudCkgPT4ge1xyXG4gICAgICAgIGtleS5wcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgLy8gc2ltdWxhdGUgbW9kaWZpZXIgcHJlc3NcclxuICAgIGlmIChldmVudC5rZXkgPT09IEtleWJvYXJkQ2xhc3NLZXkuQ2Fwcykge1xyXG4gICAgICB0aGlzLm9uQ2Fwc0NsaWNrKGV2ZW50LmdldE1vZGlmaWVyU3RhdGUoS2V5Ym9hcmRDbGFzc0tleS5DYXBzKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnQua2V5ID09PSBLZXlib2FyZENsYXNzS2V5LkFsdCAmJiB0aGlzLl9tb2RpZmllciAhPT0gS2V5Ym9hcmRNb2RpZmllci5BbHQgJiYgdGhpcy5fbW9kaWZpZXIgIT09IEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQpIHtcclxuICAgICAgdGhpcy5vbkFsdENsaWNrKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnQua2V5ID09PSBLZXlib2FyZENsYXNzS2V5LlNoaWZ0ICYmIHRoaXMuX21vZGlmaWVyICE9PSBLZXlib2FyZE1vZGlmaWVyLlNoaWZ0ICYmIHRoaXMuX21vZGlmaWVyICE9PSBLZXlib2FyZE1vZGlmaWVyLlNoaWZ0QWx0KSB7XHJcbiAgICAgIHRoaXMub25TaGlmdENsaWNrKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxpc3RlbnMgdG8gdXNlcnMga2V5Ym9hcmQgaW5wdXRzIHRvIHNpbXVsYXRlIG9uIHZpcnR1YWwga2V5Ym9hcmQsIHRvb1xyXG4gICAqIEBwYXJhbSBldmVudFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleXVwJywgWyckZXZlbnQnXSlcclxuICBvbktleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAvLyAnZGVhY3RpdmF0ZScgY29ycmVzcG9uZGluZyBrZXlcclxuICAgIHRoaXMuX2tleXNcclxuICAgICAgLmZpbHRlcigoa2V5OiBNYXRLZXlib2FyZEtleUNvbXBvbmVudCkgPT4ga2V5LmtleSA9PT0gZXZlbnQua2V5KVxyXG4gICAgICAuZm9yRWFjaCgoa2V5OiBNYXRLZXlib2FyZEtleUNvbXBvbmVudCkgPT4ge1xyXG4gICAgICAgIGtleS5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIC8vIHNpbXVsYXRlIG1vZGlmaWVyIHJlbGVhc2VcclxuICAgIGlmIChldmVudC5rZXkgPT09IEtleWJvYXJkQ2xhc3NLZXkuQWx0ICYmICh0aGlzLl9tb2RpZmllciA9PT0gS2V5Ym9hcmRNb2RpZmllci5BbHQgfHwgdGhpcy5fbW9kaWZpZXIgPT09IEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQpKSB7XHJcbiAgICAgIHRoaXMub25BbHRDbGljaygpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gS2V5Ym9hcmRDbGFzc0tleS5TaGlmdCAmJiAodGhpcy5fbW9kaWZpZXIgPT09IEtleWJvYXJkTW9kaWZpZXIuU2hpZnQgfHwgdGhpcy5fbW9kaWZpZXIgPT09IEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQpKSB7XHJcbiAgICAgIHRoaXMub25TaGlmdENsaWNrKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGJ1YmJsZXMgZXZlbnQgaWYgc3VibWl0IGlzIHBvdGVudGlhbGx5IHRyaWdnZXJlZFxyXG4gICAqL1xyXG4gIG9uRW50ZXJDbGljayhldmVudDogYW55KSB7XHJcbiAgICAvLyBub3RpZnkgc3Vic2NyaWJlcnNcclxuICAgIHRoaXMuZW50ZXJDbGljay5uZXh0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHNpbXVsYXRlcyBjbGlja2luZyBgQ2Fwc0xvY2tgIGtleVxyXG4gICAqIEBwYXJhbSB0YXJnZXRTdGF0ZVxyXG4gICAqL1xyXG4gIG9uQ2Fwc0NsaWNrKGV2ZW50OiBhbnksIHRhcmdldFN0YXRlID0gIXRoaXMuX2NhcHNMb2NrZWQpIHtcclxuICAgIC8vIG5vdCBpbXBsZW1lbnRlZFxyXG4gICAgdGhpcy5fY2Fwc0xvY2tlZCA9IHRhcmdldFN0YXRlO1xyXG5cclxuICAgIC8vIG5vdGlmeSBzdWJzY3JpYmVyc1xyXG4gICAgdGhpcy5jYXBzQ2xpY2submV4dChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIG5vbi1tb2RpZmllciBrZXlzIGFyZSBjbGlja2VkXHJcbiAgICovXHJcbiAgb25LZXlDbGljayhldmVudDogYW55KSB7XHJcbiAgICBpZiAodGhpcy5fbW9kaWZpZXIgPT09IEtleWJvYXJkTW9kaWZpZXIuU2hpZnQgfHwgdGhpcy5fbW9kaWZpZXIgPT09IEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQpIHtcclxuICAgICAgdGhpcy5fbW9kaWZpZXIgPSB0aGlzLl9pbnZlcnRTaGlmdE1vZGlmaWVyKHRoaXMuX21vZGlmaWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fbW9kaWZpZXIgPT09IEtleWJvYXJkTW9kaWZpZXIuQWx0IHx8IHRoaXMuX21vZGlmaWVyID09PSBLZXlib2FyZE1vZGlmaWVyLlNoaWZ0QWx0KSB7XHJcbiAgICAgIHRoaXMuX21vZGlmaWVyID0gdGhpcy5faW52ZXJ0QWx0TW9kaWZpZXIodGhpcy5fbW9kaWZpZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMua2V5Q2xpY2submV4dChldmVudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzaW11bGF0ZXMgY2xpY2tpbmcgYEFsdGAga2V5XHJcbiAgICovXHJcbiAgb25BbHRDbGljaygpIHtcclxuICAgIC8vIGludmVydCBtb2RpZmllciBtZWFuaW5nXHJcbiAgICB0aGlzLl9tb2RpZmllciA9IHRoaXMuX2ludmVydEFsdE1vZGlmaWVyKHRoaXMuX21vZGlmaWVyKTtcclxuXHJcbiAgICAvLyBub3RpZnkgc3Vic2NyaWJlcnNcclxuICAgIHRoaXMuYWx0Q2xpY2submV4dCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc2ltdWxhdGVzIGNsaWNraW5nIGBTaGlmdGAga2V5XHJcbiAgICovXHJcbiAgb25TaGlmdENsaWNrKGV2ZW50OiBhbnkpIHtcclxuICAgIC8vIGludmVydCBtb2RpZmllciBtZWFuaW5nXHJcbiAgICB0aGlzLl9tb2RpZmllciA9IHRoaXMuX2ludmVydFNoaWZ0TW9kaWZpZXIodGhpcy5fbW9kaWZpZXIpO1xyXG5cclxuICAgIC8vIG5vdGlmeSBzdWJzY3JpYmVyc1xyXG4gICAgdGhpcy5zaGlmdENsaWNrLm5leHQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgb25Ca3NwQ2xpY2soZXZlbnQ6IGFueSkge1xyXG4gICAgdGhpcy5ia3NwQ2xpY2submV4dChldmVudCk7XHJcbiAgfVxyXG5cclxuICBvblNwYWNlQ2xpY2soZXZlbnQ6IGFueSkge1xyXG4gICAgdGhpcy5zcGFjZUNsaWNrLm5leHQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfaW52ZXJ0QWx0TW9kaWZpZXIobW9kaWZpZXI6IEtleWJvYXJkTW9kaWZpZXIpOiBLZXlib2FyZE1vZGlmaWVyIHtcclxuICAgIHN3aXRjaCAobW9kaWZpZXIpIHtcclxuICAgICAgY2FzZSBLZXlib2FyZE1vZGlmaWVyLk5vbmU6XHJcbiAgICAgICAgcmV0dXJuIEtleWJvYXJkTW9kaWZpZXIuQWx0O1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZE1vZGlmaWVyLlNoaWZ0OlxyXG4gICAgICAgIHJldHVybiBLZXlib2FyZE1vZGlmaWVyLlNoaWZ0QWx0O1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZE1vZGlmaWVyLlNoaWZ0QWx0OlxyXG4gICAgICAgIHJldHVybiBLZXlib2FyZE1vZGlmaWVyLlNoaWZ0O1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZE1vZGlmaWVyLkFsdDpcclxuICAgICAgICByZXR1cm4gS2V5Ym9hcmRNb2RpZmllci5Ob25lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfaW52ZXJ0U2hpZnRNb2RpZmllcihtb2RpZmllcjogS2V5Ym9hcmRNb2RpZmllcik6IEtleWJvYXJkTW9kaWZpZXIge1xyXG4gICAgc3dpdGNoIChtb2RpZmllcikge1xyXG4gICAgICBjYXNlIEtleWJvYXJkTW9kaWZpZXIuTm9uZTpcclxuICAgICAgICByZXR1cm4gS2V5Ym9hcmRNb2RpZmllci5TaGlmdDtcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRNb2RpZmllci5BbHQ6XHJcbiAgICAgICAgcmV0dXJuIEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQ7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQ6XHJcbiAgICAgICAgcmV0dXJuIEtleWJvYXJkTW9kaWZpZXIuQWx0O1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZE1vZGlmaWVyLlNoaWZ0OlxyXG4gICAgICAgIHJldHVybiBLZXlib2FyZE1vZGlmaWVyLk5vbmU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=