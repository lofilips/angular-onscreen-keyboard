import { __decorate, __param } from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
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
    onTouchStart(event) {
        this._timer = setTimeout(() => {
            event.preventDefault();
        }, 1000);
    }
    onTouchEnd(event) {
        if (this._timer) {
            clearTimeout(this._timer);
        }
    }
    onTouchMove(event) {
        if (this._timer) {
            clearTimeout(this._timer);
        }
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
    HostListener('touchstart', ['$event'])
], MatKeyboardKeyComponent.prototype, "onTouchStart", null);
__decorate([
    HostListener('touchend', ['$event'])
], MatKeyboardKeyComponent.prototype, "onTouchEnd", null);
__decorate([
    HostListener('touchmove', ['$event'])
], MatKeyboardKeyComponent.prototype, "onTouchMove", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQta2V5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItb25zY3JlZW4tbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2tleWJvYXJkLWtleS9rZXlib2FyZC1rZXkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXJKLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFJdkUsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUNwQyxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDOUIsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBQzNCLE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQztBQVM1QixJQUFhLHVCQUF1QixHQUFwQyxNQUFhLHVCQUF1QjtJQTZKbEMsc0JBQXNCO0lBQ3RCLFlBQW1ELFNBQTRCO1FBQTVCLGNBQVMsR0FBVCxTQUFTLENBQW1CO1FBNUp2RSxpQkFBWSxHQUFhLEVBQUUsQ0FBQztRQUc1QixpQkFBWSxHQUFZLEtBQUssQ0FBQyxDQUFDLHNDQUFzQztRQUU3RSxZQUFPLEdBQTZCLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9ELGFBQVEsR0FBNkIsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFxRGhFLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQWMs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Z2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IE1BVF9LRVlCT0FSRF9ERUFES0VZUyB9IGZyb20gJy4uLy4uL2NvbmZpZ3Mva2V5Ym9hcmQtZGVhZGtleS5jb25maWcnO1xyXG5pbXBvcnQgeyBLZXlib2FyZENsYXNzS2V5IH0gZnJvbSAnLi4vLi4vZW51bXMva2V5Ym9hcmQtY2xhc3Mta2V5LmVudW0nO1xyXG5pbXBvcnQgeyBJS2V5Ym9hcmREZWFka2V5cyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMva2V5Ym9hcmQtZGVhZGtleXMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgSU1hdEljb24gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2tleWJvYXJkLWljb25zLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY29uc3QgVkFMVUVfTkVXTElORSA9ICdcXG5cXHInO1xyXG5leHBvcnQgY29uc3QgVkFMVUVfU1BBQ0UgPSAnICc7XHJcbmV4cG9ydCBjb25zdCBWQUxVRV9UQUIgPSAnXFx0JztcclxuY29uc3QgUkVQRUFUX1RJTUVPVVQgPSA1MDA7XHJcbmNvbnN0IFJFUEVBVF9JTlRFUlZBTCA9IDEwMDtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWF0LWtleWJvYXJkLWtleScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2tleWJvYXJkLWtleS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4va2V5Ym9hcmQta2V5LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2VcclxufSlcclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkS2V5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG5cclxuICBwcml2YXRlIF9kZWFka2V5S2V5czogc3RyaW5nW10gPSBbXTtcclxuICBwcml2YXRlIF9yZXBlYXRUaW1lb3V0SGFuZGxlcjogYW55O1xyXG4gIHByaXZhdGUgX3JlcGVhdEludGVydmFsSGFuZGxlcjogYW55O1xyXG4gIHByaXZhdGUgX3JlcGVhdFN0YXRlOiBib29sZWFuID0gZmFsc2U7IC8vIHRydWUgaWYgcmVwZWF0aW5nLCBmYWxzZSBpZiB3YWl0aW5nXHJcblxyXG4gIGFjdGl2ZSQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xyXG5cclxuICBwcmVzc2VkJDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XHJcblxyXG4gIHByaXZhdGUgX3RpbWVyOiBhbnk7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbJyRldmVudCddKSBvblRvdWNoU3RhcnQoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSwgMTAwMCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCd0b3VjaGVuZCcsIFsnJGV2ZW50J10pIG9uVG91Y2hFbmQoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fdGltZXIpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNobW92ZScsIFsnJGV2ZW50J10pIG9uVG91Y2hNb3ZlKGV2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuX3RpbWVyKSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKVxyXG4gIGtleTogc3RyaW5nIHwgS2V5Ym9hcmRDbGFzc0tleTtcclxuXHJcbiAgQElucHV0KClcclxuICBpY29uOiBJTWF0SWNvbjtcclxuXHJcbiAgQElucHV0KClcclxuICBzZXQgYWN0aXZlKGFjdGl2ZTogYm9vbGVhbikge1xyXG4gICAgdGhpcy5hY3RpdmUkLm5leHQoYWN0aXZlKTtcclxuICB9XHJcblxyXG4gIGdldCBhY3RpdmUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5hY3RpdmUkLmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKVxyXG4gIHNldCBwcmVzc2VkKHByZXNzZWQ6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMucHJlc3NlZCQubmV4dChwcmVzc2VkKTtcclxuICB9XHJcblxyXG4gIGdldCBwcmVzc2VkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJlc3NlZCQuZ2V0VmFsdWUoKTtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgaW5wdXQ/OiBFbGVtZW50UmVmO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNvbnRyb2w/OiBGb3JtQ29udHJvbDtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgZ2VuZXJpY0NsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBlbnRlckNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBia3NwQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGNhcHNDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgYWx0Q2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHNoaWZ0Q2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHNwYWNlQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHRhYkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBrZXlDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgZ2V0IGxvd2VyS2V5KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5rZXl9YC50b0xvd2VyQ2FzZSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNoYXJDb2RlKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5rZXl9YC5jaGFyQ29kZUF0KDApO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzQ2xhc3NLZXkoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5rZXkgaW4gS2V5Ym9hcmRDbGFzc0tleTtcclxuICB9XHJcblxyXG4gIGdldCBpc0RlYWRLZXkoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGVhZGtleUtleXMuc29tZSgoZGVhZEtleTogc3RyaW5nKSA9PiBkZWFkS2V5ID09PSBgJHt0aGlzLmtleX1gKTtcclxuICB9XHJcblxyXG4gIGdldCBoYXNJY29uKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaWNvbiAhPT0gbnVsbDtcclxuICB9XHJcblxyXG4gIGdldCBpY29uTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbi5uYW1lIHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGZvbnRTZXQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmljb24uZm9udFNldCB8fCAnJztcclxuICB9XHJcblxyXG4gIGdldCBmb250SWNvbigpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbi5mb250SWNvbiB8fCAnJztcclxuICB9XHJcblxyXG4gIGdldCBzdmdJY29uKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uLnN2Z0ljb24gfHwgJyc7XHJcbiAgfVxyXG5cclxuICBnZXQgY3NzQ2xhc3MoKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbXTtcclxuXHJcbiAgICBpZiAodGhpcy5oYXNJY29uKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaCgnbWF0LWtleWJvYXJkLWtleS1tb2RpZmllcicpO1xyXG4gICAgICBjbGFzc2VzLnB1c2goYG1hdC1rZXlib2FyZC1rZXktJHt0aGlzLmxvd2VyS2V5fWApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRGVhZEtleSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goJ21hdC1rZXlib2FyZC1rZXktZGVhZGtleScpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcclxuICB9XHJcblxyXG4gIGdldCBpbnB1dFZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICBpZiAodGhpcy5jb250cm9sKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wudmFsdWU7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0IGlucHV0VmFsdWUoaW5wdXRWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICBpZiAodGhpcy5jb250cm9sKSB7XHJcbiAgICAgIHRoaXMuY29udHJvbC5zZXRWYWx1ZShpbnB1dFZhbHVlKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gaW5wdXRWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEluamVjdCBkZXBlbmRlbmNpZXNcclxuICBjb25zdHJ1Y3RvcihASW5qZWN0KE1BVF9LRVlCT0FSRF9ERUFES0VZUykgcHJpdmF0ZSBfZGVhZGtleXM6IElLZXlib2FyZERlYWRrZXlzKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvLyByZWFkIHRoZSBkZWFka2V5c1xyXG4gICAgdGhpcy5fZGVhZGtleUtleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9kZWFka2V5cyk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMuY2FuY2VsUmVwZWF0KCk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAvLyBUcmlnZ2VyIGdlbmVyaWMgY2xpY2sgZXZlbnRcclxuICAgIHRoaXMuZ2VuZXJpY0NsaWNrLmVtaXQoZXZlbnQpO1xyXG5cclxuICAgIC8vIERvIG5vdCBleGVjdXRlIGtleXByZXNzIGlmIGtleSBpcyBjdXJyZW50bHkgcmVwZWF0aW5nXHJcbiAgICBpZiAodGhpcy5fcmVwZWF0U3RhdGUpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgLy8gVHJpZ2dlciBhIGdsb2JhbCBrZXkgZXZlbnQuIFRPRE86IGludmVzdGlnYXRlXHJcbiAgICAvLyB0aGlzLl90cmlnZ2VyS2V5RXZlbnQoKTtcclxuXHJcbiAgICAvLyBNYW5pcHVsYXRlIHRoZSBmb2N1c2VkIGlucHV0IC8gdGV4dGFyZWEgdmFsdWVcclxuICAgIGNvbnN0IGNhcmV0ID0gdGhpcy5pbnB1dCA/IHRoaXMuX2dldEN1cnNvclBvc2l0aW9uKCkgOiAwO1xyXG5cclxuICAgIGxldCBjaGFyOiBzdHJpbmc7XHJcbiAgICBcclxuICAgIHN3aXRjaCAodGhpcy5rZXkpIHtcclxuICAgICAgLy8gdGhpcyBrZXlzIGhhdmUgbm8gYWN0aW9ucyB5ZXRcclxuICAgICAgLy8gVE9ETzogYWRkIGRlYWRrZXlzIGFuZCBtb2RpZmllcnNcclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkFsdDpcclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkFsdEdyOlxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0TGs6XHJcbiAgICAgICAgdGhpcy5hbHRDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5Ca3NwOlxyXG4gICAgICAgIHRoaXMuZGVsZXRlU2VsZWN0ZWRUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5ia3NwQ2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQ2FwczpcclxuICAgICAgICB0aGlzLmNhcHNDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5FbnRlcjpcclxuICAgICAgICBpZiAodGhpcy5faXNUZXh0YXJlYSgpKSB7XHJcbiAgICAgICAgICBjaGFyID0gVkFMVUVfTkVXTElORTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5lbnRlckNsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgICAgLy8gVE9ETzogdHJpZ2dlciBzdWJtaXQgLyBvblN1Ym1pdCAvIG5nU3VibWl0IHByb3Blcmx5IChmb3IgdGhlIHRpbWUgYmVpbmcgdGhpcyBoYXMgdG8gYmUgaGFuZGxlZCBieSB0aGUgdXNlciBoaW1zZWxmKVxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jb250cm9sLm5nQ29udHJvbC5jb250cm9sLnJvb3QpXHJcbiAgICAgICAgICAvLyB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9ybS5zdWJtaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuU2hpZnQ6XHJcbiAgICAgICAgdGhpcy5zaGlmdENsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlNwYWNlOlxyXG4gICAgICAgIGNoYXIgPSBWQUxVRV9TUEFDRTtcclxuICAgICAgICB0aGlzLnNwYWNlQ2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuVGFiOlxyXG4gICAgICAgIGNoYXIgPSBWQUxVRV9UQUI7XHJcbiAgICAgICAgdGhpcy50YWJDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgLy8gdGhlIGtleSBpcyBub3QgbWFwcGVkIG9yIGEgc3RyaW5nXHJcbiAgICAgICAgY2hhciA9IGAke3RoaXMua2V5fWA7XHJcbiAgICAgICAgdGhpcy5rZXlDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhciAmJiB0aGlzLmlucHV0KSB7XHJcbiAgICAgIHRoaXMucmVwbGFjZVNlbGVjdGVkVGV4dChjaGFyKTtcclxuICAgICAgdGhpcy5fc2V0Q3Vyc29yUG9zaXRpb24oY2FyZXQgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEaXNwYXRjaCBJbnB1dCBFdmVudCBmb3IgQW5ndWxhciB0byByZWdpc3RlciBhIGNoYW5nZVxyXG4gICAgaWYgKHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEhhbmRsZSByZXBlYXRpbmcga2V5cy4gS2V5cHJlc3MgbG9naWMgZGVyaXZlZCBmcm9tIG9uQ2xpY2soKVxyXG4gIG9uUG9pbnRlckRvd24oKSB7XHJcbiAgICB0aGlzLmNhbmNlbFJlcGVhdCgpO1xyXG4gICAgdGhpcy5fcmVwZWF0U3RhdGUgPSBmYWxzZTtcclxuICAgIHRoaXMuX3JlcGVhdFRpbWVvdXRIYW5kbGVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIC8vIEluaXRpYWxpemUga2V5cHJlc3MgdmFyaWFibGVzXHJcbiAgICAgIGxldCBjaGFyOiBzdHJpbmc7XHJcbiAgICAgIGxldCBrZXlGbjogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgIHN3aXRjaCAodGhpcy5rZXkpIHtcclxuICAgICAgICAvLyBJZ25vcmUgbm9uLXJlcGVhdGluZyBrZXlzXHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkFsdDpcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0R3I6XHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkFsdExrOlxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5DYXBzOlxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5FbnRlcjpcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuU2hpZnQ6XHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5Ca3NwOlxyXG4gICAgICAgICAga2V5Rm4gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlU2VsZWN0ZWRUZXh0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmtzcENsaWNrLmVtaXQoKTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlNwYWNlOlxyXG4gICAgICAgICAgY2hhciA9IFZBTFVFX1NQQUNFO1xyXG4gICAgICAgICAga2V5Rm4gPSAoKSA9PiB0aGlzLnNwYWNlQ2xpY2suZW1pdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5UYWI6XHJcbiAgICAgICAgICBjaGFyID0gVkFMVUVfVEFCO1xyXG4gICAgICAgICAga2V5Rm4gPSAoKSA9PiB0aGlzLnRhYkNsaWNrLmVtaXQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY2hhciA9IGAke3RoaXMua2V5fWA7XHJcbiAgICAgICAgICBrZXlGbiA9ICgpID0+IHRoaXMua2V5Q2xpY2suZW1pdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEV4ZWN1dGUgcmVwZWF0aW5nIGtleXByZXNzXHJcbiAgICAgIHRoaXMuX3JlcGVhdEludGVydmFsSGFuZGxlciA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBjb25zdCBjYXJldCA9IHRoaXMuaW5wdXQgPyB0aGlzLl9nZXRDdXJzb3JQb3NpdGlvbigpIDogMDtcclxuICAgICAgICB0aGlzLl9yZXBlYXRTdGF0ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmIChrZXlGbikgeyBrZXlGbigpOyB9XHJcblxyXG4gICAgICAgIGlmIChjaGFyICYmIHRoaXMuaW5wdXQpIHtcclxuICAgICAgICAgIHRoaXMucmVwbGFjZVNlbGVjdGVkVGV4dChjaGFyKTtcclxuICAgICAgICAgIHRoaXMuX3NldEN1cnNvclBvc2l0aW9uKGNhcmV0ICsgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgUkVQRUFUX0lOVEVSVkFMKTtcclxuICAgIH0sIFJFUEVBVF9USU1FT1VUKTtcclxuICB9XHJcblxyXG4gIGNhbmNlbFJlcGVhdCgpIHtcclxuICAgIGlmICh0aGlzLl9yZXBlYXRUaW1lb3V0SGFuZGxlcikge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fcmVwZWF0VGltZW91dEhhbmRsZXIpO1xyXG4gICAgICB0aGlzLl9yZXBlYXRUaW1lb3V0SGFuZGxlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3JlcGVhdEludGVydmFsSGFuZGxlcikge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuX3JlcGVhdEludGVydmFsSGFuZGxlcik7XHJcbiAgICAgIHRoaXMuX3JlcGVhdEludGVydmFsSGFuZGxlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRlbGV0ZVNlbGVjdGVkVGV4dCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5pbnB1dFZhbHVlID8gdGhpcy5pbnB1dFZhbHVlLnRvU3RyaW5nKCkgOiAnJztcclxuICAgIGxldCBjYXJldCA9IHRoaXMuaW5wdXQgPyB0aGlzLl9nZXRDdXJzb3JQb3NpdGlvbigpIDogMDtcclxuICAgIGxldCBzZWxlY3Rpb25MZW5ndGggPSB0aGlzLl9nZXRTZWxlY3Rpb25MZW5ndGgoKTtcclxuICAgIGlmIChzZWxlY3Rpb25MZW5ndGggPT09IDApIHtcclxuICAgICAgaWYgKGNhcmV0ID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXJldC0tO1xyXG4gICAgICBzZWxlY3Rpb25MZW5ndGggPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhlYWRQYXJ0ID0gdmFsdWUuc2xpY2UoMCwgY2FyZXQpO1xyXG4gICAgY29uc3QgZW5kUGFydCA9IHZhbHVlLnNsaWNlKGNhcmV0ICsgc2VsZWN0aW9uTGVuZ3RoKTtcclxuXHJcbiAgICB0aGlzLmlucHV0VmFsdWUgPSBbaGVhZFBhcnQsIGVuZFBhcnRdLmpvaW4oJycpO1xyXG4gICAgdGhpcy5fc2V0Q3Vyc29yUG9zaXRpb24oY2FyZXQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZXBsYWNlU2VsZWN0ZWRUZXh0KGNoYXI6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmlucHV0VmFsdWUgPyB0aGlzLmlucHV0VmFsdWUudG9TdHJpbmcoKSA6ICcnO1xyXG4gICAgY29uc3QgY2FyZXQgPSB0aGlzLmlucHV0ID8gdGhpcy5fZ2V0Q3Vyc29yUG9zaXRpb24oKSA6IDA7XHJcbiAgICBjb25zdCBzZWxlY3Rpb25MZW5ndGggPSB0aGlzLl9nZXRTZWxlY3Rpb25MZW5ndGgoKTtcclxuICAgIGNvbnN0IGhlYWRQYXJ0ID0gdmFsdWUuc2xpY2UoMCwgY2FyZXQpO1xyXG4gICAgY29uc3QgZW5kUGFydCA9IHZhbHVlLnNsaWNlKGNhcmV0ICsgc2VsZWN0aW9uTGVuZ3RoKTtcclxuXHJcbiAgICB0aGlzLmlucHV0VmFsdWUgPSBbaGVhZFBhcnQsIGNoYXIsIGVuZFBhcnRdLmpvaW4oJycpO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogSW5jbHVkZSBmb3IgcmVwZWF0aW5nIGtleXMgYXMgd2VsbCAoaWYgdGhpcyBnZXRzIGltcGxlbWVudGVkKVxyXG4gIC8vIHByaXZhdGUgX3RyaWdnZXJLZXlFdmVudCgpOiBFdmVudCB7XHJcbiAgLy8gICBjb25zdCBrZXlib2FyZEV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoJ2tleWRvd24nKTtcclxuICAvLyAgIC8vXHJcbiAgLy8gICAvLyBrZXlib2FyZEV2ZW50W2luaXRNZXRob2RdKFxyXG4gIC8vICAgLy8gICB0cnVlLCAvLyBidWJibGVzXHJcbiAgLy8gICAvLyAgIHRydWUsIC8vIGNhbmNlbGFibGVcclxuICAvLyAgIC8vICAgd2luZG93LCAvLyB2aWV3QXJnOiBzaG91bGQgYmUgd2luZG93XHJcbiAgLy8gICAvLyAgIGZhbHNlLCAvLyBjdHJsS2V5QXJnXHJcbiAgLy8gICAvLyAgIGZhbHNlLCAvLyBhbHRLZXlBcmdcclxuICAvLyAgIC8vICAgZmFsc2UsIC8vIHNoaWZ0S2V5QXJnXHJcbiAgLy8gICAvLyAgIGZhbHNlLCAvLyBtZXRhS2V5QXJnXHJcbiAgLy8gICAvLyAgIHRoaXMuY2hhckNvZGUsIC8vIGtleUNvZGVBcmcgOiB1bnNpZ25lZCBsb25nIC0gdGhlIHZpcnR1YWwga2V5IGNvZGUsIGVsc2UgMFxyXG4gIC8vICAgLy8gICAwIC8vIGNoYXJDb2RlQXJncyA6IHVuc2lnbmVkIGxvbmcgLSB0aGUgVW5pY29kZSBjaGFyYWN0ZXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBkZXByZXNzZWQga2V5LCBlbHNlIDBcclxuICAvLyAgIC8vICk7XHJcbiAgLy8gICAvL1xyXG4gIC8vICAgLy8gd2luZG93LmRvY3VtZW50LmRpc3BhdGNoRXZlbnQoa2V5Ym9hcmRFdmVudCk7XHJcblxyXG4gIC8vICAgcmV0dXJuIGtleWJvYXJkRXZlbnQ7XHJcbiAgLy8gfVxyXG5cclxuICAvLyBpbnNwaXJlZCBieTpcclxuICAvLyByZWYgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI4OTc1MTAvMTE0NjIwN1xyXG4gIHByaXZhdGUgX2dldEN1cnNvclBvc2l0aW9uKCk6IG51bWJlciB7XHJcbiAgICBpZiAoIXRoaXMuaW5wdXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgnc2VsZWN0aW9uU3RhcnQnIGluIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICAvLyBTdGFuZGFyZC1jb21wbGlhbnQgYnJvd3NlcnNcclxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydDtcclxuICAgIH0gZWxzZSBpZiAoJ3NlbGVjdGlvbicgaW4gd2luZG93LmRvY3VtZW50KSB7XHJcbiAgICAgIC8vIElFXHJcbiAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICBjb25zdCBzZWxlY3Rpb246IGFueSA9IHdpbmRvdy5kb2N1bWVudFsnc2VsZWN0aW9uJ107XHJcbiAgICAgIGNvbnN0IHNlbCA9IHNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xyXG4gICAgICBjb25zdCBzZWxMZW4gPSBzZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS50ZXh0Lmxlbmd0aDtcclxuICAgICAgc2VsLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgLXRoaXMuY29udHJvbC52YWx1ZS5sZW5ndGgpO1xyXG5cclxuICAgICAgcmV0dXJuIHNlbC50ZXh0Lmxlbmd0aCAtIHNlbExlbjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2dldFNlbGVjdGlvbkxlbmd0aCgpOiBudW1iZXIge1xyXG4gICAgaWYgKCF0aGlzLmlucHV0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJ3NlbGVjdGlvbkVuZCcgaW4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIC8vIFN0YW5kYXJkLWNvbXBsaWFudCBicm93c2Vyc1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvbkVuZCAtIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJ3NlbGVjdGlvbicgaW4gd2luZG93LmRvY3VtZW50KSB7XHJcbiAgICAgIC8vIElFXHJcbiAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICBjb25zdCBzZWxlY3Rpb246IGFueSA9IHdpbmRvdy5kb2N1bWVudFsnc2VsZWN0aW9uJ107XHJcbiAgICAgIHJldHVybiBzZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS50ZXh0Lmxlbmd0aDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGluc3BpcmVkIGJ5OlxyXG4gIC8vIHJlZiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTI1MTg3MzcvMTE0NjIwN1xyXG4gIC8vIHRzbGludDpkaXNhYmxlIG9uZS1saW5lXHJcbiAgcHJpdmF0ZSBfc2V0Q3Vyc29yUG9zaXRpb24ocG9zaXRpb246IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF0aGlzLmlucHV0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmlucHV0VmFsdWUgPSB0aGlzLmNvbnRyb2wudmFsdWU7XHJcbiAgICAvLyBeIHRoaXMgaXMgdXNlZCB0byBub3Qgb25seSBnZXQgXCJmb2N1c1wiLCBidXRcclxuICAgIC8vIHRvIG1ha2Ugc3VyZSB3ZSBkb24ndCBoYXZlIGl0IGV2ZXJ5dGhpbmcgLXNlbGVjdGVkLVxyXG4gICAgLy8gKGl0IGNhdXNlcyBhbiBpc3N1ZSBpbiBjaHJvbWUsIGFuZCBoYXZpbmcgaXQgZG9lc24ndCBodXJ0IGFueSBvdGhlciBicm93c2VyKVxyXG5cclxuICAgIGlmICgnY3JlYXRlVGV4dFJhbmdlJyBpbiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuY3JlYXRlVGV4dFJhbmdlKCk7XHJcbiAgICAgIHJhbmdlLm1vdmUoJ2NoYXJhY3RlcicsIHBvc2l0aW9uKTtcclxuICAgICAgcmFuZ2Uuc2VsZWN0KCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gKGVsLnNlbGVjdGlvblN0YXJ0ID09PSAwIGFkZGVkIGZvciBGaXJlZm94IGJ1ZylcclxuICAgICAgaWYgKHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydCB8fCB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT09IDApIHtcclxuICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UocG9zaXRpb24sIHBvc2l0aW9uKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICAvLyBmYWlsIGNpdHksIGZvcnR1bmF0ZWx5IHRoaXMgbmV2ZXIgaGFwcGVucyAoYXMgZmFyIGFzIEkndmUgdGVzdGVkKSA6KVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2lzVGV4dGFyZWEoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnRhZ05hbWUgPT09ICdURVhUQVJFQSc7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=