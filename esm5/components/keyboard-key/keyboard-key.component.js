import { __decorate, __param } from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
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
    MatKeyboardKeyComponent.prototype.onTouchStart = function (event) {
        this._touchStart = new Date();
    };
    MatKeyboardKeyComponent.prototype.onTouchEnd = function (event) {
        if (this._touchStart) {
            this._touchEnd = new Date();
            if (this._touchEnd < this._touchStart) {
                this._touchEnd.setDate(this._touchEnd.getDate() + 1);
            }
            var diff = this._touchEnd - this._touchStart;
            // se l'utente tiene premuto un tasto per più di mezzo secondo
            if ((diff / 1000) > 0.5) {
                event.preventDefault();
            }
        }
    };
    MatKeyboardKeyComponent.prototype.onTouchMove = function (event) {
        if (this._touchStart) {
            this._touchEnd = new Date();
            if (this._touchEnd < this._touchStart) {
                this._touchEnd.setDate(this._touchEnd.getDate() + 1);
            }
            var diff = this._touchEnd - this._touchStart;
            // se l'utente tiene premuto un tasto per più di mezzo secondo
            if ((diff / 1000) > 0.5) {
                event.preventDefault();
            }
        }
    };
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
    return MatKeyboardKeyComponent;
}());
export { MatKeyboardKeyComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQta2V5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItb25zY3JlZW4tbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJjb21wb25lbnRzL2tleWJvYXJkLWtleS9rZXlib2FyZC1rZXkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXJKLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFJdkUsTUFBTSxDQUFDLElBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUNwQyxNQUFNLENBQUMsSUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDOUIsSUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBQzNCLElBQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQztBQVM1QjtJQWtMRSxzQkFBc0I7SUFDdEIsaUNBQW1ELFNBQTRCO1FBQTVCLGNBQVMsR0FBVCxTQUFTLENBQW1CO1FBakx2RSxpQkFBWSxHQUFhLEVBQUUsQ0FBQztRQUc1QixpQkFBWSxHQUFZLEtBQUssQ0FBQyxDQUFDLHNDQUFzQztRQUU3RSxZQUFPLEdBQTZCLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9ELGFBQVEsR0FBNkIsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUEwRWhFLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUc5QyxlQUFVLEdBQUcsSUFBSSxZQUFZ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QUFRLENBQUMsQ0FBQzsrREFFdEM7SUFFcUM7UUFBckMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzZEQWVwQztJQUVzQztRQUF0QyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7OERBZXJDO0lBR0Q7UUFEQyxLQUFLLEVBQUU7d0RBQ3VCO0lBRy9CO1FBREMsS0FBSyxFQUFFO3lEQUNPO0lBR2Y7UUFEQyxLQUFLLEVBQUU7eURBR1A7SUFPRDtRQURDLEtBQUssRUFBRTswREFHUDtJQU9EO1FBREMsS0FBSyxFQUFFOzBEQUNXO0lBR25CO1FBREMsS0FBSyxFQUFFOzREQUNjO0lBR3RCO1FBREMsTUFBTSxFQUFFO2lFQUNxQztJQUc5QztRQURDLE1BQU0sRUFBRTsrREFDbUM7SUFHNUM7UUFEQyxNQUFNLEVBQUU7OERBQ2tDO0lBRzNDO1FBREMsTUFBTSxFQUFFOzhEQUNrQztJQUczQztRQURDLE1BQU0sRUFBRTs2REFDaUM7SUFHMUM7UUFEQyxNQUFNLEVBQUU7K0RBQ21DO0lBRzVDO1FBREMsTUFBTSxFQUFFOytEQUNtQztJQUc1QztRQURDLE1BQU0sRUFBRTs2REFDaUM7SUFHMUM7UUFEQyxNQUFNLEVBQUU7NkRBQ2lDO0lBM0cvQix1QkFBdUI7UUFQbkMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGtCQUFrQjtZQUM1Qix1b0JBQTRDO1lBRTVDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1lBQy9DLG1CQUFtQixFQUFFLEtBQUs7O1NBQzNCLENBQUM7UUFvTGEsV0FBQSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTtPQW5ML0IsdUJBQXVCLENBcWRuQztJQUFELDhCQUFDO0NBQUEsQUFyZEQsSUFxZEM7U0FyZFksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNQVRfS0VZQk9BUkRfREVBREtFWVMgfSBmcm9tICcuLi8uLi9jb25maWdzL2tleWJvYXJkLWRlYWRrZXkuY29uZmlnJztcclxuaW1wb3J0IHsgS2V5Ym9hcmRDbGFzc0tleSB9IGZyb20gJy4uLy4uL2VudW1zL2tleWJvYXJkLWNsYXNzLWtleS5lbnVtJztcclxuaW1wb3J0IHsgSUtleWJvYXJkRGVhZGtleXMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2tleWJvYXJkLWRlYWRrZXlzLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElNYXRJY29uIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9rZXlib2FyZC1pY29ucy5pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFZBTFVFX05FV0xJTkUgPSAnXFxuXFxyJztcclxuZXhwb3J0IGNvbnN0IFZBTFVFX1NQQUNFID0gJyAnO1xyXG5leHBvcnQgY29uc3QgVkFMVUVfVEFCID0gJ1xcdCc7XHJcbmNvbnN0IFJFUEVBVF9USU1FT1VUID0gNTAwO1xyXG5jb25zdCBSRVBFQVRfSU5URVJWQUwgPSAxMDA7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ21hdC1rZXlib2FyZC1rZXknLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9rZXlib2FyZC1rZXkuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2tleWJvYXJkLWtleS5jb21wb25lbnQuc2NzcyddLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXRLZXlib2FyZEtleUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuXHJcbiAgcHJpdmF0ZSBfZGVhZGtleUtleXM6IHN0cmluZ1tdID0gW107XHJcbiAgcHJpdmF0ZSBfcmVwZWF0VGltZW91dEhhbmRsZXI6IGFueTtcclxuICBwcml2YXRlIF9yZXBlYXRJbnRlcnZhbEhhbmRsZXI6IGFueTtcclxuICBwcml2YXRlIF9yZXBlYXRTdGF0ZTogYm9vbGVhbiA9IGZhbHNlOyAvLyB0cnVlIGlmIHJlcGVhdGluZywgZmFsc2UgaWYgd2FpdGluZ1xyXG5cclxuICBhY3RpdmUkOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcclxuXHJcbiAgcHJlc3NlZCQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xyXG5cclxuICBwcml2YXRlIF90b3VjaFN0YXJ0O1xyXG4gIHByaXZhdGUgX3RvdWNoRW5kO1xyXG5cclxuICBASG9zdExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgWyckZXZlbnQnXSkgb25Ub3VjaFN0YXJ0KGV2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5fdG91Y2hTdGFydCA9IG5ldyBEYXRlKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCd0b3VjaGVuZCcsIFsnJGV2ZW50J10pIG9uVG91Y2hFbmQoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fdG91Y2hTdGFydCkge1xyXG4gICAgICB0aGlzLl90b3VjaEVuZCA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5fdG91Y2hFbmQgPCB0aGlzLl90b3VjaFN0YXJ0KSB7XHJcbiAgICAgICAgdGhpcy5fdG91Y2hFbmQuc2V0RGF0ZSh0aGlzLl90b3VjaEVuZC5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGRpZmYgPSB0aGlzLl90b3VjaEVuZCAtIHRoaXMuX3RvdWNoU3RhcnQ7XHJcblxyXG4gICAgICAvLyBzZSBsJ3V0ZW50ZSB0aWVuZSBwcmVtdXRvIHVuIHRhc3RvIHBlciBwacO5IGRpIG1lenpvIHNlY29uZG9cclxuICAgICAgaWYgKChkaWZmIC8gMTAwMCkgPiAwLjUpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCd0b3VjaG1vdmUnLCBbJyRldmVudCddKSBvblRvdWNoTW92ZShldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLl90b3VjaFN0YXJ0KSB7XHJcbiAgICAgIHRoaXMuX3RvdWNoRW5kID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLl90b3VjaEVuZCA8IHRoaXMuX3RvdWNoU3RhcnQpIHtcclxuICAgICAgICB0aGlzLl90b3VjaEVuZC5zZXREYXRlKHRoaXMuX3RvdWNoRW5kLmdldERhdGUoKSArIDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZGlmZiA9IHRoaXMuX3RvdWNoRW5kIC0gdGhpcy5fdG91Y2hTdGFydDtcclxuXHJcbiAgICAgIC8vIHNlIGwndXRlbnRlIHRpZW5lIHByZW11dG8gdW4gdGFzdG8gcGVyIHBpw7kgZGkgbWV6em8gc2Vjb25kb1xyXG4gICAgICBpZiAoKGRpZmYgLyAxMDAwKSA+IDAuNSkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAga2V5OiBzdHJpbmcgfCBLZXlib2FyZENsYXNzS2V5O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGljb246IElNYXRJY29uO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHNldCBhY3RpdmUoYWN0aXZlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLmFjdGl2ZSQubmV4dChhY3RpdmUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZSQuZ2V0VmFsdWUoKTtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgc2V0IHByZXNzZWQocHJlc3NlZDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5wcmVzc2VkJC5uZXh0KHByZXNzZWQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHByZXNzZWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcmVzc2VkJC5nZXRWYWx1ZSgpO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBpbnB1dD86IEVsZW1lbnRSZWY7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY29udHJvbD86IEZvcm1Db250cm9sO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBnZW5lcmljQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGVudGVyQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGJrc3BDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgY2Fwc0NsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBhbHRDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgc2hpZnRDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgc3BhY2VDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgdGFiQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIGtleUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xyXG5cclxuICBnZXQgbG93ZXJLZXkoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmtleX1gLnRvTG93ZXJDYXNlKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgY2hhckNvZGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmtleX1gLmNoYXJDb2RlQXQoMCk7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNDbGFzc0tleSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmtleSBpbiBLZXlib2FyZENsYXNzS2V5O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlzRGVhZEtleSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9kZWFka2V5S2V5cy5zb21lKChkZWFkS2V5OiBzdHJpbmcpID0+IGRlYWRLZXkgPT09IGAke3RoaXMua2V5fWApO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGhhc0ljb24oKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pY29uICE9PSBudWxsO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGljb25OYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uLm5hbWUgfHwgJyc7XHJcbiAgfVxyXG5cclxuICBnZXQgZm9udFNldCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuaWNvbi5mb250U2V0IHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGZvbnRJY29uKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pY29uLmZvbnRJY29uIHx8ICcnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHN2Z0ljb24oKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmljb24uc3ZnSWNvbiB8fCAnJztcclxuICB9XHJcblxyXG4gIGdldCBjc3NDbGFzcygpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtdO1xyXG5cclxuICAgIGlmICh0aGlzLmhhc0ljb24pIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKCdtYXQta2V5Ym9hcmQta2V5LW1vZGlmaWVyJyk7XHJcbiAgICAgIGNsYXNzZXMucHVzaChgbWF0LWtleWJvYXJkLWtleS0ke3RoaXMubG93ZXJLZXl9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEZWFkS2V5KSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaCgnbWF0LWtleWJvYXJkLWtleS1kZWFka2V5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlucHV0VmFsdWUoKTogc3RyaW5nIHtcclxuICAgIGlmICh0aGlzLmNvbnRyb2wpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbC52YWx1ZTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQgJiYgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXQgaW5wdXRWYWx1ZShpbnB1dFZhbHVlOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLmNvbnRyb2wpIHtcclxuICAgICAgdGhpcy5jb250cm9sLnNldFZhbHVlKGlucHV0VmFsdWUpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlucHV0ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBpbnB1dFZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSW5qZWN0IGRlcGVuZGVuY2llc1xyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTUFUX0tFWUJPQVJEX0RFQURLRVlTKSBwcml2YXRlIF9kZWFka2V5czogSUtleWJvYXJkRGVhZGtleXMpIHsgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIHJlYWQgdGhlIGRlYWRrZXlzXHJcbiAgICB0aGlzLl9kZWFka2V5S2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuX2RlYWRrZXlzKTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5jYW5jZWxSZXBlYXQoKTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIC8vIFRyaWdnZXIgZ2VuZXJpYyBjbGljayBldmVudFxyXG4gICAgdGhpcy5nZW5lcmljQ2xpY2suZW1pdChldmVudCk7XHJcblxyXG4gICAgLy8gRG8gbm90IGV4ZWN1dGUga2V5cHJlc3MgaWYga2V5IGlzIGN1cnJlbnRseSByZXBlYXRpbmdcclxuICAgIGlmICh0aGlzLl9yZXBlYXRTdGF0ZSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAvLyBUcmlnZ2VyIGEgZ2xvYmFsIGtleSBldmVudC4gVE9ETzogaW52ZXN0aWdhdGVcclxuICAgIC8vIHRoaXMuX3RyaWdnZXJLZXlFdmVudCgpO1xyXG5cclxuICAgIC8vIE1hbmlwdWxhdGUgdGhlIGZvY3VzZWQgaW5wdXQgLyB0ZXh0YXJlYSB2YWx1ZVxyXG4gICAgY29uc3QgY2FyZXQgPSB0aGlzLmlucHV0ID8gdGhpcy5fZ2V0Q3Vyc29yUG9zaXRpb24oKSA6IDA7XHJcblxyXG4gICAgbGV0IGNoYXI6IHN0cmluZztcclxuICAgIFxyXG4gICAgc3dpdGNoICh0aGlzLmtleSkge1xyXG4gICAgICAvLyB0aGlzIGtleXMgaGF2ZSBubyBhY3Rpb25zIHlldFxyXG4gICAgICAvLyBUT0RPOiBhZGQgZGVhZGtleXMgYW5kIG1vZGlmaWVyc1xyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0OlxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0R3I6XHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHRMazpcclxuICAgICAgICB0aGlzLmFsdENsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkJrc3A6XHJcbiAgICAgICAgdGhpcy5kZWxldGVTZWxlY3RlZFRleHQoKTtcclxuICAgICAgICB0aGlzLmJrc3BDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5DYXBzOlxyXG4gICAgICAgIHRoaXMuY2Fwc0NsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkVudGVyOlxyXG4gICAgICAgIGlmICh0aGlzLl9pc1RleHRhcmVhKCkpIHtcclxuICAgICAgICAgIGNoYXIgPSBWQUxVRV9ORVdMSU5FO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmVudGVyQ2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgICAvLyBUT0RPOiB0cmlnZ2VyIHN1Ym1pdCAvIG9uU3VibWl0IC8gbmdTdWJtaXQgcHJvcGVybHkgKGZvciB0aGUgdGltZSBiZWluZyB0aGlzIGhhcyB0byBiZSBoYW5kbGVkIGJ5IHRoZSB1c2VyIGhpbXNlbGYpXHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNvbnRyb2wubmdDb250cm9sLmNvbnRyb2wucm9vdClcclxuICAgICAgICAgIC8vIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb3JtLnN1Ym1pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5TaGlmdDpcclxuICAgICAgICB0aGlzLnNoaWZ0Q2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuU3BhY2U6XHJcbiAgICAgICAgY2hhciA9IFZBTFVFX1NQQUNFO1xyXG4gICAgICAgIHRoaXMuc3BhY2VDbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5UYWI6XHJcbiAgICAgICAgY2hhciA9IFZBTFVFX1RBQjtcclxuICAgICAgICB0aGlzLnRhYkNsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICAvLyB0aGUga2V5IGlzIG5vdCBtYXBwZWQgb3IgYSBzdHJpbmdcclxuICAgICAgICBjaGFyID0gYCR7dGhpcy5rZXl9YDtcclxuICAgICAgICB0aGlzLmtleUNsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFyICYmIHRoaXMuaW5wdXQpIHtcclxuICAgICAgdGhpcy5yZXBsYWNlU2VsZWN0ZWRUZXh0KGNoYXIpO1xyXG4gICAgICB0aGlzLl9zZXRDdXJzb3JQb3NpdGlvbihjYXJldCArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERpc3BhdGNoIElucHV0IEV2ZW50IGZvciBBbmd1bGFyIHRvIHJlZ2lzdGVyIGEgY2hhbmdlXHJcbiAgICBpZiAodGhpcy5pbnB1dCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSGFuZGxlIHJlcGVhdGluZyBrZXlzLiBLZXlwcmVzcyBsb2dpYyBkZXJpdmVkIGZyb20gb25DbGljaygpXHJcbiAgb25Qb2ludGVyRG93bigpIHtcclxuICAgIHRoaXMuY2FuY2VsUmVwZWF0KCk7XHJcbiAgICB0aGlzLl9yZXBlYXRTdGF0ZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5fcmVwZWF0VGltZW91dEhhbmRsZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgLy8gSW5pdGlhbGl6ZSBrZXlwcmVzcyB2YXJpYWJsZXNcclxuICAgICAgbGV0IGNoYXI6IHN0cmluZztcclxuICAgICAgbGV0IGtleUZuOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLmtleSkge1xyXG4gICAgICAgIC8vIElnbm9yZSBub24tcmVwZWF0aW5nIGtleXNcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0OlxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5BbHRHcjpcclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuQWx0TGs6XHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkNhcHM6XHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkVudGVyOlxyXG4gICAgICAgIGNhc2UgS2V5Ym9hcmRDbGFzc0tleS5TaGlmdDpcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LkJrc3A6XHJcbiAgICAgICAgICBrZXlGbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVTZWxlY3RlZFRleHQoKTtcclxuICAgICAgICAgICAgdGhpcy5ia3NwQ2xpY2suZW1pdCgpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIEtleWJvYXJkQ2xhc3NLZXkuU3BhY2U6XHJcbiAgICAgICAgICBjaGFyID0gVkFMVUVfU1BBQ0U7XHJcbiAgICAgICAgICBrZXlGbiA9ICgpID0+IHRoaXMuc3BhY2VDbGljay5lbWl0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBLZXlib2FyZENsYXNzS2V5LlRhYjpcclxuICAgICAgICAgIGNoYXIgPSBWQUxVRV9UQUI7XHJcbiAgICAgICAgICBrZXlGbiA9ICgpID0+IHRoaXMudGFiQ2xpY2suZW1pdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBjaGFyID0gYCR7dGhpcy5rZXl9YDtcclxuICAgICAgICAgIGtleUZuID0gKCkgPT4gdGhpcy5rZXlDbGljay5lbWl0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRXhlY3V0ZSByZXBlYXRpbmcga2V5cHJlc3NcclxuICAgICAgdGhpcy5fcmVwZWF0SW50ZXJ2YWxIYW5kbGVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhcmV0ID0gdGhpcy5pbnB1dCA/IHRoaXMuX2dldEN1cnNvclBvc2l0aW9uKCkgOiAwO1xyXG4gICAgICAgIHRoaXMuX3JlcGVhdFN0YXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKGtleUZuKSB7IGtleUZuKCk7IH1cclxuXHJcbiAgICAgICAgaWYgKGNoYXIgJiYgdGhpcy5pbnB1dCkge1xyXG4gICAgICAgICAgdGhpcy5yZXBsYWNlU2VsZWN0ZWRUZXh0KGNoYXIpO1xyXG4gICAgICAgICAgdGhpcy5fc2V0Q3Vyc29yUG9zaXRpb24oY2FyZXQgKyAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlucHV0ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBSRVBFQVRfSU5URVJWQUwpO1xyXG4gICAgfSwgUkVQRUFUX1RJTUVPVVQpO1xyXG4gIH1cclxuXHJcbiAgY2FuY2VsUmVwZWF0KCkge1xyXG4gICAgaWYgKHRoaXMuX3JlcGVhdFRpbWVvdXRIYW5kbGVyKSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZXBlYXRUaW1lb3V0SGFuZGxlcik7XHJcbiAgICAgIHRoaXMuX3JlcGVhdFRpbWVvdXRIYW5kbGVyID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fcmVwZWF0SW50ZXJ2YWxIYW5kbGVyKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fcmVwZWF0SW50ZXJ2YWxIYW5kbGVyKTtcclxuICAgICAgdGhpcy5fcmVwZWF0SW50ZXJ2YWxIYW5kbGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZGVsZXRlU2VsZWN0ZWRUZXh0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmlucHV0VmFsdWUgPyB0aGlzLmlucHV0VmFsdWUudG9TdHJpbmcoKSA6ICcnO1xyXG4gICAgbGV0IGNhcmV0ID0gdGhpcy5pbnB1dCA/IHRoaXMuX2dldEN1cnNvclBvc2l0aW9uKCkgOiAwO1xyXG4gICAgbGV0IHNlbGVjdGlvbkxlbmd0aCA9IHRoaXMuX2dldFNlbGVjdGlvbkxlbmd0aCgpO1xyXG4gICAgaWYgKHNlbGVjdGlvbkxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBpZiAoY2FyZXQgPT09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhcmV0LS07XHJcbiAgICAgIHNlbGVjdGlvbkxlbmd0aCA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaGVhZFBhcnQgPSB2YWx1ZS5zbGljZSgwLCBjYXJldCk7XHJcbiAgICBjb25zdCBlbmRQYXJ0ID0gdmFsdWUuc2xpY2UoY2FyZXQgKyBzZWxlY3Rpb25MZW5ndGgpO1xyXG5cclxuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IFtoZWFkUGFydCwgZW5kUGFydF0uam9pbignJyk7XHJcbiAgICB0aGlzLl9zZXRDdXJzb3JQb3NpdGlvbihjYXJldCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlcGxhY2VTZWxlY3RlZFRleHQoY2hhcjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaW5wdXRWYWx1ZSA/IHRoaXMuaW5wdXRWYWx1ZS50b1N0cmluZygpIDogJyc7XHJcbiAgICBjb25zdCBjYXJldCA9IHRoaXMuaW5wdXQgPyB0aGlzLl9nZXRDdXJzb3JQb3NpdGlvbigpIDogMDtcclxuICAgIGNvbnN0IHNlbGVjdGlvbkxlbmd0aCA9IHRoaXMuX2dldFNlbGVjdGlvbkxlbmd0aCgpO1xyXG4gICAgY29uc3QgaGVhZFBhcnQgPSB2YWx1ZS5zbGljZSgwLCBjYXJldCk7XHJcbiAgICBjb25zdCBlbmRQYXJ0ID0gdmFsdWUuc2xpY2UoY2FyZXQgKyBzZWxlY3Rpb25MZW5ndGgpO1xyXG5cclxuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IFtoZWFkUGFydCwgY2hhciwgZW5kUGFydF0uam9pbignJyk7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPOiBJbmNsdWRlIGZvciByZXBlYXRpbmcga2V5cyBhcyB3ZWxsIChpZiB0aGlzIGdldHMgaW1wbGVtZW50ZWQpXHJcbiAgLy8gcHJpdmF0ZSBfdHJpZ2dlcktleUV2ZW50KCk6IEV2ZW50IHtcclxuICAvLyAgIGNvbnN0IGtleWJvYXJkRXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicpO1xyXG4gIC8vICAgLy9cclxuICAvLyAgIC8vIGtleWJvYXJkRXZlbnRbaW5pdE1ldGhvZF0oXHJcbiAgLy8gICAvLyAgIHRydWUsIC8vIGJ1YmJsZXNcclxuICAvLyAgIC8vICAgdHJ1ZSwgLy8gY2FuY2VsYWJsZVxyXG4gIC8vICAgLy8gICB3aW5kb3csIC8vIHZpZXdBcmc6IHNob3VsZCBiZSB3aW5kb3dcclxuICAvLyAgIC8vICAgZmFsc2UsIC8vIGN0cmxLZXlBcmdcclxuICAvLyAgIC8vICAgZmFsc2UsIC8vIGFsdEtleUFyZ1xyXG4gIC8vICAgLy8gICBmYWxzZSwgLy8gc2hpZnRLZXlBcmdcclxuICAvLyAgIC8vICAgZmFsc2UsIC8vIG1ldGFLZXlBcmdcclxuICAvLyAgIC8vICAgdGhpcy5jaGFyQ29kZSwgLy8ga2V5Q29kZUFyZyA6IHVuc2lnbmVkIGxvbmcgLSB0aGUgdmlydHVhbCBrZXkgY29kZSwgZWxzZSAwXHJcbiAgLy8gICAvLyAgIDAgLy8gY2hhckNvZGVBcmdzIDogdW5zaWduZWQgbG9uZyAtIHRoZSBVbmljb2RlIGNoYXJhY3RlciBhc3NvY2lhdGVkIHdpdGggdGhlIGRlcHJlc3NlZCBrZXksIGVsc2UgMFxyXG4gIC8vICAgLy8gKTtcclxuICAvLyAgIC8vXHJcbiAgLy8gICAvLyB3aW5kb3cuZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChrZXlib2FyZEV2ZW50KTtcclxuXHJcbiAgLy8gICByZXR1cm4ga2V5Ym9hcmRFdmVudDtcclxuICAvLyB9XHJcblxyXG4gIC8vIGluc3BpcmVkIGJ5OlxyXG4gIC8vIHJlZiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjg5NzUxMC8xMTQ2MjA3XHJcbiAgcHJpdmF0ZSBfZ2V0Q3Vyc29yUG9zaXRpb24oKTogbnVtYmVyIHtcclxuICAgIGlmICghdGhpcy5pbnB1dCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCdzZWxlY3Rpb25TdGFydCcgaW4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIC8vIFN0YW5kYXJkLWNvbXBsaWFudCBicm93c2Vyc1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xyXG4gICAgfSBlbHNlIGlmICgnc2VsZWN0aW9uJyBpbiB3aW5kb3cuZG9jdW1lbnQpIHtcclxuICAgICAgLy8gSUVcclxuICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbjogYW55ID0gd2luZG93LmRvY3VtZW50WydzZWxlY3Rpb24nXTtcclxuICAgICAgY29uc3Qgc2VsID0gc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCk7XHJcbiAgICAgIGNvbnN0IHNlbExlbiA9IHNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnRleHQubGVuZ3RoO1xyXG4gICAgICBzZWwubW92ZVN0YXJ0KCdjaGFyYWN0ZXInLCAtdGhpcy5jb250cm9sLnZhbHVlLmxlbmd0aCk7XHJcblxyXG4gICAgICByZXR1cm4gc2VsLnRleHQubGVuZ3RoIC0gc2VsTGVuO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZ2V0U2VsZWN0aW9uTGVuZ3RoKCk6IG51bWJlciB7XHJcbiAgICBpZiAoIXRoaXMuaW5wdXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgnc2VsZWN0aW9uRW5kJyBpbiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgLy8gU3RhbmRhcmQtY29tcGxpYW50IGJyb3dzZXJzXHJcbiAgICAgIHJldHVybiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uRW5kIC0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgnc2VsZWN0aW9uJyBpbiB3aW5kb3cuZG9jdW1lbnQpIHtcclxuICAgICAgLy8gSUVcclxuICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbjogYW55ID0gd2luZG93LmRvY3VtZW50WydzZWxlY3Rpb24nXTtcclxuICAgICAgcmV0dXJuIHNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnRleHQubGVuZ3RoO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaW5zcGlyZWQgYnk6XHJcbiAgLy8gcmVmIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMjUxODczNy8xMTQ2MjA3XHJcbiAgLy8gdHNsaW50OmRpc2FibGUgb25lLWxpbmVcclxuICBwcml2YXRlIF9zZXRDdXJzb3JQb3NpdGlvbihwb3NpdGlvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMuaW5wdXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHRoaXMuY29udHJvbC52YWx1ZTtcclxuICAgIC8vIF4gdGhpcyBpcyB1c2VkIHRvIG5vdCBvbmx5IGdldCBcImZvY3VzXCIsIGJ1dFxyXG4gICAgLy8gdG8gbWFrZSBzdXJlIHdlIGRvbid0IGhhdmUgaXQgZXZlcnl0aGluZyAtc2VsZWN0ZWQtXHJcbiAgICAvLyAoaXQgY2F1c2VzIGFuIGlzc3VlIGluIGNocm9tZSwgYW5kIGhhdmluZyBpdCBkb2Vzbid0IGh1cnQgYW55IG90aGVyIGJyb3dzZXIpXHJcblxyXG4gICAgaWYgKCdjcmVhdGVUZXh0UmFuZ2UnIGluIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5jcmVhdGVUZXh0UmFuZ2UoKTtcclxuICAgICAgcmFuZ2UubW92ZSgnY2hhcmFjdGVyJywgcG9zaXRpb24pO1xyXG4gICAgICByYW5nZS5zZWxlY3QoKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyAoZWwuc2VsZWN0aW9uU3RhcnQgPT09IDAgYWRkZWQgZm9yIEZpcmVmb3ggYnVnKVxyXG4gICAgICBpZiAodGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0IHx8IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydCA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShwb3NpdGlvbiwgcG9zaXRpb24pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGZhaWwgY2l0eSwgZm9ydHVuYXRlbHkgdGhpcyBuZXZlciBoYXBwZW5zIChhcyBmYXIgYXMgSSd2ZSB0ZXN0ZWQpIDopXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfaXNUZXh0YXJlYSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmlucHV0ICYmIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCAmJiB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJztcclxuICB9XHJcblxyXG59XHJcbiJdfQ==