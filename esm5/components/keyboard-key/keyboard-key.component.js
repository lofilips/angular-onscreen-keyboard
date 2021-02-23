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
        event.preventDefault();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQta2V5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItb25zY3JlZW4tbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2tleWJvYXJkLWtleS9rZXlib2FyZC1rZXkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkksT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUl2RSxNQUFNLENBQUMsSUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxJQUFNLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDL0IsTUFBTSxDQUFDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQztBQUM5QixJQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7QUFDM0IsSUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDO0FBUzVCO0lBeUlFLHNCQUFzQjtJQUN0QixpQ0FBbUQsU0FBNEI7UUFBNUIsY0FBUyxHQUFULFNBQVMsQ0FBbUI7UUF4SXZFLGlCQUFZLEdBQWEsRUFBRSxDQUFDO1FBRzVCLGlCQUFZLEdBQVksS0FBSyxDQUFDLENBQUMsc0NBQXNDO1FBRTdFLFlBQU8sR0FBNkIsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0QsYUFBUSxHQUE2QixJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQWlDaEUsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRzlDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFD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eURBQ087SUFHZjtRQURDLEtBQUssRUFBRTt5REFHUDtJQU9EO1FBREMsS0FBSyxFQUFFOzBEQUdQO0lBT0Q7UUFEQyxLQUFLLEVBQUU7MERBQ1c7SUFHbkI7UUFEQyxLQUFLLEVBQUU7NERBQ2M7SUFHdEI7UUFEQyxNQUFNLEVBQUU7aUVBQ3FDO0lBRzlDO1FBREMsTUFBTSxFQUFFOytEQUNtQztJQUc1QztRQURDLE1BQU0sRUFBRTs4REFDa0M7SUFHM0M7UUFEQyxNQUFNLEVBQUU7OERBQ2tDO0lBRzNDO1FBREMsTUFBTSxFQUFFOzZEQUNpQztJQUcxQztRQURDLE1BQU0sRUFBRTsrREFDbUM7SUFHNUM7UUFEQyxNQUFNLEVBQUU7K0RBQ21DO0lBRzVDO1FBREMsTUFBTSxFQUFFOzZEQUNpQztJQUcxQztRQURDLE1BQU0sRUFBRTs2REFDaUM7SUFsRS9CLHVCQUF1QjtRQVBuQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLHVvQkFBNEM7WUFFNUMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFDL0MsbUJBQW1CLEVBQUUsS0FBSzs7U0FDM0IsQ0FBQztRQTJJYSxXQUFBLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO09BMUkvQix1QkFBdUIsQ0E2YW5DO0lBQUQsOEJBQUM7Q0FBQSxBQTdhRCxJQTZhQztTQTdhWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNQVRfS0VZQk9BUkRfREVBREtFWVMgfSBmcm9tICcuLi8uLi9jb25maWdzL2tleWJvYXJkLWRlYWRrZXkuY29uZmlnJztcclxuaW1wb3J0IHsgS2V5Ym9hcmRDbGFzc0tleSB9IGZyb20gJy4uLy4uL2VudW1zL2tleWJvYXJkLWNsYXNzLWtleS5lbnVtJztcclxuaW1wb3J0IHsgSUtleWJvYXJkRGVhZGtleXMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2tleWJvYXJkLWRlYWRrZXlzLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElNYXRJY29uIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9rZXlib2FyZC1pY29ucy5pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFZBTFVFX05FV0xJTkUgPSAnXFxuXFxyJztcclxuZXhwb3J0IGNvbnN0IFZBTFVFX1NQQUNFID0gJyAnO1xyXG5leHBvcnQgY29uc3QgVkFMVUVfVEFCID0gJ1xcdCc7XHJcbmNvbnN0IFJFUEVBVF9USU1FT1VUID0gNTAwO1xyXG5jb25zdCBSRVBFQVRfSU5URVJWQUwgPSAxMDA7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ21hdC1rZXlib2FyZC1rZXknLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9rZXlib2FyZC1rZXkuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2tleWJvYXJkLWtleS5jb21wb25lbnQuc2NzcyddLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXRLZXlib2FyZEtleUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuXHJcbiAgcHJpdmF0ZSBfZGVhZGtleUtleXM6IHN0cmluZ1tdID0gW107XHJcbiAgcHJpdmF0ZSBfcmVwZWF0VGltZW91dEhhbmRsZXI6IGFueTtcclxuICBwcml2YXRlIF9yZXBlYXRJbnRlcnZhbEhhbmRsZXI6IGFueTtcclxuICBwcml2YXRlIF9yZXBlYXRTdGF0ZTogYm9vbGVhbiA9IGZhbHNlOyAvLyB0cnVlIGlmIHJlcGVhdGluZywgZmFsc2UgaWYgd2FpdGluZ1xyXG5cclxuICBhY3RpdmUkOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcclxuXHJcbiAgcHJlc3NlZCQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGtleTogc3RyaW5nIHwgS2V5Ym9hcmRDbGFzc0tleTtcclxuXHJcbiAgQElucHV0KClcclxuICBpY29uOiBJTWF0SWNvbjtcclxuXHJcbiAgQElucHV0KClcclxuICBzZXQgYWN0aXZlKGFjdGl2ZTogYm9vbGVhbikge1xyXG4gICAgdGhpcy5hY3RpdmUkLm5leHQoYWN0aXZlKTtcclxuICB9XHJcblxyXG4gIGdldCBhY3RpdmUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5hY3RpdmUkLmdldFZhbHVlKCk7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKVxyXG4gIHNldCBwcmVzc2VkKHByZXNzZWQ6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMucHJlc3NlZCQubmV4dChwcmVzc2VkKTtcclxuICB9XHJcblxyXG4gIGdldCBwcmVzc2VkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJlc3NlZCQuZ2V0VmFsdWUoKTtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgaW5wdXQ/OiBFbGVtZW50UmVmO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNvbnRyb2w/OiBGb3JtQ29udHJvbDtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgZ2VuZXJpY0NsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBlbnRlckNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBia3NwQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGNhcHNDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgYWx0Q2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHNoaWZ0Q2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHNwYWNlQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHRhYkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBrZXlDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgZ2V0IGxvd2VyS2V5KCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5rZXl9YC50b0xvd2VyQ2FzZSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNoYXJDb2RlKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5rZXl9YC5jaGFyQ29kZUF0KDApO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzQ2xhc3NLZXkoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5rZXkgaW4gS2V5Ym9hcmRDbGFzc0tleTtcclxuICB9XHJcblxyXG4gIGdldCBpc0RlYWRLZXkoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGVhZGtleUtleXMuc29tZSgoZGVhZEtleTogc3RyaW5nKSA9PiBkZWFkS2V5ID09PSBgJHt0aGlzLmtleX1gKTtcclxuICB9XHJcblxyXG4gIGdldCBoYXNJY29uKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaWNvbiAhPT0gbnVsbDtcclxuICB9XHJcblxyXG4gIGdldCBpY29uTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbi5uYW1lIHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGZvbnRTZXQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmljb24uZm9udFNldCB8fCAnJztcclxuICB9XHJcblxyXG4gIGdldCBmb250SWNvbigpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbi5mb250SWNvbiB8fCAnJztcclxuICB9XHJcblxyXG4gIGdldCBzdmdJY29uKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uLnN2Z0ljb24gfHwgJyc7XHJcbiAgfVxyXG5cclxuICBnZXQgY3NzQ2xhc3MoKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbXTtcclxuXHJcbiAgICBpZiAodGhpcy5oYXNJY29uKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaCgnbWF0LWtleWJvYXJkLWtleS1tb2RpZmllcicpO1xyXG4gICAgICBjbGFzc2VzLnB1c2goYG1hdC1rZXlib2FyZC1rZXktJHt0aGlzLmxvd2VyS2V5fWApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRGVhZEtleSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goJ21hdC1rZXlib2FyZC1rZXktZGVhZGtleScpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcclxuICB9XHJcblxyXG4gIGdldCBpbnB1dFZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICBpZiAodGhpcy5jb250cm9sKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wudmFsdWU7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0IGlucHV0VmFsdWUoaW5wdXRWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICBpZiAodGhpcy5jb250cm9sKSB7XHJcbiAgICAgIHRoaXMuY29udHJvbC5zZXRWYWx1ZShpbnB1dFZhbHVlKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gaW5wdXRWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEluamVjdCBkZXBlbmRlbmNpZXNcclxuICBjb25zdHJ1Y3RvcihASW5qZWN0KE1BVF9LRVlCT0FSRF9ERUFES0VZUykgcHJpdmF0ZSBfZGVhZGtleXM6IElLZXlib2FyZERlYWRrZXlzKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvLyByZWFkIHRoZSBkZWFka2V5c1xyXG4gICAgdGhpcy5fZGVhZGtleUtleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9kZWFka2V5cyk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMuY2FuY2VsUmVwZWF0KCk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gVHJpZ2dlciBnZW5lcmljIGNsaWNrIGV2ZW50XHJcbiAgICB0aGlzLmdlbmVyaWNDbGljay5lbWl0KGV2ZW50KTtcclxuXHJcbiAgICAvLyBEbyBub3QgZXhlY3V0ZSBrZXlwcmVzcyBpZiBrZXkgaXMgY3VycmVudGx5IHJlcGVhdGluZ1xyXG4gICAgaWYgKHRoaXMuX3JlcGVhdFN0YXRlKSB7IHJldHVybjsgfVxyXG5cclxuICAgIC8vIFRyaWdnZXIgYSBnbG9iYWwga2V5IGV2ZW50LiBUT0RPOiBpbnZlc3RpZ2F0ZVxyXG4gICAgLy8gdGhpcy5fdHJpZ2dlcktleUV2ZW50KCk7XHJcblxyXG4gICAgLy8gTWFuaXB1bGF0ZSB0aGUgZm9jdXNlZCBpbnB1dCAvIHRleHRhcmVhIHZhbHVlXHJcbiAgICBjb25zdCBjYXJldCA9IHRoaXMuaW5wdXQgPyB0aGlzLl9nZXRDdXJzb3JQb3NpdGlvbigpIDogMDtcclxuXHJcbiAgICBsZXQgY2hhcjogc3RyaW5nO1xyXG4gICAgXHJcbiAgICBzd2l0Y2ggKHRoaXMua2V5KSB7XHJcbiAgICAgIC8vIHRoaXMga2V5cyBoYXZlIG5vIGFjdGlvbnMgeWV0XHJcbiAgICAgIC8vIFRPRE86IGFkZCBkZWFka2V5cyBhbmQgbW9kaWZpZXJzXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHQ6XHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHRHcjpcclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkFsdExrOlxyXG4gICAgICAgIHRoaXMuYWx0Q2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQmtzcDpcclxuICAgICAgICB0aGlzLmRlbGV0ZVNlbGVjdGVkVGV4dCgpO1xyXG4gICAgICAgIHRoaXMuYmtzcENsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkNhcHM6XHJcbiAgICAgICAgdGhpcy5jYXBzQ2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuRW50ZXI6XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVGV4dGFyZWEoKSkge1xyXG4gICAgICAgICAgY2hhciA9IFZBTFVFX05FV0xJTkU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZW50ZXJDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICAgIC8vIFRPRE86IHRyaWdnZXIgc3VibWl0IC8gb25TdWJtaXQgLyBuZ1N1Ym1pdCBwcm9wZXJseSAoZm9yIHRoZSB0aW1lIGJlaW5nIHRoaXMgaGFzIHRvIGJlIGhhbmRsZWQgYnkgdGhlIHVzZXIgaGltc2VsZilcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY29udHJvbC5uZ0NvbnRyb2wuY29udHJvbC5yb290KVxyXG4gICAgICAgICAgLy8gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvcm0uc3VibWl0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlNoaWZ0OlxyXG4gICAgICAgIHRoaXMuc2hpZnRDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5TcGFjZTpcclxuICAgICAgICBjaGFyID0gVkFMVUVfU1BBQ0U7XHJcbiAgICAgICAgdGhpcy5zcGFjZUNsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlRhYjpcclxuICAgICAgICBjaGFyID0gVkFMVUVfVEFCO1xyXG4gICAgICAgIHRoaXMudGFiQ2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIC8vIHRoZSBrZXkgaXMgbm90IG1hcHBlZCBvciBhIHN0cmluZ1xyXG4gICAgICAgIGNoYXIgPSBgJHt0aGlzLmtleX1gO1xyXG4gICAgICAgIHRoaXMua2V5Q2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYXIgJiYgdGhpcy5pbnB1dCkge1xyXG4gICAgICB0aGlzLnJlcGxhY2VTZWxlY3RlZFRleHQoY2hhcik7XHJcbiAgICAgIHRoaXMuX3NldEN1cnNvclBvc2l0aW9uKGNhcmV0ICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGlzcGF0Y2ggSW5wdXQgRXZlbnQgZm9yIEFuZ3VsYXIgdG8gcmVnaXN0ZXIgYSBjaGFuZ2VcclxuICAgIGlmICh0aGlzLmlucHV0ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBIYW5kbGUgcmVwZWF0aW5nIGtleXMuIEtleXByZXNzIGxvZ2ljIGRlcml2ZWQgZnJvbSBvbkNsaWNrKClcclxuICBvblBvaW50ZXJEb3duKCkge1xyXG4gICAgdGhpcy5jYW5jZWxSZXBlYXQoKTtcclxuICAgIHRoaXMuX3JlcGVhdFN0YXRlID0gZmFsc2U7XHJcbiAgICB0aGlzLl9yZXBlYXRUaW1lb3V0SGFuZGxlciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAvLyBJbml0aWFsaXplIGtleXByZXNzIHZhcmlhYmxlc1xyXG4gICAgICBsZXQgY2hhcjogc3RyaW5nO1xyXG4gICAgICBsZXQga2V5Rm46ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMua2V5KSB7XHJcbiAgICAgICAgLy8gSWdub3JlIG5vbi1yZXBlYXRpbmcga2V5c1xyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHQ6XHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkFsdEdyOlxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHRMazpcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQ2FwczpcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuRW50ZXI6XHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlNoaWZ0OlxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQmtzcDpcclxuICAgICAgICAgIGtleUZuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZVNlbGVjdGVkVGV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLmJrc3BDbGljay5lbWl0KCk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5TcGFjZTpcclxuICAgICAgICAgIGNoYXIgPSBWQUxVRV9TUEFDRTtcclxuICAgICAgICAgIGtleUZuID0gKCkgPT4gdGhpcy5zcGFjZUNsaWNrLmVtaXQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuVGFiOlxyXG4gICAgICAgICAgY2hhciA9IFZBTFVFX1RBQjtcclxuICAgICAgICAgIGtleUZuID0gKCkgPT4gdGhpcy50YWJDbGljay5lbWl0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGNoYXIgPSBgJHt0aGlzLmtleX1gO1xyXG4gICAgICAgICAga2V5Rm4gPSAoKSA9PiB0aGlzLmtleUNsaWNrLmVtaXQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBFeGVjdXRlIHJlcGVhdGluZyBrZXlwcmVzc1xyXG4gICAgICB0aGlzLl9yZXBlYXRJbnRlcnZhbEhhbmRsZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2FyZXQgPSB0aGlzLmlucHV0ID8gdGhpcy5fZ2V0Q3Vyc29yUG9zaXRpb24oKSA6IDA7XHJcbiAgICAgICAgdGhpcy5fcmVwZWF0U3RhdGUgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoa2V5Rm4pIHsga2V5Rm4oKTsgfVxyXG5cclxuICAgICAgICBpZiAoY2hhciAmJiB0aGlzLmlucHV0KSB7XHJcbiAgICAgICAgICB0aGlzLnJlcGxhY2VTZWxlY3RlZFRleHQoY2hhcik7XHJcbiAgICAgICAgICB0aGlzLl9zZXRDdXJzb3JQb3NpdGlvbihjYXJldCArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFJFUEVBVF9JTlRFUlZBTCk7XHJcbiAgICB9LCBSRVBFQVRfVElNRU9VVCk7XHJcbiAgfVxyXG5cclxuICBjYW5jZWxSZXBlYXQoKSB7XHJcbiAgICBpZiAodGhpcy5fcmVwZWF0VGltZW91dEhhbmRsZXIpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlcGVhdFRpbWVvdXRIYW5kbGVyKTtcclxuICAgICAgdGhpcy5fcmVwZWF0VGltZW91dEhhbmRsZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9yZXBlYXRJbnRlcnZhbEhhbmRsZXIpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9yZXBlYXRJbnRlcnZhbEhhbmRsZXIpO1xyXG4gICAgICB0aGlzLl9yZXBlYXRJbnRlcnZhbEhhbmRsZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZWxldGVTZWxlY3RlZFRleHQoKTogdm9pZCB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaW5wdXRWYWx1ZSA/IHRoaXMuaW5wdXRWYWx1ZS50b1N0cmluZygpIDogJyc7XHJcbiAgICBsZXQgY2FyZXQgPSB0aGlzLmlucHV0ID8gdGhpcy5fZ2V0Q3Vyc29yUG9zaXRpb24oKSA6IDA7XHJcbiAgICBsZXQgc2VsZWN0aW9uTGVuZ3RoID0gdGhpcy5fZ2V0U2VsZWN0aW9uTGVuZ3RoKCk7XHJcbiAgICBpZiAoc2VsZWN0aW9uTGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGlmIChjYXJldCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FyZXQtLTtcclxuICAgICAgc2VsZWN0aW9uTGVuZ3RoID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBoZWFkUGFydCA9IHZhbHVlLnNsaWNlKDAsIGNhcmV0KTtcclxuICAgIGNvbnN0IGVuZFBhcnQgPSB2YWx1ZS5zbGljZShjYXJldCArIHNlbGVjdGlvbkxlbmd0aCk7XHJcblxyXG4gICAgdGhpcy5pbnB1dFZhbHVlID0gW2hlYWRQYXJ0LCBlbmRQYXJ0XS5qb2luKCcnKTtcclxuICAgIHRoaXMuX3NldEN1cnNvclBvc2l0aW9uKGNhcmV0KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVwbGFjZVNlbGVjdGVkVGV4dChjaGFyOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5pbnB1dFZhbHVlID8gdGhpcy5pbnB1dFZhbHVlLnRvU3RyaW5nKCkgOiAnJztcclxuICAgIGNvbnN0IGNhcmV0ID0gdGhpcy5pbnB1dCA/IHRoaXMuX2dldEN1cnNvclBvc2l0aW9uKCkgOiAwO1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uTGVuZ3RoID0gdGhpcy5fZ2V0U2VsZWN0aW9uTGVuZ3RoKCk7XHJcbiAgICBjb25zdCBoZWFkUGFydCA9IHZhbHVlLnNsaWNlKDAsIGNhcmV0KTtcclxuICAgIGNvbnN0IGVuZFBhcnQgPSB2YWx1ZS5zbGljZShjYXJldCArIHNlbGVjdGlvbkxlbmd0aCk7XHJcblxyXG4gICAgdGhpcy5pbnB1dFZhbHVlID0gW2hlYWRQYXJ0LCBjaGFyLCBlbmRQYXJ0XS5qb2luKCcnKTtcclxuICB9XHJcblxyXG4gIC8vIFRPRE86IEluY2x1ZGUgZm9yIHJlcGVhdGluZyBrZXlzIGFzIHdlbGwgKGlmIHRoaXMgZ2V0cyBpbXBsZW1lbnRlZClcclxuICAvLyBwcml2YXRlIF90cmlnZ2VyS2V5RXZlbnQoKTogRXZlbnQge1xyXG4gIC8vICAgY29uc3Qga2V5Ym9hcmRFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KCdrZXlkb3duJyk7XHJcbiAgLy8gICAvL1xyXG4gIC8vICAgLy8ga2V5Ym9hcmRFdmVudFtpbml0TWV0aG9kXShcclxuICAvLyAgIC8vICAgdHJ1ZSwgLy8gYnViYmxlc1xyXG4gIC8vICAgLy8gICB0cnVlLCAvLyBjYW5jZWxhYmxlXHJcbiAgLy8gICAvLyAgIHdpbmRvdywgLy8gdmlld0FyZzogc2hvdWxkIGJlIHdpbmRvd1xyXG4gIC8vICAgLy8gICBmYWxzZSwgLy8gY3RybEtleUFyZ1xyXG4gIC8vICAgLy8gICBmYWxzZSwgLy8gYWx0S2V5QXJnXHJcbiAgLy8gICAvLyAgIGZhbHNlLCAvLyBzaGlmdEtleUFyZ1xyXG4gIC8vICAgLy8gICBmYWxzZSwgLy8gbWV0YUtleUFyZ1xyXG4gIC8vICAgLy8gICB0aGlzLmNoYXJDb2RlLCAvLyBrZXlDb2RlQXJnIDogdW5zaWduZWQgbG9uZyAtIHRoZSB2aXJ0dWFsIGtleSBjb2RlLCBlbHNlIDBcclxuICAvLyAgIC8vICAgMCAvLyBjaGFyQ29kZUFyZ3MgOiB1bnNpZ25lZCBsb25nIC0gdGhlIFVuaWNvZGUgY2hhcmFjdGVyIGFzc29jaWF0ZWQgd2l0aCB0aGUgZGVwcmVzc2VkIGtleSwgZWxzZSAwXHJcbiAgLy8gICAvLyApO1xyXG4gIC8vICAgLy9cclxuICAvLyAgIC8vIHdpbmRvdy5kb2N1bWVudC5kaXNwYXRjaEV2ZW50KGtleWJvYXJkRXZlbnQpO1xyXG5cclxuICAvLyAgIHJldHVybiBrZXlib2FyZEV2ZW50O1xyXG4gIC8vIH1cclxuXHJcbiAgLy8gaW5zcGlyZWQgYnk6XHJcbiAgLy8gcmVmIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yODk3NTEwLzExNDYyMDdcclxuICBwcml2YXRlIF9nZXRDdXJzb3JQb3NpdGlvbigpOiBudW1iZXIge1xyXG4gICAgaWYgKCF0aGlzLmlucHV0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJ3NlbGVjdGlvblN0YXJ0JyBpbiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgLy8gU3RhbmRhcmQtY29tcGxpYW50IGJyb3dzZXJzXHJcbiAgICAgIHJldHVybiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICB9IGVsc2UgaWYgKCdzZWxlY3Rpb24nIGluIHdpbmRvdy5kb2N1bWVudCkge1xyXG4gICAgICAvLyBJRVxyXG4gICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgY29uc3Qgc2VsZWN0aW9uOiBhbnkgPSB3aW5kb3cuZG9jdW1lbnRbJ3NlbGVjdGlvbiddO1xyXG4gICAgICBjb25zdCBzZWwgPSBzZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKTtcclxuICAgICAgY29uc3Qgc2VsTGVuID0gc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dC5sZW5ndGg7XHJcbiAgICAgIHNlbC5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC10aGlzLmNvbnRyb2wudmFsdWUubGVuZ3RoKTtcclxuXHJcbiAgICAgIHJldHVybiBzZWwudGV4dC5sZW5ndGggLSBzZWxMZW47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9nZXRTZWxlY3Rpb25MZW5ndGgoKTogbnVtYmVyIHtcclxuICAgIGlmICghdGhpcy5pbnB1dCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCdzZWxlY3Rpb25FbmQnIGluIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICAvLyBTdGFuZGFyZC1jb21wbGlhbnQgYnJvd3NlcnNcclxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25FbmQgLSB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCdzZWxlY3Rpb24nIGluIHdpbmRvdy5kb2N1bWVudCkge1xyXG4gICAgICAvLyBJRVxyXG4gICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgY29uc3Qgc2VsZWN0aW9uOiBhbnkgPSB3aW5kb3cuZG9jdW1lbnRbJ3NlbGVjdGlvbiddO1xyXG4gICAgICByZXR1cm4gc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dC5sZW5ndGg7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpbnNwaXJlZCBieTpcclxuICAvLyByZWYgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEyNTE4NzM3LzExNDYyMDdcclxuICAvLyB0c2xpbnQ6ZGlzYWJsZSBvbmUtbGluZVxyXG4gIHByaXZhdGUgX3NldEN1cnNvclBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIGlmICghdGhpcy5pbnB1dCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5jb250cm9sLnZhbHVlO1xyXG4gICAgLy8gXiB0aGlzIGlzIHVzZWQgdG8gbm90IG9ubHkgZ2V0IFwiZm9jdXNcIiwgYnV0XHJcbiAgICAvLyB0byBtYWtlIHN1cmUgd2UgZG9uJ3QgaGF2ZSBpdCBldmVyeXRoaW5nIC1zZWxlY3RlZC1cclxuICAgIC8vIChpdCBjYXVzZXMgYW4gaXNzdWUgaW4gY2hyb21lLCBhbmQgaGF2aW5nIGl0IGRvZXNuJ3QgaHVydCBhbnkgb3RoZXIgYnJvd3NlcilcclxuXHJcbiAgICBpZiAoJ2NyZWF0ZVRleHRSYW5nZScgaW4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmNyZWF0ZVRleHRSYW5nZSgpO1xyXG4gICAgICByYW5nZS5tb3ZlKCdjaGFyYWN0ZXInLCBwb3NpdGlvbik7XHJcbiAgICAgIHJhbmdlLnNlbGVjdCgpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIChlbC5zZWxlY3Rpb25TdGFydCA9PT0gMCBhZGRlZCBmb3IgRmlyZWZveCBidWcpXHJcbiAgICAgIGlmICh0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgfHwgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0ID09PSAwKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKHBvc2l0aW9uLCBwb3NpdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgLy8gZmFpbCBjaXR5LCBmb3J0dW5hdGVseSB0aGlzIG5ldmVyIGhhcHBlbnMgKGFzIGZhciBhcyBJJ3ZlIHRlc3RlZCkgOilcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9pc1RleHRhcmVhKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5wdXQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC50YWdOYW1lID09PSAnVEVYVEFSRUEnO1xyXG4gIH1cclxuXHJcbn1cclxuIl19