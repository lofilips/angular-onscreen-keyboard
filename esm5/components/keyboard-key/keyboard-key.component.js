import { __decorate, __param } from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MAT_KEYBOARD_DEADKEYS } from '../../configs/keyboard-deadkey.config';
import { KeyboardClassKey } from '../../enums/keyboard-class-key.enum';
export var VALUE_NEWLINE = '\n\r';
export var VALUE_SPACE = ' ';
export var VALUE_TAB = '\t';
var REPEAT_TIMEOUT = 500;
var REPEAT_INTERVAL = 100;
var MatKeyboardKeyComponent = /** @class */ (function () {
    // Inject dependencies
    function MatKeyboardKeyComponent(_deadkeys) {
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
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "active", {
        get: function () {
            return this.active$.getValue();
        },
        set: function (active) {
            this.active$.next(active);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "pressed", {
        get: function () {
            return this.pressed$.getValue();
        },
        set: function (pressed) {
            this.pressed$.next(pressed);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "lowerKey", {
        get: function () {
            return ("" + this.key).toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "charCode", {
        get: function () {
            return ("" + this.key).charCodeAt(0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "isClassKey", {
        get: function () {
            return this.key in KeyboardClassKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "isDeadKey", {
        get: function () {
            var _this = this;
            return this._deadkeyKeys.some(function (deadKey) { return deadKey === "" + _this.key; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "hasIcon", {
        get: function () {
            return this.icon !== undefined && this.icon !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "iconName", {
        get: function () {
            return this.icon.name || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "fontSet", {
        get: function () {
            return this.icon.fontSet || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "fontIcon", {
        get: function () {
            return this.icon.fontIcon || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "svgIcon", {
        get: function () {
            return this.icon.svgIcon || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "cssClass", {
        get: function () {
            var classes = [];
            if (this.hasIcon) {
                classes.push('mat-keyboard-key-modifier');
                classes.push("mat-keyboard-key-" + this.lowerKey);
            }
            if (this.isDeadKey) {
                classes.push('mat-keyboard-key-deadkey');
            }
            return classes.join(' ');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardKeyComponent.prototype, "inputValue", {
        get: function () {
            if (this.control) {
                return this.control.value;
            }
            else if (this.input && this.input.nativeElement && this.input.nativeElement.value) {
                return this.input.nativeElement.value;
            }
            else {
                return '';
            }
        },
        set: function (inputValue) {
            if (this.control) {
                this.control.setValue(inputValue);
            }
            else if (this.input && this.input.nativeElement) {
                this.input.nativeElement.value = inputValue;
            }
        },
        enumerable: true,
        configurable: true
    });
    MatKeyboardKeyComponent.prototype.ngOnInit = function () {
        // read the deadkeys
        this._deadkeyKeys = Object.keys(this._deadkeys);
    };
    MatKeyboardKeyComponent.prototype.ngOnDestroy = function () {
        this.cancelRepeat();
    };
    MatKeyboardKeyComponent.prototype.onClick = function (event) {
        var _this = this;
        // Trigger generic click event
        this.genericClick.emit(event);
        // Do not execute keypress if key is currently repeating
        if (this._repeatState) {
            return;
        }
        // Trigger a global key event. TODO: investigate
        // this._triggerKeyEvent();
        // Manipulate the focused input / textarea value
        var caret = this.input ? this._getCursorPosition() : 0;
        var char;
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
                char = "" + this.key;
                this.keyClick.emit(event);
                break;
        }
        if (char && this.input) {
            this.replaceSelectedText(char);
            this._setCursorPosition(caret + 1);
        }
        // Dispatch Input Event for Angular to register a change
        if (this.input && this.input.nativeElement) {
            setTimeout(function () {
                _this.input.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
    };
    // Handle repeating keys. Keypress logic derived from onClick()
    MatKeyboardKeyComponent.prototype.onPointerDown = function () {
        var _this = this;
        this.cancelRepeat();
        this._repeatState = false;
        this._repeatTimeoutHandler = setTimeout(function () {
            // Initialize keypress variables
            var char;
            var keyFn;
            switch (_this.key) {
                // Ignore non-repeating keys
                case KeyboardClassKey.Alt:
                case KeyboardClassKey.AltGr:
                case KeyboardClassKey.AltLk:
                case KeyboardClassKey.Caps:
                case KeyboardClassKey.Enter:
                case KeyboardClassKey.Shift:
                    return;
                case KeyboardClassKey.Bksp:
                    keyFn = function () {
                        _this.deleteSelectedText();
                        _this.bkspClick.emit();
                    };
                    break;
                case KeyboardClassKey.Space:
                    char = VALUE_SPACE;
                    keyFn = function () { return _this.spaceClick.emit(); };
                    break;
                case KeyboardClassKey.Tab:
                    char = VALUE_TAB;
                    keyFn = function () { return _this.tabClick.emit(); };
                    break;
                default:
                    char = "" + _this.key;
                    keyFn = function () { return _this.keyClick.emit(); };
                    break;
            }
            // Execute repeating keypress
            _this._repeatIntervalHandler = setInterval(function () {
                var caret = _this.input ? _this._getCursorPosition() : 0;
                _this._repeatState = true;
                if (keyFn) {
                    keyFn();
                }
                if (char && _this.input) {
                    _this.replaceSelectedText(char);
                    _this._setCursorPosition(caret + 1);
                }
                if (_this.input && _this.input.nativeElement) {
                    setTimeout(function () { return _this.input.nativeElement.dispatchEvent(new Event('input', { bubbles: true })); });
                }
            }, REPEAT_INTERVAL);
        }, REPEAT_TIMEOUT);
    };
    MatKeyboardKeyComponent.prototype.cancelRepeat = function () {
        if (this._repeatTimeoutHandler) {
            clearTimeout(this._repeatTimeoutHandler);
            this._repeatTimeoutHandler = null;
        }
        if (this._repeatIntervalHandler) {
            clearInterval(this._repeatIntervalHandler);
            this._repeatIntervalHandler = null;
        }
    };
    MatKeyboardKeyComponent.prototype.deleteSelectedText = function () {
        var value = this.inputValue ? this.inputValue.toString() : '';
        var caret = this.input ? this._getCursorPosition() : 0;
        var selectionLength = this._getSelectionLength();
        if (selectionLength === 0) {
            if (caret === 0) {
                return;
            }
            caret--;
            selectionLength = 1;
        }
        var headPart = value.slice(0, caret);
        var endPart = value.slice(caret + selectionLength);
        this.inputValue = [headPart, endPart].join('');
        this._setCursorPosition(caret);
    };
    MatKeyboardKeyComponent.prototype.replaceSelectedText = function (char) {
        var value = this.inputValue ? this.inputValue.toString() : '';
        var caret = this.input ? this._getCursorPosition() : 0;
        var selectionLength = this._getSelectionLength();
        var headPart = value.slice(0, caret);
        var endPart = value.slice(caret + selectionLength);
        this.inputValue = [headPart, char, endPart].join('');
    };
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
    MatKeyboardKeyComponent.prototype._getCursorPosition = function () {
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
            var selection = window.document['selection'];
            var sel = selection.createRange();
            var selLen = selection.createRange().text.length;
            sel.moveStart('character', -this.control.value.length);
            return sel.text.length - selLen;
        }
    };
    MatKeyboardKeyComponent.prototype._getSelectionLength = function () {
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
            var selection = window.document['selection'];
            return selection.createRange().text.length;
        }
    };
    // inspired by:
    // ref https://stackoverflow.com/a/12518737/1146207
    // tslint:disable one-line
    MatKeyboardKeyComponent.prototype._setCursorPosition = function (position) {
        if (!this.input) {
            return;
        }
        this.inputValue = this.control.value;
        // ^ this is used to not only get "focus", but
        // to make sure we don't have it everything -selected-
        // (it causes an issue in chrome, and having it doesn't hurt any other browser)
        if ('createTextRange' in this.input.nativeElement) {
            var range = this.input.nativeElement.createTextRange();
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
    };
    MatKeyboardKeyComponent.prototype._isTextarea = function () {
        return this.input && this.input.nativeElement && this.input.nativeElement.tagName === 'TEXTAREA';
    };
    MatKeyboardKeyComponent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [MAT_KEYBOARD_DEADKEYS,] }] }
    ]; };
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
    return MatKeyboardKeyComponent;
}());
export { MatKeyboardKeyComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQta2V5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItb25zY3JlZW4tbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2tleWJvYXJkLWtleS9rZXlib2FyZC1rZXkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkksT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUl2RSxNQUFNLENBQUMsSUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxJQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDL0IsTUFBTSxDQUFDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQztBQUM5QixJQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDM0IsSUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDO0FBUzVCO0lBeUlFLHNCQUFzQjtJQUN0QixpQ0FBbUQsU0FBNEI7UUFBNUIsY0FBUyxHQUFULFNBQVMsQ0FBbUI7UUF4SXZFLGlCQUFZLEdBQWEsRUFBRSxDQUFDO1FBRzVCLGlCQUFZLEdBQVksS0FBSyxDQUFDLENBQUMsc0NBQXNDO1FBRTdFLFlBQU8sR0FBNkIsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0QsYUFBUSxHQUE2QixJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQWlDaEUsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRzlDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFD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O0lBT0Q7UUFEQyxLQUFLLEVBQUU7MERBR1A7SUFPRDtRQURDLEtBQUssRUFBRTswREFDVztJQUduQjtRQURDLEtBQUssRUFBRTs0REFDYztJQUd0QjtRQURDLE1BQU0sRUFBRTtpRUFDcUM7SUFHOUM7UUFEQyxNQUFNLEVBQUU7K0RBQ21DO0lBRzVDO1FBREMsTUFBTSxFQUFFOzhEQUNrQztJQUczQztRQURDLE1BQU0sRUFBRTs4REFDa0M7SUFHM0M7UUFEQyxNQUFNLEVBQUU7NkRBQ2lDO0lBRzFDO1FBREMsTUFBTSxFQUFFOytEQUNtQztJQUc1QztRQURDLE1BQU0sRUFBRTsrREFDbUM7SUFHNUM7UUFEQyxNQUFNLEVBQUU7NkRBQ2lDO0lBRzFDO1FBREMsTUFBTSxFQUFFOzZEQUNpQztJQWxFL0IsdUJBQXVCO1FBUG5DLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsdW9CQUE0QztZQUU1QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtZQUMvQyxtQkFBbUIsRUFBRSxLQUFLOztTQUMzQixDQUFDO1FBMklhLFdBQUEsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUE7T0ExSS9CLHVCQUF1QixDQTRhbkM7SUFBRCw4QkFBQztDQUFBLEFBNWFELElBNGFDO1NBNWFZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IE1BVF9LRVlCT0FSRF9ERUFES0VZUyB9IGZyb20gJy4uLy4uL2NvbmZpZ3Mva2V5Ym9hcmQtZGVhZGtleS5jb25maWcnO1xyXG5pbXBvcnQgeyBLZXlib2FyZENsYXNzS2V5IH0gZnJvbSAnLi4vLi4vZW51bXMva2V5Ym9hcmQtY2xhc3Mta2V5LmVudW0nO1xyXG5pbXBvcnQgeyBJS2V5Ym9hcmREZWFka2V5cyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMva2V5Ym9hcmQtZGVhZGtleXMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgSU1hdEljb24gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2tleWJvYXJkLWljb25zLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY29uc3QgVkFMVUVfTkVXTElORSA9ICdcXG5cXHInO1xyXG5leHBvcnQgY29uc3QgVkFMVUVfU1BBQ0UgPSAnICc7XHJcbmV4cG9ydCBjb25zdCBWQUxVRV9UQUIgPSAnXFx0JztcclxuY29uc3QgUkVQRUFUX1RJTUVPVVQgPSA1MDA7XHJcbmNvbnN0IFJFUEVBVF9JTlRFUlZBTCA9IDEwMDtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWF0LWtleWJvYXJkLWtleScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2tleWJvYXJkLWtleS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4va2V5Ym9hcmQta2V5LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2VcclxufSlcclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkS2V5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG5cclxuICBwcml2YXRlIF9kZWFka2V5S2V5czogc3RyaW5nW10gPSBbXTtcclxuICBwcml2YXRlIF9yZXBlYXRUaW1lb3V0SGFuZGxlcjogYW55O1xyXG4gIHByaXZhdGUgX3JlcGVhdEludGVydmFsSGFuZGxlcjogYW55O1xyXG4gIHByaXZhdGUgX3JlcGVhdFN0YXRlOiBib29sZWFuID0gZmFsc2U7IC8vIHRydWUgaWYgcmVwZWF0aW5nLCBmYWxzZSBpZiB3YWl0aW5nXHJcblxyXG4gIGFjdGl2ZSQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xyXG5cclxuICBwcmVzc2VkJDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAga2V5OiBzdHJpbmcgfCBLZXlib2FyZENsYXNzS2V5O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGljb246IElNYXRJY29uO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHNldCBhY3RpdmUoYWN0aXZlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSQubmV4dChhY3RpdmUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZSQuZ2V0VmFsdWUoKTtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgc2V0IHByZXNzZWQocHJlc3NlZDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5wcmVzc2VkJC5uZXh0KHByZXNzZWQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHByZXNzZWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcmVzc2VkJC5nZXRWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBpbnB1dD86IEVsZW1lbnRSZWY7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY29udHJvbD86IEZvcm1Db250cm9sO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBnZW5lcmljQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGVudGVyQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGJrc3BDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgY2Fwc0NsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBhbHRDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgc2hpZnRDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgc3BhY2VDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgdGFiQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGtleUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBnZXQgbG93ZXJLZXkoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmtleX1gLnRvTG93ZXJDYXNlKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgY2hhckNvZGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmtleX1gLmNoYXJDb2RlQXQoMCk7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNDbGFzc0tleSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmtleSBpbiBLZXlib2FyZENsYXNzS2V5O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzRGVhZEtleSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9kZWFka2V5S2V5cy5zb21lKChkZWFkS2V5OiBzdHJpbmcpID0+IGRlYWRLZXkgPT09IGAke3RoaXMua2V5fWApO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGhhc0ljb24oKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pY29uICE9PSBudWxsO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGljb25OYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uLm5hbWUgfHwgJyc7XHJcbiAgfVxyXG5cclxuICBnZXQgZm9udFNldCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbi5mb250U2V0IHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGZvbnRJY29uKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uLmZvbnRJY29uIHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHN2Z0ljb24oKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmljb24uc3ZnSWNvbiB8fCAnJztcclxuICB9XHJcblxyXG4gIGdldCBjc3NDbGFzcygpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtdO1xyXG5cclxuICAgIGlmICh0aGlzLmhhc0ljb24pIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKCdtYXQta2V5Ym9hcmQta2V5LW1vZGlmaWVyJyk7XHJcbiAgICAgIGNsYXNzZXMucHVzaChgbWF0LWtleWJvYXJkLWtleS0ke3RoaXMubG93ZXJLZXl9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEZWFkS2V5KSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaCgnbWF0LWtleWJvYXJkLWtleS1kZWFka2V5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlucHV0VmFsdWUoKTogc3RyaW5nIHtcclxuICAgIGlmICh0aGlzLmNvbnRyb2wpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbC52YWx1ZTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXQgaW5wdXRWYWx1ZShpbnB1dFZhbHVlOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLmNvbnRyb2wpIHtcclxuICAgICAgdGhpcy5jb250cm9sLnNldFZhbHVlKGlucHV0VmFsdWUpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlucHV0ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBpbnB1dFZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSW5qZWN0IGRlcGVuZGVuY2llc1xyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTUFUX0tFWUJPQVJEX0RFQURLRVlTKSBwcml2YXRlIF9kZWFka2V5czogSUtleWJvYXJkRGVhZGtleXMpIHsgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIHJlYWQgdGhlIGRlYWRrZXlzXHJcbiAgICB0aGlzLl9kZWFka2V5S2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuX2RlYWRrZXlzKTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5jYW5jZWxSZXBlYXQoKTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIC8vIFRyaWdnZXIgZ2VuZXJpYyBjbGljayBldmVudFxyXG4gICAgdGhpcy5nZW5lcmljQ2xpY2suZW1pdChldmVudCk7XHJcblxyXG4gICAgLy8gRG8gbm90IGV4ZWN1dGUga2V5cHJlc3MgaWYga2V5IGlzIGN1cnJlbnRseSByZXBlYXRpbmdcclxuICAgIGlmICh0aGlzLl9yZXBlYXRTdGF0ZSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAvLyBUcmlnZ2VyIGEgZ2xvYmFsIGtleSBldmVudC4gVE9ETzogaW52ZXN0aWdhdGVcclxuICAgIC8vIHRoaXMuX3RyaWdnZXJLZXlFdmVudCgpO1xyXG5cclxuICAgIC8vIE1hbmlwdWxhdGUgdGhlIGZvY3VzZWQgaW5wdXQgLyB0ZXh0YXJlYSB2YWx1ZVxyXG4gICAgY29uc3QgY2FyZXQgPSB0aGlzLmlucHV0ID8gdGhpcy5fZ2V0Q3Vyc29yUG9zaXRpb24oKSA6IDA7XHJcblxyXG4gICAgbGV0IGNoYXI6IHN0cmluZztcclxuICAgIFxyXG4gICAgc3dpdGNoICh0aGlzLmtleSkge1xyXG4gICAgICAvLyB0aGlzIGtleXMgaGF2ZSBubyBhY3Rpb25zIHlldFxyXG4gICAgICAvLyBUT0RPOiBhZGQgZGVhZGtleXMgYW5kIG1vZGlmaWVyc1xyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0OlxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0R3I6XHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHRMazpcclxuICAgICAgICB0aGlzLmFsdENsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkJrc3A6XHJcbiAgICAgICAgdGhpcy5kZWxldGVTZWxlY3RlZFRleHQoKTtcclxuICAgICAgICB0aGlzLmJrc3BDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5DYXBzOlxyXG4gICAgICAgIHRoaXMuY2Fwc0NsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkVudGVyOlxyXG4gICAgICAgIGlmICh0aGlzLl9pc1RleHRhcmVhKCkpIHtcclxuICAgICAgICAgIGNoYXIgPSBWQUxVRV9ORVdMSU5FO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmVudGVyQ2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgICAvLyBUT0RPOiB0cmlnZ2VyIHN1Ym1pdCAvIG9uU3VibWl0IC8gbmdTdWJtaXQgcHJvcGVybHkgKGZvciB0aGUgdGltZSBiZWluZyB0aGlzIGhhcyB0byBiZSBoYW5kbGVkIGJ5IHRoZSB1c2VyIGhpbXNlbGYpXHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbnRyb2wubmdDb250cm9sLmNvbnRyb2wucm9vdClcclxuICAgICAgICAgIC8vIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb3JtLnN1Ym1pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5TaGlmdDpcclxuICAgICAgICB0aGlzLnNoaWZ0Q2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuU3BhY2U6XHJcbiAgICAgICAgY2hhciA9IFZBTFVFX1NQQUNFO1xyXG4gICAgICAgIHRoaXMuc3BhY2VDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5UYWI6XHJcbiAgICAgICAgY2hhciA9IFZBTFVFX1RBQjtcclxuICAgICAgICB0aGlzLnRhYkNsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICAvLyB0aGUga2V5IGlzIG5vdCBtYXBwZWQgb3IgYSBzdHJpbmdcclxuICAgICAgICBjaGFyID0gYCR7dGhpcy5rZXl9YDtcclxuICAgICAgICB0aGlzLmtleUNsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFyICYmIHRoaXMuaW5wdXQpIHtcclxuICAgICAgdGhpcy5yZXBsYWNlU2VsZWN0ZWRUZXh0KGNoYXIpO1xyXG4gICAgICB0aGlzLl9zZXRDdXJzb3JQb3NpdGlvbihjYXJldCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERpc3BhdGNoIElucHV0IEV2ZW50IGZvciBBbmd1bGFyIHRvIHJlZ2lzdGVyIGEgY2hhbmdlXHJcbiAgICBpZiAodGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSGFuZGxlIHJlcGVhdGluZyBrZXlzLiBLZXlwcmVzcyBsb2dpYyBkZXJpdmVkIGZyb20gb25DbGljaygpXHJcbiAgb25Qb2ludGVyRG93bigpIHtcclxuICAgIHRoaXMuY2FuY2VsUmVwZWF0KCk7XHJcbiAgICB0aGlzLl9yZXBlYXRTdGF0ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5fcmVwZWF0VGltZW91dEhhbmRsZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgLy8gSW5pdGlhbGl6ZSBrZXlwcmVzcyB2YXJpYWJsZXNcclxuICAgICAgbGV0IGNoYXI6IHN0cmluZztcclxuICAgICAgbGV0IGtleUZuOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLmtleSkge1xyXG4gICAgICAgIC8vIElnbm9yZSBub24tcmVwZWF0aW5nIGtleXNcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0OlxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHRHcjpcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0TGs6XHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkNhcHM6XHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkVudGVyOlxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5TaGlmdDpcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkJrc3A6XHJcbiAgICAgICAgICBrZXlGbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVTZWxlY3RlZFRleHQoKTtcclxuICAgICAgICAgICAgdGhpcy5ia3NwQ2xpY2suZW1pdCgpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuU3BhY2U6XHJcbiAgICAgICAgICBjaGFyID0gVkFMVUVfU1BBQ0U7XHJcbiAgICAgICAgICBrZXlGbiA9ICgpID0+IHRoaXMuc3BhY2VDbGljay5lbWl0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlRhYjpcclxuICAgICAgICAgIGNoYXIgPSBWQUxVRV9UQUI7XHJcbiAgICAgICAgICBrZXlGbiA9ICgpID0+IHRoaXMudGFiQ2xpY2suZW1pdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBjaGFyID0gYCR7dGhpcy5rZXl9YDtcclxuICAgICAgICAgIGtleUZuID0gKCkgPT4gdGhpcy5rZXlDbGljay5lbWl0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRXhlY3V0ZSByZXBlYXRpbmcga2V5cHJlc3NcclxuICAgICAgdGhpcy5fcmVwZWF0SW50ZXJ2YWxIYW5kbGVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhcmV0ID0gdGhpcy5pbnB1dCA/IHRoaXMuX2dldEN1cnNvclBvc2l0aW9uKCkgOiAwO1xyXG4gICAgICAgIHRoaXMuX3JlcGVhdFN0YXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKGtleUZuKSB7IGtleUZuKCk7IH1cclxuXHJcbiAgICAgICAgaWYgKGNoYXIgJiYgdGhpcy5pbnB1dCkge1xyXG4gICAgICAgICAgdGhpcy5yZXBsYWNlU2VsZWN0ZWRUZXh0KGNoYXIpO1xyXG4gICAgICAgICAgdGhpcy5fc2V0Q3Vyc29yUG9zaXRpb24oY2FyZXQgKyAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlucHV0ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBSRVBFQVRfSU5URVJWQUwpO1xyXG4gICAgfSwgUkVQRUFUX1RJTUVPVVQpO1xyXG4gIH1cclxuXHJcbiAgY2FuY2VsUmVwZWF0KCkge1xyXG4gICAgaWYgKHRoaXMuX3JlcGVhdFRpbWVvdXRIYW5kbGVyKSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZXBlYXRUaW1lb3V0SGFuZGxlcik7XHJcbiAgICAgIHRoaXMuX3JlcGVhdFRpbWVvdXRIYW5kbGVyID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fcmVwZWF0SW50ZXJ2YWxIYW5kbGVyKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fcmVwZWF0SW50ZXJ2YWxIYW5kbGVyKTtcclxuICAgICAgdGhpcy5fcmVwZWF0SW50ZXJ2YWxIYW5kbGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZGVsZXRlU2VsZWN0ZWRUZXh0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmlucHV0VmFsdWUgPyB0aGlzLmlucHV0VmFsdWUudG9TdHJpbmcoKSA6ICcnO1xyXG4gICAgbGV0IGNhcmV0ID0gdGhpcy5pbnB1dCA/IHRoaXMuX2dldEN1cnNvclBvc2l0aW9uKCkgOiAwO1xyXG4gICAgbGV0IHNlbGVjdGlvbkxlbmd0aCA9IHRoaXMuX2dldFNlbGVjdGlvbkxlbmd0aCgpO1xyXG4gICAgaWYgKHNlbGVjdGlvbkxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBpZiAoY2FyZXQgPT09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhcmV0LS07XHJcbiAgICAgIHNlbGVjdGlvbkxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaGVhZFBhcnQgPSB2YWx1ZS5zbGljZSgwLCBjYXJldCk7XHJcbiAgICBjb25zdCBlbmRQYXJ0ID0gdmFsdWUuc2xpY2UoY2FyZXQgKyBzZWxlY3Rpb25MZW5ndGgpO1xyXG5cclxuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IFtoZWFkUGFydCwgZW5kUGFydF0uam9pbignJyk7XHJcbiAgICB0aGlzLl9zZXRDdXJzb3JQb3NpdGlvbihjYXJldCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlcGxhY2VTZWxlY3RlZFRleHQoY2hhcjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaW5wdXRWYWx1ZSA/IHRoaXMuaW5wdXRWYWx1ZS50b1N0cmluZygpIDogJyc7XHJcbiAgICBjb25zdCBjYXJldCA9IHRoaXMuaW5wdXQgPyB0aGlzLl9nZXRDdXJzb3JQb3NpdGlvbigpIDogMDtcclxuICAgIGNvbnN0IHNlbGVjdGlvbkxlbmd0aCA9IHRoaXMuX2dldFNlbGVjdGlvbkxlbmd0aCgpO1xyXG4gICAgY29uc3QgaGVhZFBhcnQgPSB2YWx1ZS5zbGljZSgwLCBjYXJldCk7XHJcbiAgICBjb25zdCBlbmRQYXJ0ID0gdmFsdWUuc2xpY2UoY2FyZXQgKyBzZWxlY3Rpb25MZW5ndGgpO1xyXG5cclxuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IFtoZWFkUGFydCwgY2hhciwgZW5kUGFydF0uam9pbignJyk7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPOiBJbmNsdWRlIGZvciByZXBlYXRpbmcga2V5cyBhcyB3ZWxsIChpZiB0aGlzIGdldHMgaW1wbGVtZW50ZWQpXHJcbiAgLy8gcHJpdmF0ZSBfdHJpZ2dlcktleUV2ZW50KCk6IEV2ZW50IHtcclxuICAvLyAgIGNvbnN0IGtleWJvYXJkRXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicpO1xyXG4gIC8vICAgLy9cclxuICAvLyAgIC8vIGtleWJvYXJkRXZlbnRbaW5pdE1ldGhvZF0oXHJcbiAgLy8gICAvLyAgIHRydWUsIC8vIGJ1YmJsZXNcclxuICAvLyAgIC8vICAgdHJ1ZSwgLy8gY2FuY2VsYWJsZVxyXG4gIC8vICAgLy8gICB3aW5kb3csIC8vIHZpZXdBcmc6IHNob3VsZCBiZSB3aW5kb3dcclxuICAvLyAgIC8vICAgZmFsc2UsIC8vIGN0cmxLZXlBcmdcclxuICAvLyAgIC8vICAgZmFsc2UsIC8vIGFsdEtleUFyZ1xyXG4gIC8vICAgLy8gICBmYWxzZSwgLy8gc2hpZnRLZXlBcmdcclxuICAvLyAgIC8vICAgZmFsc2UsIC8vIG1ldGFLZXlBcmdcclxuICAvLyAgIC8vICAgdGhpcy5jaGFyQ29kZSwgLy8ga2V5Q29kZUFyZyA6IHVuc2lnbmVkIGxvbmcgLSB0aGUgdmlydHVhbCBrZXkgY29kZSwgZWxzZSAwXHJcbiAgLy8gICAvLyAgIDAgLy8gY2hhckNvZGVBcmdzIDogdW5zaWduZWQgbG9uZyAtIHRoZSBVbmljb2RlIGNoYXJhY3RlciBhc3NvY2lhdGVkIHdpdGggdGhlIGRlcHJlc3NlZCBrZXksIGVsc2UgMFxyXG4gIC8vICAgLy8gKTtcclxuICAvLyAgIC8vXHJcbiAgLy8gICAvLyB3aW5kb3cuZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChrZXlib2FyZEV2ZW50KTtcclxuXHJcbiAgLy8gICByZXR1cm4ga2V5Ym9hcmRFdmVudDtcclxuICAvLyB9XHJcblxyXG4gIC8vIGluc3BpcmVkIGJ5OlxyXG4gIC8vIHJlZiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjg5NzUxMC8xMTQ2MjA3XHJcbiAgcHJpdmF0ZSBfZ2V0Q3Vyc29yUG9zaXRpb24oKTogbnVtYmVyIHtcclxuICAgIGlmICghdGhpcy5pbnB1dCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCdzZWxlY3Rpb25TdGFydCcgaW4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIC8vIFN0YW5kYXJkLWNvbXBsaWFudCBicm93c2Vyc1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xyXG4gICAgfSBlbHNlIGlmICgnc2VsZWN0aW9uJyBpbiB3aW5kb3cuZG9jdW1lbnQpIHtcclxuICAgICAgLy8gSUVcclxuICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbjogYW55ID0gd2luZG93LmRvY3VtZW50WydzZWxlY3Rpb24nXTtcclxuICAgICAgY29uc3Qgc2VsID0gc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XHJcbiAgICAgIGNvbnN0IHNlbExlbiA9IHNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnRleHQubGVuZ3RoO1xyXG4gICAgICBzZWwubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtdGhpcy5jb250cm9sLnZhbHVlLmxlbmd0aCk7XHJcblxyXG4gICAgICByZXR1cm4gc2VsLnRleHQubGVuZ3RoIC0gc2VsTGVuO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZ2V0U2VsZWN0aW9uTGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICBpZiAoIXRoaXMuaW5wdXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgnc2VsZWN0aW9uRW5kJyBpbiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgLy8gU3RhbmRhcmQtY29tcGxpYW50IGJyb3dzZXJzXHJcbiAgICAgIHJldHVybiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uRW5kIC0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgnc2VsZWN0aW9uJyBpbiB3aW5kb3cuZG9jdW1lbnQpIHtcclxuICAgICAgLy8gSUVcclxuICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbjogYW55ID0gd2luZG93LmRvY3VtZW50WydzZWxlY3Rpb24nXTtcclxuICAgICAgcmV0dXJuIHNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnRleHQubGVuZ3RoO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaW5zcGlyZWQgYnk6XHJcbiAgLy8gcmVmIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMjUxODczNy8xMTQ2MjA3XHJcbiAgLy8gdHNsaW50OmRpc2FibGUgb25lLWxpbmVcclxuICBwcml2YXRlIF9zZXRDdXJzb3JQb3NpdGlvbihwb3NpdGlvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMuaW5wdXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHRoaXMuY29udHJvbC52YWx1ZTtcclxuICAgIC8vIF4gdGhpcyBpcyB1c2VkIHRvIG5vdCBvbmx5IGdldCBcImZvY3VzXCIsIGJ1dFxyXG4gICAgLy8gdG8gbWFrZSBzdXJlIHdlIGRvbid0IGhhdmUgaXQgZXZlcnl0aGluZyAtc2VsZWN0ZWQtXHJcbiAgICAvLyAoaXQgY2F1c2VzIGFuIGlzc3VlIGluIGNocm9tZSwgYW5kIGhhdmluZyBpdCBkb2Vzbid0IGh1cnQgYW55IG90aGVyIGJyb3dzZXIpXHJcblxyXG4gICAgaWYgKCdjcmVhdGVUZXh0UmFuZ2UnIGluIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5jcmVhdGVUZXh0UmFuZ2UoKTtcclxuICAgICAgcmFuZ2UubW92ZSgnY2hhcmFjdGVyJywgcG9zaXRpb24pO1xyXG4gICAgICByYW5nZS5zZWxlY3QoKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyAoZWwuc2VsZWN0aW9uU3RhcnQgPT09IDAgYWRkZWQgZm9yIEZpcmVmb3ggYnVnKVxyXG4gICAgICBpZiAodGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0IHx8IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydCA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShwb3NpdGlvbiwgcG9zaXRpb24pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGZhaWwgY2l0eSwgZm9ydHVuYXRlbHkgdGhpcyBuZXZlciBoYXBwZW5zIChhcyBmYXIgYXMgSSd2ZSB0ZXN0ZWQpIDopXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfaXNUZXh0YXJlYSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmlucHV0ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJztcclxuICB9XHJcblxyXG59XHJcbiJdfQ==