import { __decorate, __param } from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MAT_KEYBOARD_DEADKEYS } from '../../configs/keyboard-deadkey.config';
import { KeyboardClassKey } from '../../enums/keyboard-class-key.enum';
export const VALUE_NEWLINE = '\n\r';
export const VALUE_SPACE = ' ';
export const VALUE_TAB = '\t';
const REPEAT_TIMEOUT = 500;
const REPEAT_INTERVAL = 100;
let MatKeyboardKeyComponent = class MatKeyboardKeyComponent {
    // Inject dependencies
    constructor(_deadkeys) {
        this._deadkeys = _deadkeys;
        this._deadkeyKeys = [];
        this._repeatState = false; // true if repeating, false if waiting
        this.active$ = new BehaviorSubject(false);
        this.pressed$ = new BehaviorSubject(false);
        this.genericClick = new EventEmitter();
        this.enterClick = new EventEmitter();
        this.bkspClick = new EventEmitter();
        this.capsClick = new EventEmitter();
        this.altClick = new EventEmitter();
        this.shiftClick = new EventEmitter();
        this.spaceClick = new EventEmitter();
        this.tabClick = new EventEmitter();
        this.keyClick = new EventEmitter();
    }
    set active(active) {
        this.active$.next(active);
    }
    get active() {
        return this.active$.getValue();
    }
    set pressed(pressed) {
        this.pressed$.next(pressed);
    }
    get pressed() {
        return this.pressed$.getValue();
    }
    get lowerKey() {
        return `${this.key}`.toLowerCase();
    }
    get charCode() {
        return `${this.key}`.charCodeAt(0);
    }
    get isClassKey() {
        return this.key in KeyboardClassKey;
    }
    get isDeadKey() {
        return this._deadkeyKeys.some((deadKey) => deadKey === `${this.key}`);
    }
    get hasIcon() {
        return this.icon !== undefined && this.icon !== null;
    }
    get iconName() {
        return this.icon.name || '';
    }
    get fontSet() {
        return this.icon.fontSet || '';
    }
    get fontIcon() {
        return this.icon.fontIcon || '';
    }
    get svgIcon() {
        return this.icon.svgIcon || '';
    }
    get cssClass() {
        const classes = [];
        if (this.hasIcon) {
            classes.push('mat-keyboard-key-modifier');
            classes.push(`mat-keyboard-key-${this.lowerKey}`);
        }
        if (this.isDeadKey) {
            classes.push('mat-keyboard-key-deadkey');
        }
        return classes.join(' ');
    }
    get inputValue() {
        if (this.control) {
            return this.control.value;
        }
        else if (this.input && this.input.nativeElement && this.input.nativeElement.value) {
            return this.input.nativeElement.value;
        }
        else {
            return '';
        }
    }
    set inputValue(inputValue) {
        if (this.control) {
            this.control.setValue(inputValue);
        }
        else if (this.input && this.input.nativeElement) {
            this.input.nativeElement.value = inputValue;
        }
    }
    ngOnInit() {
        // read the deadkeys
        this._deadkeyKeys = Object.keys(this._deadkeys);
    }
    ngOnDestroy() {
        this.cancelRepeat();
    }
    onClick(event) {
        // Trigger generic click event
        this.genericClick.emit(event);
        // Do not execute keypress if key is currently repeating
        if (this._repeatState) {
            return;
        }
        // Trigger a global key event. TODO: investigate
        // this._triggerKeyEvent();
        // Manipulate the focused input / textarea value
        const caret = this.input ? this._getCursorPosition() : 0;
        let char;
        switch (this.key) {
            // this keys have no actions yet
            // TODO: add deadkeys and modifiers
            case KeyboardClassKey.Alt:
            case KeyboardClassKey.AltGr:
            case KeyboardClassKey.AltLk:
                this.altClick.emit(event);
                break;
            case KeyboardClassKey.Bksp:
                this.deleteSelectedText();
                this.bkspClick.emit(event);
                break;
            case KeyboardClassKey.Caps:
                this.capsClick.emit(event);
                break;
            case KeyboardClassKey.Enter:
                if (this._isTextarea()) {
                    char = VALUE_NEWLINE;
                }
                else {
                    this.enterClick.emit(event);
                    // TODO: trigger submit / onSubmit / ngSubmit properly (for the time being this has to be handled by the user himself)
                    // console.log(this.control.ngControl.control.root)
                    // this.input.nativeElement.form.submit();
                }
                break;
            case KeyboardClassKey.Shift:
                this.shiftClick.emit(event);
                break;
            case KeyboardClassKey.Space:
                char = VALUE_SPACE;
                this.spaceClick.emit(event);
                break;
            case KeyboardClassKey.Tab:
                char = VALUE_TAB;
                this.tabClick.emit(event);
                break;
            default:
                // the key is not mapped or a string
                char = `${this.key}`;
                this.keyClick.emit(event);
                break;
        }
        if (char && this.input) {
            this.replaceSelectedText(char);
            this._setCursorPosition(caret + 1);
        }
        // Dispatch Input Event for Angular to register a change
        if (this.input && this.input.nativeElement) {
            setTimeout(() => {
                this.input.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
    }
    // Handle repeating keys. Keypress logic derived from onClick()
    onPointerDown() {
        this.cancelRepeat();
        this._repeatState = false;
        this._repeatTimeoutHandler = setTimeout(() => {
            // Initialize keypress variables
            let char;
            let keyFn;
            switch (this.key) {
                // Ignore non-repeating keys
                case KeyboardClassKey.Alt:
                case KeyboardClassKey.AltGr:
                case KeyboardClassKey.AltLk:
                case KeyboardClassKey.Caps:
                case KeyboardClassKey.Enter:
                case KeyboardClassKey.Shift:
                    return;
                case KeyboardClassKey.Bksp:
                    keyFn = () => {
                        this.deleteSelectedText();
                        this.bkspClick.emit();
                    };
                    break;
                case KeyboardClassKey.Space:
                    char = VALUE_SPACE;
                    keyFn = () => this.spaceClick.emit();
                    break;
                case KeyboardClassKey.Tab:
                    char = VALUE_TAB;
                    keyFn = () => this.tabClick.emit();
                    break;
                default:
                    char = `${this.key}`;
                    keyFn = () => this.keyClick.emit();
                    break;
            }
            // Execute repeating keypress
            this._repeatIntervalHandler = setInterval(() => {
                const caret = this.input ? this._getCursorPosition() : 0;
                this._repeatState = true;
                if (keyFn) {
                    keyFn();
                }
                if (char && this.input) {
                    this.replaceSelectedText(char);
                    this._setCursorPosition(caret + 1);
                }
                if (this.input && this.input.nativeElement) {
                    setTimeout(() => this.input.nativeElement.dispatchEvent(new Event('input', { bubbles: true })));
                }
            }, REPEAT_INTERVAL);
        }, REPEAT_TIMEOUT);
    }
    cancelRepeat() {
        if (this._repeatTimeoutHandler) {
            clearTimeout(this._repeatTimeoutHandler);
            this._repeatTimeoutHandler = null;
        }
        if (this._repeatIntervalHandler) {
            clearInterval(this._repeatIntervalHandler);
            this._repeatIntervalHandler = null;
        }
    }
    deleteSelectedText() {
        const value = this.inputValue ? this.inputValue.toString() : '';
        let caret = this.input ? this._getCursorPosition() : 0;
        let selectionLength = this._getSelectionLength();
        if (selectionLength === 0) {
            if (caret === 0) {
                return;
            }
            caret--;
            selectionLength = 1;
        }
        const headPart = value.slice(0, caret);
        const endPart = value.slice(caret + selectionLength);
        this.inputValue = [headPart, endPart].join('');
        this._setCursorPosition(caret);
    }
    replaceSelectedText(char) {
        const value = this.inputValue ? this.inputValue.toString() : '';
        const caret = this.input ? this._getCursorPosition() : 0;
        const selectionLength = this._getSelectionLength();
        const headPart = value.slice(0, caret);
        const endPart = value.slice(caret + selectionLength);
        this.inputValue = [headPart, char, endPart].join('');
    }
    // TODO: Include for repeating keys as well (if this gets implemented)
    // private _triggerKeyEvent(): Event {
    //   const keyboardEvent = new KeyboardEvent('keydown');
    //   //
    //   // keyboardEvent[initMethod](
    //   //   true, // bubbles
    //   //   true, // cancelable
    //   //   window, // viewArg: should be window
    //   //   false, // ctrlKeyArg
    //   //   false, // altKeyArg
    //   //   false, // shiftKeyArg
    //   //   false, // metaKeyArg
    //   //   this.charCode, // keyCodeArg : unsigned long - the virtual key code, else 0
    //   //   0 // charCodeArgs : unsigned long - the Unicode character associated with the depressed key, else 0
    //   // );
    //   //
    //   // window.document.dispatchEvent(keyboardEvent);
    //   return keyboardEvent;
    // }
    // inspired by:
    // ref https://stackoverflow.com/a/2897510/1146207
    _getCursorPosition() {
        if (!this.input) {
            return;
        }
        if ('selectionStart' in this.input.nativeElement) {
            // Standard-compliant browsers
            return this.input.nativeElement.selectionStart;
        }
        else if ('selection' in window.document) {
            // IE
            this.input.nativeElement.focus();
            const selection = window.document['selection'];
            const sel = selection.createRange();
            const selLen = selection.createRange().text.length;
            sel.moveStart('character', -this.control.value.length);
            return sel.text.length - selLen;
        }
    }
    _getSelectionLength() {
        if (!this.input) {
            return;
        }
        if ('selectionEnd' in this.input.nativeElement) {
            // Standard-compliant browsers
            return this.input.nativeElement.selectionEnd - this.input.nativeElement.selectionStart;
        }
        if ('selection' in window.document) {
            // IE
            this.input.nativeElement.focus();
            const selection = window.document['selection'];
            return selection.createRange().text.length;
        }
    }
    // inspired by:
    // ref https://stackoverflow.com/a/12518737/1146207
    // tslint:disable one-line
    _setCursorPosition(position) {
        if (!this.input) {
            return;
        }
        this.inputValue = this.control.value;
        // ^ this is used to not only get "focus", but
        // to make sure we don't have it everything -selected-
        // (it causes an issue in chrome, and having it doesn't hurt any other browser)
        if ('createTextRange' in this.input.nativeElement) {
            const range = this.input.nativeElement.createTextRange();
            range.move('character', position);
            range.select();
            return true;
        }
        else {
            // (el.selectionStart === 0 added for Firefox bug)
            if (this.input.nativeElement.selectionStart || this.input.nativeElement.selectionStart === 0) {
                this.input.nativeElement.focus();
                this.input.nativeElement.setSelectionRange(position, position);
                return true;
            }
            // fail city, fortunately this never happens (as far as I've tested) :)
            else {
                this.input.nativeElement.focus();
                return false;
            }
        }
    }
    _isTextarea() {
        return this.input && this.input.nativeElement && this.input.nativeElement.tagName === 'TEXTAREA';
    }
};
MatKeyboardKeyComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [MAT_KEYBOARD_DEADKEYS,] }] }
];
__decorate([
    Input()
], MatKeyboardKeyComponent.prototype, "key", void 0);
__decorate([
    Input()
], MatKeyboardKeyComponent.prototype, "icon", void 0);
__decorate([
    Input()
], MatKeyboardKeyComponent.prototype, "active", null);
__decorate([
    Input()
], MatKeyboardKeyComponent.prototype, "pressed", null);
__decorate([
    Input()
], MatKeyboardKeyComponent.prototype, "input", void 0);
__decorate([
    Input()
], MatKeyboardKeyComponent.prototype, "control", void 0);
__decorate([
    Output()
], MatKeyboardKeyComponent.prototype, "genericClick", void 0);
__decorate([
    Output()
], MatKeyboardKeyComponent.prototype, "enterClick", void 0);
__decorate([
    Output()
], MatKeyboardKeyComponent.prototype, "bkspClick", void 0);
__decorate([
    Output()
], MatKeyboardKeyComponent.prototype, "capsClick", void 0);
__decorate([
    Output()
], MatKeyboardKeyComponent.prototype, "altClick", void 0);
__decorate([
    Output()
], MatKeyboardKeyComponent.prototype, "shiftClick", void 0);
__decorate([
    Output()
], MatKeyboardKeyComponent.prototype, "spaceClick", void 0);
__decorate([
    Output()
], MatKeyboardKeyComponent.prototype, "tabClick", void 0);
__decorate([
    Output()
], MatKeyboardKeyComponent.prototype, "keyClick", void 0);
MatKeyboardKeyComponent = __decorate([
    Component({
        selector: 'mat-keyboard-key',
        template: "<button mat-raised-button\r\n        class=\"mat-keyboard-key\"\r\n        tabindex=\"-1\"\r\n        [class.mat-keyboard-key-active]=\"active$ | async\"\r\n        [class.mat-keyboard-key-pressed]=\"pressed$ | async\"\r\n        [ngClass]=\"cssClass\"\r\n        (click)=\"onClick($event)\"\r\n        (pointerdown)=\"onPointerDown()\"\r\n        (pointerleave)=\"cancelRepeat()\"\r\n        (pointerup)=\"cancelRepeat()\"\r\n>\r\n  <mat-icon *ngIf=\"hasIcon; else noIcon\" [fontSet]=\"fontSet\" [fontIcon]=\"fontIcon\" [svgIcon]=\"svgIcon\">{{ iconName }}</mat-icon>\r\n  <ng-template #noIcon>{{ key }}</ng-template>\r\n</button>\r\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        preserveWhitespaces: false,
        styles: ["@charset \"UTF-8\";:host{display:-webkit-box;display:flex;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-size:14px;-webkit-box-pack:justify;justify-content:space-between;line-height:20px}.mat-keyboard-key{min-width:0;width:100%}.mat-keyboard-key-active{background-color:#e0e0e0}.mat-keyboard-key-pressed{background-color:#bdbdbd}.mat-keyboard-key-capslock{background-color:#fff}.mat-keyboard-key-capslock:before{background-color:#bdbdbd;border-radius:100%;content:\"\";display:inline-block;height:3px;left:5px;position:absolute;top:5px;-webkit-transition:.4s cubic-bezier(.25,.8,.25,1);transition:.4s cubic-bezier(.25,.8,.25,1);-webkit-transition-property:background-color,box-shadow;transition-property:background-color,box-shadow;width:3px}.mat-keyboard-key-capslock.mat-keyboard-key-active:before{background-color:#0f0;box-shadow:0 0 \u00A7px #adff2f}:host-context(.dark-theme) .mat-keyboard-key{background-color:#616161;color:#f5f5f5}:host-context(.dark-theme) .mat-keyboard-key-active{background-color:#9e9e9e}:host-context(.dark-theme) .mat-keyboard-key-pressed{background-color:#757575}:host-context(.debug) .mat-keyboard-key-deadkey{background-color:#5f9ea0}:host-context(.debug) .mat-keyboard-key-deadkey.mat-keyboard-key-active{background-color:#6fa8aa}:host-context(.debug) .mat-keyboard-key-deadkey.mat-keyboard-key-pressed{background-color:#7fb1b3}:host-context(.debug) .mat-keyboard-key-modifier{background-color:#7fffd4}:host-context(.debug) .mat-keyboard-key-modifier.mat-keyboard-key-active{background-color:#9fd}:host-context(.debug) .mat-keyboard-key-modifier.mat-keyboard-key-pressed{background-color:#b2ffe5}:host-context(.dark-theme.debug) .mat-keyboard-key-deadkey{background-color:#663399}:host-context(.dark-theme.debug) .mat-keyboard-key-deadkey.mat-keyboard-key-active{background-color:#7339ac}:host-context(.dark-theme.debug) .mat-keyboard-key-deadkey.mat-keyboard-key-pressed{background-color:#8040bf}:host-context(.dark-theme.debug) .mat-keyboard-key-modifier{background-color:#9370db}:host-context(.dark-theme.debug) .mat-keyboard-key-modifier.mat-keyboard-key-active{background-color:#a284e0}:host-context(.dark-theme.debug) .mat-keyboard-key-modifier.mat-keyboard-key-pressed{background-color:#b299e5}"]
    }),
    __param(0, Inject(MAT_KEYBOARD_DEADKEYS))
], MatKeyboardKeyComponent);
export { MatKeyboardKeyComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQta2V5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItb25zY3JlZW4tbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2tleWJvYXJkLWtleS9rZXlib2FyZC1rZXkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkksT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUl2RSxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDL0IsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQztBQUM5QixNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDM0IsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDO0FBUzVCLElBQWEsdUJBQXVCLEdBQXBDLE1BQWEsdUJBQXVCO0lBeUlsQyxzQkFBc0I7SUFDdEIsWUFBbUQsU0FBNEI7UUFBNUIsY0FBUyxHQUFULFNBQVMsQ0FBbUI7UUF4SXZFLGlCQUFZLEdBQWEsRUFBRSxDQUFDO1FBRzVCLGlCQUFZLEdBQVksS0FBSyxDQUFDLENBQUMsc0NBQXNDO1FBRTdFLFlBQU8sR0FBNkIsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0QsYUFBUSxHQUE2QixJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQWlDaEUsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRzlD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QUU7eURBQ2lDO0FBRzFDO0lBREMsTUFBTSxFQUFFOzJEQUNtQztBQUc1QztJQURDLE1BQU0sRUFBRTsyREFDbUM7QUFHNUM7SUFEQyxNQUFNLEVBQUU7eURBQ2lDO0FBRzFDO0lBREMsTUFBTSxFQUFFO3lEQUNpQztBQWxFL0IsdUJBQXVCO0lBUG5DLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxrQkFBa0I7UUFDNUIsdW9CQUE0QztRQUU1QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtRQUMvQyxtQkFBbUIsRUFBRSxLQUFLOztLQUMzQixDQUFDO0lBMklhLFdBQUEsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUE7R0ExSS9CLHVCQUF1QixDQTRhbkM7U0E1YVksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTUFUX0tFWUJPQVJEX0RFQURLRVlTIH0gZnJvbSAnLi4vLi4vY29uZmlncy9rZXlib2FyZC1kZWFka2V5LmNvbmZpZyc7XHJcbmltcG9ydCB7IEtleWJvYXJkQ2xhc3NLZXkgfSBmcm9tICcuLi8uLi9lbnVtcy9rZXlib2FyZC1jbGFzcy1rZXkuZW51bSc7XHJcbmltcG9ydCB7IElLZXlib2FyZERlYWRrZXlzIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9rZXlib2FyZC1kZWFka2V5cy5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBJTWF0SWNvbiB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMva2V5Ym9hcmQtaWNvbnMuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjb25zdCBWQUxVRV9ORVdMSU5FID0gJ1xcblxccic7XHJcbmV4cG9ydCBjb25zdCBWQUxVRV9TUEFDRSA9ICcgJztcclxuZXhwb3J0IGNvbnN0IFZBTFVFX1RBQiA9ICdcXHQnO1xyXG5jb25zdCBSRVBFQVRfVElNRU9VVCA9IDUwMDtcclxuY29uc3QgUkVQRUFUX0lOVEVSVkFMID0gMTAwO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdtYXQta2V5Ym9hcmQta2V5JyxcclxuICB0ZW1wbGF0ZVVybDogJy4va2V5Ym9hcmQta2V5LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9rZXlib2FyZC1rZXkuY29tcG9uZW50LnNjc3MnXSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTWF0S2V5Ym9hcmRLZXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcblxyXG4gIHByaXZhdGUgX2RlYWRrZXlLZXlzOiBzdHJpbmdbXSA9IFtdO1xyXG4gIHByaXZhdGUgX3JlcGVhdFRpbWVvdXRIYW5kbGVyOiBhbnk7XHJcbiAgcHJpdmF0ZSBfcmVwZWF0SW50ZXJ2YWxIYW5kbGVyOiBhbnk7XHJcbiAgcHJpdmF0ZSBfcmVwZWF0U3RhdGU6IGJvb2xlYW4gPSBmYWxzZTsgLy8gdHJ1ZSBpZiByZXBlYXRpbmcsIGZhbHNlIGlmIHdhaXRpbmdcclxuXHJcbiAgYWN0aXZlJDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XHJcblxyXG4gIHByZXNzZWQkOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcclxuXHJcbiAgQElucHV0KClcclxuICBrZXk6IHN0cmluZyB8IEtleWJvYXJkQ2xhc3NLZXk7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgaWNvbjogSU1hdEljb247XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgc2V0IGFjdGl2ZShhY3RpdmU6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuYWN0aXZlJC5uZXh0KGFjdGl2ZSk7XHJcbiAgfVxyXG5cclxuICBnZXQgYWN0aXZlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlJC5nZXRWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBzZXQgcHJlc3NlZChwcmVzc2VkOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLnByZXNzZWQkLm5leHQocHJlc3NlZCk7XHJcbiAgfVxyXG5cclxuICBnZXQgcHJlc3NlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnByZXNzZWQkLmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKVxyXG4gIGlucHV0PzogRWxlbWVudFJlZjtcclxuXHJcbiAgQElucHV0KClcclxuICBjb250cm9sPzogRm9ybUNvbnRyb2w7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGdlbmVyaWNDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgZW50ZXJDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgYmtzcENsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBjYXBzQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGFsdENsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBzaGlmdENsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBzcGFjZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICB0YWJDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAga2V5Q2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIGdldCBsb3dlcktleSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGAke3RoaXMua2V5fWAudG9Mb3dlckNhc2UoKTtcclxuICB9XHJcblxyXG4gIGdldCBjaGFyQ29kZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGAke3RoaXMua2V5fWAuY2hhckNvZGVBdCgwKTtcclxuICB9XHJcblxyXG4gIGdldCBpc0NsYXNzS2V5KCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMua2V5IGluIEtleWJvYXJkQ2xhc3NLZXk7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNEZWFkS2V5KCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RlYWRrZXlLZXlzLnNvbWUoKGRlYWRLZXk6IHN0cmluZykgPT4gZGVhZEtleSA9PT0gYCR7dGhpcy5rZXl9YCk7XHJcbiAgfVxyXG5cclxuICBnZXQgaGFzSWNvbigpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmljb24gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmljb24gIT09IG51bGw7XHJcbiAgfVxyXG5cclxuICBnZXQgaWNvbk5hbWUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmljb24ubmFtZSB8fCAnJztcclxuICB9XHJcblxyXG4gIGdldCBmb250U2V0KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uLmZvbnRTZXQgfHwgJyc7XHJcbiAgfVxyXG5cclxuICBnZXQgZm9udEljb24oKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmljb24uZm9udEljb24gfHwgJyc7XHJcbiAgfVxyXG5cclxuICBnZXQgc3ZnSWNvbigpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbi5zdmdJY29uIHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNzc0NsYXNzKCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjbGFzc2VzID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMuaGFzSWNvbikge1xyXG4gICAgICBjbGFzc2VzLnB1c2goJ21hdC1rZXlib2FyZC1rZXktbW9kaWZpZXInKTtcclxuICAgICAgY2xhc3Nlcy5wdXNoKGBtYXQta2V5Ym9hcmQta2V5LSR7dGhpcy5sb3dlcktleX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0RlYWRLZXkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKCdtYXQta2V5Ym9hcmQta2V5LWRlYWRrZXknKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XHJcbiAgfVxyXG5cclxuICBnZXQgaW5wdXRWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgaWYgKHRoaXMuY29udHJvbCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sLnZhbHVlO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlucHV0ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldCBpbnB1dFZhbHVlKGlucHV0VmFsdWU6IHN0cmluZykge1xyXG4gICAgaWYgKHRoaXMuY29udHJvbCkge1xyXG4gICAgICB0aGlzLmNvbnRyb2wuc2V0VmFsdWUoaW5wdXRWYWx1ZSk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9IGlucHV0VmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBJbmplY3QgZGVwZW5kZW5jaWVzXHJcbiAgY29uc3RydWN0b3IoQEluamVjdChNQVRfS0VZQk9BUkRfREVBREtFWVMpIHByaXZhdGUgX2RlYWRrZXlzOiBJS2V5Ym9hcmREZWFka2V5cykgeyB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy8gcmVhZCB0aGUgZGVhZGtleXNcclxuICAgIHRoaXMuX2RlYWRrZXlLZXlzID0gT2JqZWN0LmtleXModGhpcy5fZGVhZGtleXMpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLmNhbmNlbFJlcGVhdCgpO1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgLy8gVHJpZ2dlciBnZW5lcmljIGNsaWNrIGV2ZW50XHJcbiAgICB0aGlzLmdlbmVyaWNDbGljay5lbWl0KGV2ZW50KTtcclxuXHJcbiAgICAvLyBEbyBub3QgZXhlY3V0ZSBrZXlwcmVzcyBpZiBrZXkgaXMgY3VycmVudGx5IHJlcGVhdGluZ1xyXG4gICAgaWYgKHRoaXMuX3JlcGVhdFN0YXRlKSB7IHJldHVybjsgfVxyXG5cclxuICAgIC8vIFRyaWdnZXIgYSBnbG9iYWwga2V5IGV2ZW50LiBUT0RPOiBpbnZlc3RpZ2F0ZVxyXG4gICAgLy8gdGhpcy5fdHJpZ2dlcktleUV2ZW50KCk7XHJcblxyXG4gICAgLy8gTWFuaXB1bGF0ZSB0aGUgZm9jdXNlZCBpbnB1dCAvIHRleHRhcmVhIHZhbHVlXHJcbiAgICBjb25zdCBjYXJldCA9IHRoaXMuaW5wdXQgPyB0aGlzLl9nZXRDdXJzb3JQb3NpdGlvbigpIDogMDtcclxuXHJcbiAgICBsZXQgY2hhcjogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBzd2l0Y2ggKHRoaXMua2V5KSB7XHJcbiAgICAgIC8vIHRoaXMga2V5cyBoYXZlIG5vIGFjdGlvbnMgeWV0XHJcbiAgICAgIC8vIFRPRE86IGFkZCBkZWFka2V5cyBhbmQgbW9kaWZpZXJzXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHQ6XHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHRHcjpcclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkFsdExrOlxyXG4gICAgICAgIHRoaXMuYWx0Q2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQmtzcDpcclxuICAgICAgICB0aGlzLmRlbGV0ZVNlbGVjdGVkVGV4dCgpO1xyXG4gICAgICAgIHRoaXMuYmtzcENsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkNhcHM6XHJcbiAgICAgICAgdGhpcy5jYXBzQ2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuRW50ZXI6XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVGV4dGFyZWEoKSkge1xyXG4gICAgICAgICAgY2hhciA9IFZBTFVFX05FV0xJTkU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZW50ZXJDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICAgIC8vIFRPRE86IHRyaWdnZXIgc3VibWl0IC8gb25TdWJtaXQgLyBuZ1N1Ym1pdCBwcm9wZXJseSAoZm9yIHRoZSB0aW1lIGJlaW5nIHRoaXMgaGFzIHRvIGJlIGhhbmRsZWQgYnkgdGhlIHVzZXIgaGltc2VsZilcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY29udHJvbC5uZ0NvbnRyb2wuY29udHJvbC5yb290KVxyXG4gICAgICAgICAgLy8gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvcm0uc3VibWl0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlNoaWZ0OlxyXG4gICAgICAgIHRoaXMuc2hpZnRDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5TcGFjZTpcclxuICAgICAgICBjaGFyID0gVkFMVUVfU1BBQ0U7XHJcbiAgICAgICAgdGhpcy5zcGFjZUNsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlRhYjpcclxuICAgICAgICBjaGFyID0gVkFMVUVfVEFCO1xyXG4gICAgICAgIHRoaXMudGFiQ2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIC8vIHRoZSBrZXkgaXMgbm90IG1hcHBlZCBvciBhIHN0cmluZ1xyXG4gICAgICAgIGNoYXIgPSBgJHt0aGlzLmtleX1gO1xyXG4gICAgICAgIHRoaXMua2V5Q2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYXIgJiYgdGhpcy5pbnB1dCkge1xyXG4gICAgICB0aGlzLnJlcGxhY2VTZWxlY3RlZFRleHQoY2hhcik7XHJcbiAgICAgIHRoaXMuX3NldEN1cnNvclBvc2l0aW9uKGNhcmV0ICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGlzcGF0Y2ggSW5wdXQgRXZlbnQgZm9yIEFuZ3VsYXIgdG8gcmVnaXN0ZXIgYSBjaGFuZ2VcclxuICAgIGlmICh0aGlzLmlucHV0ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBIYW5kbGUgcmVwZWF0aW5nIGtleXMuIEtleXByZXNzIGxvZ2ljIGRlcml2ZWQgZnJvbSBvbkNsaWNrKClcclxuICBvblBvaW50ZXJEb3duKCkge1xyXG4gICAgdGhpcy5jYW5jZWxSZXBlYXQoKTtcclxuICAgIHRoaXMuX3JlcGVhdFN0YXRlID0gZmFsc2U7XHJcbiAgICB0aGlzLl9yZXBlYXRUaW1lb3V0SGFuZGxlciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAvLyBJbml0aWFsaXplIGtleXByZXNzIHZhcmlhYmxlc1xyXG4gICAgICBsZXQgY2hhcjogc3RyaW5nO1xyXG4gICAgICBsZXQga2V5Rm46ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMua2V5KSB7XHJcbiAgICAgICAgLy8gSWdub3JlIG5vbi1yZXBlYXRpbmcga2V5c1xyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHQ6XHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkFsdEdyOlxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHRMazpcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQ2FwczpcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuRW50ZXI6XHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlNoaWZ0OlxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQmtzcDpcclxuICAgICAgICAgIGtleUZuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZVNlbGVjdGVkVGV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLmJrc3BDbGljay5lbWl0KCk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5TcGFjZTpcclxuICAgICAgICAgIGNoYXIgPSBWQUxVRV9TUEFDRTtcclxuICAgICAgICAgIGtleUZuID0gKCkgPT4gdGhpcy5zcGFjZUNsaWNrLmVtaXQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuVGFiOlxyXG4gICAgICAgICAgY2hhciA9IFZBTFVFX1RBQjtcclxuICAgICAgICAgIGtleUZuID0gKCkgPT4gdGhpcy50YWJDbGljay5lbWl0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGNoYXIgPSBgJHt0aGlzLmtleX1gO1xyXG4gICAgICAgICAga2V5Rm4gPSAoKSA9PiB0aGlzLmtleUNsaWNrLmVtaXQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBFeGVjdXRlIHJlcGVhdGluZyBrZXlwcmVzc1xyXG4gICAgICB0aGlzLl9yZXBlYXRJbnRlcnZhbEhhbmRsZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2FyZXQgPSB0aGlzLmlucHV0ID8gdGhpcy5fZ2V0Q3Vyc29yUG9zaXRpb24oKSA6IDA7XHJcbiAgICAgICAgdGhpcy5fcmVwZWF0U3RhdGUgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoa2V5Rm4pIHsga2V5Rm4oKTsgfVxyXG5cclxuICAgICAgICBpZiAoY2hhciAmJiB0aGlzLmlucHV0KSB7XHJcbiAgICAgICAgICB0aGlzLnJlcGxhY2VTZWxlY3RlZFRleHQoY2hhcik7XHJcbiAgICAgICAgICB0aGlzLl9zZXRDdXJzb3JQb3NpdGlvbihjYXJldCArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFJFUEVBVF9JTlRFUlZBTCk7XHJcbiAgICB9LCBSRVBFQVRfVElNRU9VVCk7XHJcbiAgfVxyXG5cclxuICBjYW5jZWxSZXBlYXQoKSB7XHJcbiAgICBpZiAodGhpcy5fcmVwZWF0VGltZW91dEhhbmRsZXIpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlcGVhdFRpbWVvdXRIYW5kbGVyKTtcclxuICAgICAgdGhpcy5fcmVwZWF0VGltZW91dEhhbmRsZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9yZXBlYXRJbnRlcnZhbEhhbmRsZXIpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9yZXBlYXRJbnRlcnZhbEhhbmRsZXIpO1xyXG4gICAgICB0aGlzLl9yZXBlYXRJbnRlcnZhbEhhbmRsZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZWxldGVTZWxlY3RlZFRleHQoKTogdm9pZCB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaW5wdXRWYWx1ZSA/IHRoaXMuaW5wdXRWYWx1ZS50b1N0cmluZygpIDogJyc7XHJcbiAgICBsZXQgY2FyZXQgPSB0aGlzLmlucHV0ID8gdGhpcy5fZ2V0Q3Vyc29yUG9zaXRpb24oKSA6IDA7XHJcbiAgICBsZXQgc2VsZWN0aW9uTGVuZ3RoID0gdGhpcy5fZ2V0U2VsZWN0aW9uTGVuZ3RoKCk7XHJcbiAgICBpZiAoc2VsZWN0aW9uTGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGlmIChjYXJldCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FyZXQtLTtcclxuICAgICAgc2VsZWN0aW9uTGVuZ3RoID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBoZWFkUGFydCA9IHZhbHVlLnNsaWNlKDAsIGNhcmV0KTtcclxuICAgIGNvbnN0IGVuZFBhcnQgPSB2YWx1ZS5zbGljZShjYXJldCArIHNlbGVjdGlvbkxlbmd0aCk7XHJcblxyXG4gICAgdGhpcy5pbnB1dFZhbHVlID0gW2hlYWRQYXJ0LCBlbmRQYXJ0XS5qb2luKCcnKTtcclxuICAgIHRoaXMuX3NldEN1cnNvclBvc2l0aW9uKGNhcmV0KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVwbGFjZVNlbGVjdGVkVGV4dChjaGFyOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5pbnB1dFZhbHVlID8gdGhpcy5pbnB1dFZhbHVlLnRvU3RyaW5nKCkgOiAnJztcclxuICAgIGNvbnN0IGNhcmV0ID0gdGhpcy5pbnB1dCA/IHRoaXMuX2dldEN1cnNvclBvc2l0aW9uKCkgOiAwO1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uTGVuZ3RoID0gdGhpcy5fZ2V0U2VsZWN0aW9uTGVuZ3RoKCk7XHJcbiAgICBjb25zdCBoZWFkUGFydCA9IHZhbHVlLnNsaWNlKDAsIGNhcmV0KTtcclxuICAgIGNvbnN0IGVuZFBhcnQgPSB2YWx1ZS5zbGljZShjYXJldCArIHNlbGVjdGlvbkxlbmd0aCk7XHJcblxyXG4gICAgdGhpcy5pbnB1dFZhbHVlID0gW2hlYWRQYXJ0LCBjaGFyLCBlbmRQYXJ0XS5qb2luKCcnKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE86IEluY2x1ZGUgZm9yIHJlcGVhdGluZyBrZXlzIGFzIHdlbGwgKGlmIHRoaXMgZ2V0cyBpbXBsZW1lbnRlZClcclxuICAvLyBwcml2YXRlIF90cmlnZ2VyS2V5RXZlbnQoKTogRXZlbnQge1xyXG4gIC8vICAgY29uc3Qga2V5Ym9hcmRFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KCdrZXlkb3duJyk7XHJcbiAgLy8gICAvL1xyXG4gIC8vICAgLy8ga2V5Ym9hcmRFdmVudFtpbml0TWV0aG9kXShcclxuICAvLyAgIC8vICAgdHJ1ZSwgLy8gYnViYmxlc1xyXG4gIC8vICAgLy8gICB0cnVlLCAvLyBjYW5jZWxhYmxlXHJcbiAgLy8gICAvLyAgIHdpbmRvdywgLy8gdmlld0FyZzogc2hvdWxkIGJlIHdpbmRvd1xyXG4gIC8vICAgLy8gICBmYWxzZSwgLy8gY3RybEtleUFyZ1xyXG4gIC8vICAgLy8gICBmYWxzZSwgLy8gYWx0S2V5QXJnXHJcbiAgLy8gICAvLyAgIGZhbHNlLCAvLyBzaGlmdEtleUFyZ1xyXG4gIC8vICAgLy8gICBmYWxzZSwgLy8gbWV0YUtleUFyZ1xyXG4gIC8vICAgLy8gICB0aGlzLmNoYXJDb2RlLCAvLyBrZXlDb2RlQXJnIDogdW5zaWduZWQgbG9uZyAtIHRoZSB2aXJ0dWFsIGtleSBjb2RlLCBlbHNlIDBcclxuICAvLyAgIC8vICAgMCAvLyBjaGFyQ29kZUFyZ3MgOiB1bnNpZ25lZCBsb25nIC0gdGhlIFVuaWNvZGUgY2hhcmFjdGVyIGFzc29jaWF0ZWQgd2l0aCB0aGUgZGVwcmVzc2VkIGtleSwgZWxzZSAwXHJcbiAgLy8gICAvLyApO1xyXG4gIC8vICAgLy9cclxuICAvLyAgIC8vIHdpbmRvdy5kb2N1bWVudC5kaXNwYXRjaEV2ZW50KGtleWJvYXJkRXZlbnQpO1xyXG5cclxuICAvLyAgIHJldHVybiBrZXlib2FyZEV2ZW50O1xyXG4gIC8vIH1cclxuXHJcbiAgLy8gaW5zcGlyZWQgYnk6XHJcbiAgLy8gcmVmIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yODk3NTEwLzExNDYyMDdcclxuICBwcml2YXRlIF9nZXRDdXJzb3JQb3NpdGlvbigpOiBudW1iZXIge1xyXG4gICAgaWYgKCF0aGlzLmlucHV0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJ3NlbGVjdGlvblN0YXJ0JyBpbiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgLy8gU3RhbmRhcmQtY29tcGxpYW50IGJyb3dzZXJzXHJcbiAgICAgIHJldHVybiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICB9IGVsc2UgaWYgKCdzZWxlY3Rpb24nIGluIHdpbmRvdy5kb2N1bWVudCkge1xyXG4gICAgICAvLyBJRVxyXG4gICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgY29uc3Qgc2VsZWN0aW9uOiBhbnkgPSB3aW5kb3cuZG9jdW1lbnRbJ3NlbGVjdGlvbiddO1xyXG4gICAgICBjb25zdCBzZWwgPSBzZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcclxuICAgICAgY29uc3Qgc2VsTGVuID0gc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dC5sZW5ndGg7XHJcbiAgICAgIHNlbC5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC10aGlzLmNvbnRyb2wudmFsdWUubGVuZ3RoKTtcclxuXHJcbiAgICAgIHJldHVybiBzZWwudGV4dC5sZW5ndGggLSBzZWxMZW47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9nZXRTZWxlY3Rpb25MZW5ndGgoKTogbnVtYmVyIHtcclxuICAgIGlmICghdGhpcy5pbnB1dCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCdzZWxlY3Rpb25FbmQnIGluIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICAvLyBTdGFuZGFyZC1jb21wbGlhbnQgYnJvd3NlcnNcclxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25FbmQgLSB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCdzZWxlY3Rpb24nIGluIHdpbmRvdy5kb2N1bWVudCkge1xyXG4gICAgICAvLyBJRVxyXG4gICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgY29uc3Qgc2VsZWN0aW9uOiBhbnkgPSB3aW5kb3cuZG9jdW1lbnRbJ3NlbGVjdGlvbiddO1xyXG4gICAgICByZXR1cm4gc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dC5sZW5ndGg7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpbnNwaXJlZCBieTpcclxuICAvLyByZWYgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEyNTE4NzM3LzExNDYyMDdcclxuICAvLyB0c2xpbnQ6ZGlzYWJsZSBvbmUtbGluZVxyXG4gIHByaXZhdGUgX3NldEN1cnNvclBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIGlmICghdGhpcy5pbnB1dCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5jb250cm9sLnZhbHVlO1xyXG4gICAgLy8gXiB0aGlzIGlzIHVzZWQgdG8gbm90IG9ubHkgZ2V0IFwiZm9jdXNcIiwgYnV0XHJcbiAgICAvLyB0byBtYWtlIHN1cmUgd2UgZG9uJ3QgaGF2ZSBpdCBldmVyeXRoaW5nIC1zZWxlY3RlZC1cclxuICAgIC8vIChpdCBjYXVzZXMgYW4gaXNzdWUgaW4gY2hyb21lLCBhbmQgaGF2aW5nIGl0IGRvZXNuJ3QgaHVydCBhbnkgb3RoZXIgYnJvd3NlcilcclxuXHJcbiAgICBpZiAoJ2NyZWF0ZVRleHRSYW5nZScgaW4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmNyZWF0ZVRleHRSYW5nZSgpO1xyXG4gICAgICByYW5nZS5tb3ZlKCdjaGFyYWN0ZXInLCBwb3NpdGlvbik7XHJcbiAgICAgIHJhbmdlLnNlbGVjdCgpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIChlbC5zZWxlY3Rpb25TdGFydCA9PT0gMCBhZGRlZCBmb3IgRmlyZWZveCBidWcpXHJcbiAgICAgIGlmICh0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgfHwgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0ID09PSAwKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKHBvc2l0aW9uLCBwb3NpdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgLy8gZmFpbCBjaXR5LCBmb3J0dW5hdGVseSB0aGlzIG5ldmVyIGhhcHBlbnMgKGFzIGZhciBhcyBJJ3ZlIHRlc3RlZCkgOilcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9pc1RleHRhcmVhKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC50YWdOYW1lID09PSAnVEVYVEFSRUEnO1xyXG4gIH1cclxuXHJcbn1cclxuIl19