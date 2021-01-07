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
var MatKeyboardComponent = /** @class */ (function () {
    // inject dependencies
    function MatKeyboardComponent(_locale, _keyboardService) {
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
    Object.defineProperty(MatKeyboardComponent.prototype, "inputInstance", {
        // returns an observable of the input instance
        get: function () {
            return this._inputInstance$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardComponent.prototype, "icons", {
        set: function (icons) {
            Object.assign(this._icons, icons);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardComponent.prototype, "darkTheme", {
        set: function (darkTheme) {
            if (this._darkTheme.getValue() !== darkTheme) {
                this._darkTheme.next(darkTheme);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardComponent.prototype, "isDebug", {
        set: function (isDebug) {
            if (this._isDebug.getValue() !== isDebug) {
                this._isDebug.next(isDebug);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardComponent.prototype, "darkTheme$", {
        get: function () {
            return this._darkTheme.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardComponent.prototype, "isDebug$", {
        get: function () {
            return this._isDebug.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    MatKeyboardComponent.prototype.setInputInstance = function (inputInstance) {
        this._inputInstance$.next(inputInstance);
    };
    MatKeyboardComponent.prototype.attachControl = function (control) {
        this.control = control;
    };
    MatKeyboardComponent.prototype.ngOnInit = function () {
        // set a fallback using the locale
        if (!this.layout) {
            this.locale = this._keyboardService.mapLocale(this._locale) ? this._locale : 'en-US';
            this.layout = this._keyboardService.getLayoutForLocale(this.locale);
        }
    };
    /**
     * dismisses the keyboard
     */
    MatKeyboardComponent.prototype.dismiss = function () {
        this.keyboardRef.dismiss();
    };
    /**
     * checks if a given key is currently pressed
     * @param key
     * @param
     */
    MatKeyboardComponent.prototype.isActive = function (key) {
        var modifiedKey = this.getModifiedKey(key);
        var isActiveCapsLock = modifiedKey === KeyboardClassKey.Caps && this._capsLocked;
        var isActiveModifier = modifiedKey === KeyboardModifier[this._modifier];
        return isActiveCapsLock || isActiveModifier;
    };
    // retrieves modified key
    MatKeyboardComponent.prototype.getModifiedKey = function (key) {
        var modifier = this._modifier;
        // `CapsLock` inverts the meaning of `Shift`
        if (this._capsLocked) {
            modifier = this._invertShiftModifier(this._modifier);
        }
        return key[modifier];
    };
    // retrieves icon for given key
    MatKeyboardComponent.prototype.getKeyIcon = function (key) {
        return this._icons[key[KeyboardModifier.None]];
    };
    /**
     * listens to users keyboard inputs to simulate on virtual keyboard, too
     * @param event
     */
    MatKeyboardComponent.prototype.onKeyDown = function (event) {
        // 'activate' corresponding key
        this._keys
            .filter(function (key) { return key.key === event.key; })
            .forEach(function (key) {
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
    };
    /**
     * listens to users keyboard inputs to simulate on virtual keyboard, too
     * @param event
     */
    MatKeyboardComponent.prototype.onKeyUp = function (event) {
        // 'deactivate' corresponding key
        this._keys
            .filter(function (key) { return key.key === event.key; })
            .forEach(function (key) {
            key.pressed = false;
        });
        // simulate modifier release
        if (event.key === KeyboardClassKey.Alt && (this._modifier === KeyboardModifier.Alt || this._modifier === KeyboardModifier.ShiftAlt)) {
            this.onAltClick();
        }
        if (event.key === KeyboardClassKey.Shift && (this._modifier === KeyboardModifier.Shift || this._modifier === KeyboardModifier.ShiftAlt)) {
            this.onShiftClick(event);
        }
    };
    /**
     * bubbles event if submit is potentially triggered
     */
    MatKeyboardComponent.prototype.onEnterClick = function (event) {
        // notify subscribers
        this.enterClick.next(event);
    };
    /**
     * simulates clicking `CapsLock` key
     * @param targetState
     */
    MatKeyboardComponent.prototype.onCapsClick = function (event, targetState) {
        if (targetState === void 0) { targetState = !this._capsLocked; }
        // not implemented
        this._capsLocked = targetState;
        // notify subscribers
        this.capsClick.next(event);
    };
    /*
     * non-modifier keys are clicked
     */
    MatKeyboardComponent.prototype.onKeyClick = function (event) {
        if (this._modifier === KeyboardModifier.Shift || this._modifier === KeyboardModifier.ShiftAlt) {
            this._modifier = this._invertShiftModifier(this._modifier);
        }
        if (this._modifier === KeyboardModifier.Alt || this._modifier === KeyboardModifier.ShiftAlt) {
            this._modifier = this._invertAltModifier(this._modifier);
        }
        this.keyClick.next(event);
    };
    /**
     * simulates clicking `Alt` key
     */
    MatKeyboardComponent.prototype.onAltClick = function () {
        // invert modifier meaning
        this._modifier = this._invertAltModifier(this._modifier);
        // notify subscribers
        this.altClick.next();
    };
    /**
     * simulates clicking `Shift` key
     */
    MatKeyboardComponent.prototype.onShiftClick = function (event) {
        // invert modifier meaning
        this._modifier = this._invertShiftModifier(this._modifier);
        // notify subscribers
        this.shiftClick.next(event);
    };
    MatKeyboardComponent.prototype.onBkspClick = function (event) {
        this.bkspClick.next(event);
    };
    MatKeyboardComponent.prototype.onSpaceClick = function (event) {
        this.spaceClick.next(event);
    };
    MatKeyboardComponent.prototype._invertAltModifier = function (modifier) {
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
    };
    MatKeyboardComponent.prototype._invertShiftModifier = function (modifier) {
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
    };
    MatKeyboardComponent.ctorParameters = function () { return [
        { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
        { type: MatKeyboardService }
    ]; };
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
    return MatKeyboardComponent;
}());
export { MatKeyboardComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMva2V5Ym9hcmQva2V5Ym9hcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQXFCLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1SyxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBRW5ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUd0RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUVqRjs7O0dBR0c7QUFRSDtJQW1FRSxzQkFBc0I7SUFDdEIsOEJBQXVDLE9BQWUsRUFDbEMsZ0JBQW9DO1FBRGpCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFvQjtRQW5FaEQsZUFBVSxHQUE2QixJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRSxhQUFRLEdBQTZCLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWhFLG9CQUFlLEdBQXVDLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBS2hGLGNBQVMsR0FBcUIsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1FBRXBELGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXBCLFdBQU0sR0FB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LE9BQU8sZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1lBRW5DLEtBQUssZ0JBQWdCLENBQUMsUUFBUTtnQkFDNUIsT0FBTyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7WUFFOUIsS0FBSyxnQkFBZ0IsQ0FBQyxLQUFLO2dCQUN6QixPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQztTQUNoQztJQUNILENBQUM7OzZDQXJNWSxNQUFNLFNBQUMsU0FBUztnQkFDUyxrQkFBa0I7O0lBNUR4RDtRQURDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQzt1REFDWTtJQW1CbEQ7UUFEQyxXQUFXLENBQUMsb0JBQW9CLENBQUM7MERBQ2xCO0lBb0doQjtRQURDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3lEQW1CNUM7SUFPRDtRQURDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3VEQWdCMUM7SUF4S1Usb0JBQW9CO1FBUGhDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxjQUFjO1lBQ3hCLDh2Q0FBd0M7WUFFeEMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFDL0MsbUJBQW1CLEVBQUUsS0FBSzs7U0FDM0IsQ0FBQztRQXFFYSxXQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtPQXBFbkIsb0JBQW9CLENBMlFoQztJQUFELDJCQUFDO0NBQUEsQUEzUUQsSUEyUUM7U0EzUVksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyLCBJbmplY3QsIExPQ0FMRV9JRCwgT25Jbml0LCBRdWVyeUxpc3QsIFZpZXdDaGlsZHJlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZFJlZiB9IGZyb20gJy4uLy4uL2NsYXNzZXMva2V5Ym9hcmQtcmVmLmNsYXNzJztcclxuaW1wb3J0IHsgS0VZQk9BUkRfSUNPTlMgfSBmcm9tICcuLi8uLi9jb25maWdzL2tleWJvYXJkLWljb25zLmNvbmZpZyc7XHJcbmltcG9ydCB7IEtleWJvYXJkQ2xhc3NLZXkgfSBmcm9tICcuLi8uLi9lbnVtcy9rZXlib2FyZC1jbGFzcy1rZXkuZW51bSc7XHJcbmltcG9ydCB7IEtleWJvYXJkTW9kaWZpZXIgfSBmcm9tICcuLi8uLi9lbnVtcy9rZXlib2FyZC1tb2RpZmllci5lbnVtJztcclxuaW1wb3J0IHsgSUtleWJvYXJkSWNvbnMsIElNYXRJY29uIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9rZXlib2FyZC1pY29ucy5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBJS2V5Ym9hcmRMYXlvdXQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2tleWJvYXJkLWxheW91dC5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9rZXlib2FyZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRLZXlDb21wb25lbnQgfSBmcm9tICcuLi9rZXlib2FyZC1rZXkva2V5Ym9hcmQta2V5LmNvbXBvbmVudCc7XHJcblxyXG4vKipcclxuICogQSBjb21wb25lbnQgdXNlZCB0byBvcGVuIGFzIHRoZSBkZWZhdWx0IGtleWJvYXJkLCBtYXRjaGluZyBtYXRlcmlhbCBzcGVjLlxyXG4gKiBUaGlzIHNob3VsZCBvbmx5IGJlIHVzZWQgaW50ZXJuYWxseSBieSB0aGUga2V5Ym9hcmQgc2VydmljZS5cclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWF0LWtleWJvYXJkJyxcclxuICB0ZW1wbGF0ZVVybDogJy4va2V5Ym9hcmQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2tleWJvYXJkLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2VcclxufSlcclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgcHJpdmF0ZSBfZGFya1RoZW1lOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcclxuXHJcbiAgcHJpdmF0ZSBfaXNEZWJ1ZzogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XHJcblxyXG4gIHByaXZhdGUgX2lucHV0SW5zdGFuY2UkOiBCZWhhdmlvclN1YmplY3Q8RWxlbWVudFJlZiB8IG51bGw+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChudWxsKTtcclxuXHJcbiAgQFZpZXdDaGlsZHJlbihNYXRLZXlib2FyZEtleUNvbXBvbmVudClcclxuICBwcml2YXRlIF9rZXlzOiBRdWVyeUxpc3Q8TWF0S2V5Ym9hcmRLZXlDb21wb25lbnQ+O1xyXG5cclxuICBwcml2YXRlIF9tb2RpZmllcjogS2V5Ym9hcmRNb2RpZmllciA9IEtleWJvYXJkTW9kaWZpZXIuTm9uZTtcclxuXHJcbiAgcHJpdmF0ZSBfY2Fwc0xvY2tlZCA9IGZhbHNlO1xyXG5cclxuICBwcml2YXRlIF9pY29uczogSUtleWJvYXJkSWNvbnMgPSBLRVlCT0FSRF9JQ09OUztcclxuXHJcbiAgLy8gdGhlIHNlcnZpY2UgcHJvdmlkZXMgYSBsb2NhbGUgb3IgbGF5b3V0IG9wdGlvbmFsbHlcclxuICBsb2NhbGU/OiBzdHJpbmc7XHJcblxyXG4gIGxheW91dDogSUtleWJvYXJkTGF5b3V0O1xyXG5cclxuICBjb250cm9sOiBBYnN0cmFjdENvbnRyb2w7XHJcblxyXG4gIC8vIHRoZSBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IG1ha2luZyB1cCB0aGUgY29udGVudCBvZiB0aGUga2V5Ym9hcmRcclxuICBrZXlib2FyZFJlZjogTWF0S2V5Ym9hcmRSZWY8TWF0S2V5Ym9hcmRDb21wb25lbnQ+O1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm1hdC1rZXlib2FyZCcpXHJcbiAgY3NzQ2xhc3MgPSB0cnVlO1xyXG5cclxuICBrZXlDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG4gIGJrc3BDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG4gIGVudGVyQ2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICBjYXBzQ2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICBhbHRDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG4gIHNoaWZ0Q2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICBzcGFjZUNsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcblxyXG4gIC8vIHJldHVybnMgYW4gb2JzZXJ2YWJsZSBvZiB0aGUgaW5wdXQgaW5zdGFuY2VcclxuICBnZXQgaW5wdXRJbnN0YW5jZSgpOiBPYnNlcnZhYmxlPEVsZW1lbnRSZWYgfCBudWxsPiB7XHJcbiAgICByZXR1cm4gdGhpcy5faW5wdXRJbnN0YW5jZSQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBzZXQgaWNvbnMoaWNvbnM6IElLZXlib2FyZEljb25zKSB7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuX2ljb25zLCBpY29ucyk7XHJcbiAgfVxyXG5cclxuICBzZXQgZGFya1RoZW1lKGRhcmtUaGVtZTogYm9vbGVhbikge1xyXG4gICAgaWYgKHRoaXMuX2RhcmtUaGVtZS5nZXRWYWx1ZSgpICE9PSBkYXJrVGhlbWUpIHtcclxuICAgICAgdGhpcy5fZGFya1RoZW1lLm5leHQoZGFya1RoZW1lKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldCBpc0RlYnVnKGlzRGVidWc6IGJvb2xlYW4pIHtcclxuICAgIGlmICh0aGlzLl9pc0RlYnVnLmdldFZhbHVlKCkgIT09IGlzRGVidWcpIHtcclxuICAgICAgdGhpcy5faXNEZWJ1Zy5uZXh0KGlzRGVidWcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IGRhcmtUaGVtZSQoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGFya1RoZW1lLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzRGVidWckKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzRGVidWcuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBpbmplY3QgZGVwZW5kZW5jaWVzXHJcbiAgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIHByaXZhdGUgX2xvY2FsZTogc3RyaW5nLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgX2tleWJvYXJkU2VydmljZTogTWF0S2V5Ym9hcmRTZXJ2aWNlKSB7IH1cclxuXHJcbiAgc2V0SW5wdXRJbnN0YW5jZShpbnB1dEluc3RhbmNlOiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLl9pbnB1dEluc3RhbmNlJC5uZXh0KGlucHV0SW5zdGFuY2UpO1xyXG4gIH1cclxuXHJcbiAgYXR0YWNoQ29udHJvbChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcclxuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIHNldCBhIGZhbGxiYWNrIHVzaW5nIHRoZSBsb2NhbGVcclxuICAgIGlmICghdGhpcy5sYXlvdXQpIHtcclxuICAgICAgdGhpcy5sb2NhbGUgPSB0aGlzLl9rZXlib2FyZFNlcnZpY2UubWFwTG9jYWxlKHRoaXMuX2xvY2FsZSkgPyB0aGlzLl9sb2NhbGUgOiAnZW4tVVMnO1xyXG4gICAgICB0aGlzLmxheW91dCA9IHRoaXMuX2tleWJvYXJkU2VydmljZS5nZXRMYXlvdXRGb3JMb2NhbGUodGhpcy5sb2NhbGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZGlzbWlzc2VzIHRoZSBrZXlib2FyZFxyXG4gICAqL1xyXG4gIGRpc21pc3MoKSB7XHJcbiAgICB0aGlzLmtleWJvYXJkUmVmLmRpc21pc3MoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNoZWNrcyBpZiBhIGdpdmVuIGtleSBpcyBjdXJyZW50bHkgcHJlc3NlZFxyXG4gICAqIEBwYXJhbSBrZXlcclxuICAgKiBAcGFyYW1cclxuICAgKi9cclxuICBpc0FjdGl2ZShrZXk6IChzdHJpbmcgfCBLZXlib2FyZENsYXNzS2V5KVtdKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBtb2RpZmllZEtleTogc3RyaW5nID0gdGhpcy5nZXRNb2RpZmllZEtleShrZXkpO1xyXG4gICAgY29uc3QgaXNBY3RpdmVDYXBzTG9jazogYm9vbGVhbiA9IG1vZGlmaWVkS2V5ID09PSBLZXlib2FyZENsYXNzS2V5LkNhcHMgJiYgdGhpcy5fY2Fwc0xvY2tlZDtcclxuICAgIGNvbnN0IGlzQWN0aXZlTW9kaWZpZXI6IGJvb2xlYW4gPSBtb2RpZmllZEtleSA9PT0gS2V5Ym9hcmRNb2RpZmllclt0aGlzLl9tb2RpZmllcl07XHJcbiAgICByZXR1cm4gaXNBY3RpdmVDYXBzTG9jayB8fCBpc0FjdGl2ZU1vZGlmaWVyO1xyXG4gIH1cclxuXHJcbiAgLy8gcmV0cmlldmVzIG1vZGlmaWVkIGtleVxyXG4gIGdldE1vZGlmaWVkS2V5KGtleTogKHN0cmluZyB8IEtleWJvYXJkQ2xhc3NLZXkpW10pOiBzdHJpbmcge1xyXG4gICAgbGV0IG1vZGlmaWVyOiBLZXlib2FyZE1vZGlmaWVyID0gdGhpcy5fbW9kaWZpZXI7XHJcblxyXG4gICAgLy8gYENhcHNMb2NrYCBpbnZlcnRzIHRoZSBtZWFuaW5nIG9mIGBTaGlmdGBcclxuICAgIGlmICh0aGlzLl9jYXBzTG9ja2VkKSB7XHJcbiAgICAgIG1vZGlmaWVyID0gdGhpcy5faW52ZXJ0U2hpZnRNb2RpZmllcih0aGlzLl9tb2RpZmllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGtleVttb2RpZmllcl07XHJcbiAgfVxyXG5cclxuICAvLyByZXRyaWV2ZXMgaWNvbiBmb3IgZ2l2ZW4ga2V5XHJcbiAgZ2V0S2V5SWNvbihrZXk6IChzdHJpbmcgfCBLZXlib2FyZENsYXNzS2V5KVtdKTogSU1hdEljb24ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2ljb25zW2tleVtLZXlib2FyZE1vZGlmaWVyLk5vbmVdXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxpc3RlbnMgdG8gdXNlcnMga2V5Ym9hcmQgaW5wdXRzIHRvIHNpbXVsYXRlIG9uIHZpcnR1YWwga2V5Ym9hcmQsIHRvb1xyXG4gICAqIEBwYXJhbSBldmVudFxyXG4gICAqL1xyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleWRvd24nLCBbJyRldmVudCddKVxyXG4gIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgLy8gJ2FjdGl2YXRlJyBjb3JyZXNwb25kaW5nIGtleVxyXG4gICAgdGhpcy5fa2V5c1xyXG4gICAgICAuZmlsdGVyKChrZXk6IE1hdEtleWJvYXJkS2V5Q29tcG9uZW50KSA9PiBrZXkua2V5ID09PSBldmVudC5rZXkpXHJcbiAgICAgIC5mb3JFYWNoKChrZXk6IE1hdEtleWJvYXJkS2V5Q29tcG9uZW50KSA9PiB7XHJcbiAgICAgICAga2V5LnByZXNzZWQgPSB0cnVlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAvLyBzaW11bGF0ZSBtb2RpZmllciBwcmVzc1xyXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gS2V5Ym9hcmRDbGFzc0tleS5DYXBzKSB7XHJcbiAgICAgIHRoaXMub25DYXBzQ2xpY2soZXZlbnQuZ2V0TW9kaWZpZXJTdGF0ZShLZXlib2FyZENsYXNzS2V5LkNhcHMpKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5rZXkgPT09IEtleWJvYXJkQ2xhc3NLZXkuQWx0ICYmIHRoaXMuX21vZGlmaWVyICE9PSBLZXlib2FyZE1vZGlmaWVyLkFsdCAmJiB0aGlzLl9tb2RpZmllciAhPT0gS2V5Ym9hcmRNb2RpZmllci5TaGlmdEFsdCkge1xyXG4gICAgICB0aGlzLm9uQWx0Q2xpY2soKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5rZXkgPT09IEtleWJvYXJkQ2xhc3NLZXkuU2hpZnQgJiYgdGhpcy5fbW9kaWZpZXIgIT09IEtleWJvYXJkTW9kaWZpZXIuU2hpZnQgJiYgdGhpcy5fbW9kaWZpZXIgIT09IEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQpIHtcclxuICAgICAgdGhpcy5vblNoaWZ0Q2xpY2soZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogbGlzdGVucyB0byB1c2VycyBrZXlib2FyZCBpbnB1dHMgdG8gc2ltdWxhdGUgb24gdmlydHVhbCBrZXlib2FyZCwgdG9vXHJcbiAgICogQHBhcmFtIGV2ZW50XHJcbiAgICovXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5dXAnLCBbJyRldmVudCddKVxyXG4gIG9uS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIC8vICdkZWFjdGl2YXRlJyBjb3JyZXNwb25kaW5nIGtleVxyXG4gICAgdGhpcy5fa2V5c1xyXG4gICAgICAuZmlsdGVyKChrZXk6IE1hdEtleWJvYXJkS2V5Q29tcG9uZW50KSA9PiBrZXkua2V5ID09PSBldmVudC5rZXkpXHJcbiAgICAgIC5mb3JFYWNoKChrZXk6IE1hdEtleWJvYXJkS2V5Q29tcG9uZW50KSA9PiB7XHJcbiAgICAgICAga2V5LnByZXNzZWQgPSBmYWxzZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgLy8gc2ltdWxhdGUgbW9kaWZpZXIgcmVsZWFzZVxyXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gS2V5Ym9hcmRDbGFzc0tleS5BbHQgJiYgKHRoaXMuX21vZGlmaWVyID09PSBLZXlib2FyZE1vZGlmaWVyLkFsdCB8fCB0aGlzLl9tb2RpZmllciA9PT0gS2V5Ym9hcmRNb2RpZmllci5TaGlmdEFsdCkpIHtcclxuICAgICAgdGhpcy5vbkFsdENsaWNrKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnQua2V5ID09PSBLZXlib2FyZENsYXNzS2V5LlNoaWZ0ICYmICh0aGlzLl9tb2RpZmllciA9PT0gS2V5Ym9hcmRNb2RpZmllci5TaGlmdCB8fCB0aGlzLl9tb2RpZmllciA9PT0gS2V5Ym9hcmRNb2RpZmllci5TaGlmdEFsdCkpIHtcclxuICAgICAgdGhpcy5vblNoaWZ0Q2xpY2soZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYnViYmxlcyBldmVudCBpZiBzdWJtaXQgaXMgcG90ZW50aWFsbHkgdHJpZ2dlcmVkXHJcbiAgICovXHJcbiAgb25FbnRlckNsaWNrKGV2ZW50OiBhbnkpIHtcclxuICAgIC8vIG5vdGlmeSBzdWJzY3JpYmVyc1xyXG4gICAgdGhpcy5lbnRlckNsaWNrLm5leHQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc2ltdWxhdGVzIGNsaWNraW5nIGBDYXBzTG9ja2Aga2V5XHJcbiAgICogQHBhcmFtIHRhcmdldFN0YXRlXHJcbiAgICovXHJcbiAgb25DYXBzQ2xpY2soZXZlbnQ6IGFueSwgdGFyZ2V0U3RhdGUgPSAhdGhpcy5fY2Fwc0xvY2tlZCkge1xyXG4gICAgLy8gbm90IGltcGxlbWVudGVkXHJcbiAgICB0aGlzLl9jYXBzTG9ja2VkID0gdGFyZ2V0U3RhdGU7XHJcblxyXG4gICAgLy8gbm90aWZ5IHN1YnNjcmliZXJzXHJcbiAgICB0aGlzLmNhcHNDbGljay5uZXh0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogbm9uLW1vZGlmaWVyIGtleXMgYXJlIGNsaWNrZWRcclxuICAgKi9cclxuICBvbktleUNsaWNrKGV2ZW50OiBhbnkpIHtcclxuICAgIGlmICh0aGlzLl9tb2RpZmllciA9PT0gS2V5Ym9hcmRNb2RpZmllci5TaGlmdCB8fCB0aGlzLl9tb2RpZmllciA9PT0gS2V5Ym9hcmRNb2RpZmllci5TaGlmdEFsdCkge1xyXG4gICAgICB0aGlzLl9tb2RpZmllciA9IHRoaXMuX2ludmVydFNoaWZ0TW9kaWZpZXIodGhpcy5fbW9kaWZpZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9tb2RpZmllciA9PT0gS2V5Ym9hcmRNb2RpZmllci5BbHQgfHwgdGhpcy5fbW9kaWZpZXIgPT09IEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQpIHtcclxuICAgICAgdGhpcy5fbW9kaWZpZXIgPSB0aGlzLl9pbnZlcnRBbHRNb2RpZmllcih0aGlzLl9tb2RpZmllcik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5rZXlDbGljay5uZXh0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHNpbXVsYXRlcyBjbGlja2luZyBgQWx0YCBrZXlcclxuICAgKi9cclxuICBvbkFsdENsaWNrKCkge1xyXG4gICAgLy8gaW52ZXJ0IG1vZGlmaWVyIG1lYW5pbmdcclxuICAgIHRoaXMuX21vZGlmaWVyID0gdGhpcy5faW52ZXJ0QWx0TW9kaWZpZXIodGhpcy5fbW9kaWZpZXIpO1xyXG5cclxuICAgIC8vIG5vdGlmeSBzdWJzY3JpYmVyc1xyXG4gICAgdGhpcy5hbHRDbGljay5uZXh0KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzaW11bGF0ZXMgY2xpY2tpbmcgYFNoaWZ0YCBrZXlcclxuICAgKi9cclxuICBvblNoaWZ0Q2xpY2soZXZlbnQ6IGFueSkge1xyXG4gICAgLy8gaW52ZXJ0IG1vZGlmaWVyIG1lYW5pbmdcclxuICAgIHRoaXMuX21vZGlmaWVyID0gdGhpcy5faW52ZXJ0U2hpZnRNb2RpZmllcih0aGlzLl9tb2RpZmllcik7XHJcblxyXG4gICAgLy8gbm90aWZ5IHN1YnNjcmliZXJzXHJcbiAgICB0aGlzLnNoaWZ0Q2xpY2submV4dChldmVudCk7XHJcbiAgfVxyXG5cclxuICBvbkJrc3BDbGljayhldmVudDogYW55KSB7XHJcbiAgICB0aGlzLmJrc3BDbGljay5uZXh0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIG9uU3BhY2VDbGljayhldmVudDogYW55KSB7XHJcbiAgICB0aGlzLnNwYWNlQ2xpY2submV4dChldmVudCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9pbnZlcnRBbHRNb2RpZmllcihtb2RpZmllcjogS2V5Ym9hcmRNb2RpZmllcik6IEtleWJvYXJkTW9kaWZpZXIge1xyXG4gICAgc3dpdGNoIChtb2RpZmllcikge1xyXG4gICAgICBjYXNlIEtleWJvYXJkTW9kaWZpZXIuTm9uZTpcclxuICAgICAgICByZXR1cm4gS2V5Ym9hcmRNb2RpZmllci5BbHQ7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkTW9kaWZpZXIuU2hpZnQ6XHJcbiAgICAgICAgcmV0dXJuIEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQ7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkTW9kaWZpZXIuU2hpZnRBbHQ6XHJcbiAgICAgICAgcmV0dXJuIEtleWJvYXJkTW9kaWZpZXIuU2hpZnQ7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkTW9kaWZpZXIuQWx0OlxyXG4gICAgICAgIHJldHVybiBLZXlib2FyZE1vZGlmaWVyLk5vbmU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9pbnZlcnRTaGlmdE1vZGlmaWVyKG1vZGlmaWVyOiBLZXlib2FyZE1vZGlmaWVyKTogS2V5Ym9hcmRNb2RpZmllciB7XHJcbiAgICBzd2l0Y2ggKG1vZGlmaWVyKSB7XHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRNb2RpZmllci5Ob25lOlxyXG4gICAgICAgIHJldHVybiBLZXlib2FyZE1vZGlmaWVyLlNoaWZ0O1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZE1vZGlmaWVyLkFsdDpcclxuICAgICAgICByZXR1cm4gS2V5Ym9hcmRNb2RpZmllci5TaGlmdEFsdDtcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRNb2RpZmllci5TaGlmdEFsdDpcclxuICAgICAgICByZXR1cm4gS2V5Ym9hcmRNb2RpZmllci5BbHQ7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkTW9kaWZpZXIuU2hpZnQ6XHJcbiAgICAgICAgcmV0dXJuIEtleWJvYXJkTW9kaWZpZXIuTm9uZTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiJdfQ==