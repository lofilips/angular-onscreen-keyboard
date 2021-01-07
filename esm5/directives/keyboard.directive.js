import { __decorate, __param } from "tslib";
import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatKeyboardService } from '../services/keyboard.service';
var MatKeyboardDirective = /** @class */ (function () {
    function MatKeyboardDirective(_elementRef, _keyboardService, _control) {
        this._elementRef = _elementRef;
        this._keyboardService = _keyboardService;
        this._control = _control;
        this.keyClick = new EventEmitter();
        this.bkspClick = new EventEmitter();
        this.enterClick = new EventEmitter();
        this.capsClick = new EventEmitter();
        this.altClick = new EventEmitter();
        this.shiftClick = new EventEmitter();
        this.spaceClick = new EventEmitter();
    }
    MatKeyboardDirective.prototype.ngOnDestroy = function () {
        this.hideKeyboard();
    };
    MatKeyboardDirective.prototype.showKeyboard = function () {
        var _this = this;
        this._keyboardRef = this._keyboardService.open(this.matKeyboard, {
            darkTheme: this.darkTheme,
            duration: this.duration,
            isDebug: this.isDebug
        });
        // reference the input element
        this._keyboardRef.instance.setInputInstance(this._elementRef);
        // set control if given, cast to smth. non-abstract
        if (this._control) {
            this._keyboardRef.instance.attachControl(this._control.control);
        }
        // connect outputs
        this._keyboardRef.instance.keyClick.subscribe(function (event) { return _this.keyClick.next(event); });
        this._keyboardRef.instance.bkspClick.subscribe(function (event) { return _this.bkspClick.next(event); });
        this._keyboardRef.instance.enterClick.subscribe(function (event) { return _this.enterClick.next(_this._keyboardRef); });
        this._keyboardRef.instance.capsClick.subscribe(function (event) { return _this.capsClick.next(event); });
        this._keyboardRef.instance.altClick.subscribe(function () { return _this.altClick.next(); });
        this._keyboardRef.instance.shiftClick.subscribe(function (event) { return _this.shiftClick.next(event); });
        this._keyboardRef.instance.spaceClick.subscribe(function (event) { return _this.spaceClick.next(event); });
    };
    MatKeyboardDirective.prototype.hideKeyboard = function () {
        if (this._keyboardRef) {
            this._keyboardRef.dismiss();
        }
    };
    MatKeyboardDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: MatKeyboardService },
        { type: NgControl, decorators: [{ type: Optional }, { type: Self }] }
    ]; };
    __decorate([
        Input()
    ], MatKeyboardDirective.prototype, "matKeyboard", void 0);
    __decorate([
        Input()
    ], MatKeyboardDirective.prototype, "darkTheme", void 0);
    __decorate([
        Input()
    ], MatKeyboardDirective.prototype, "duration", void 0);
    __decorate([
        Input()
    ], MatKeyboardDirective.prototype, "isDebug", void 0);
    __decorate([
        Output()
    ], MatKeyboardDirective.prototype, "keyClick", void 0);
    __decorate([
        Output()
    ], MatKeyboardDirective.prototype, "bkspClick", void 0);
    __decorate([
        Output()
    ], MatKeyboardDirective.prototype, "enterClick", void 0);
    __decorate([
        Output()
    ], MatKeyboardDirective.prototype, "capsClick", void 0);
    __decorate([
        Output()
    ], MatKeyboardDirective.prototype, "altClick", void 0);
    __decorate([
        Output()
    ], MatKeyboardDirective.prototype, "shiftClick", void 0);
    __decorate([
        Output()
    ], MatKeyboardDirective.prototype, "spaceClick", void 0);
    __decorate([
        HostListener('focus', ['$event'])
    ], MatKeyboardDirective.prototype, "showKeyboard", null);
    __decorate([
        HostListener('blur', ['$event'])
    ], MatKeyboardDirective.prototype, "hideKeyboard", null);
    MatKeyboardDirective = __decorate([
        Directive({
            selector: 'input[matKeyboard], textarea[matKeyboard]'
        }),
        __param(2, Optional()), __param(2, Self())
    ], MatKeyboardDirective);
    return MatKeyboardDirective;
}());
export { MatKeyboardDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMva2V5Ym9hcmQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTNDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBS2xFO0lBaUJFLDhCQUFvQixXQUF1QixFQUN2QixnQkFBb0MsRUFDaEIsUUFBb0I7UUFGeEMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFvQjtRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBVmxELGFBQVEsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUN4RCxjQUFTLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFDekQsZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBQzFELGNBQVMsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUN6RCxhQUFRLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFDeEQsZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBQzFELGVBQVUsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztJQUlMLENBQUM7SUFFaEUsMENBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBR00sMkNBQVksR0FBbkI7UUFEQSxpQkF3QkM7UUF0QkMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJ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MUQ7UUFBVCxNQUFNLEVBQUU7NERBQTJEO0lBV3BFO1FBREMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzREQXdCakM7SUFHRDtRQURDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0REFLaEM7SUF4RFUsb0JBQW9CO1FBSGhDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSwyQ0FBMkM7U0FDdEQsQ0FBQztRQW9CYSxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxJQUFJLEVBQUUsQ0FBQTtPQW5CcEIsb0JBQW9CLENBMERoQztJQUFELDJCQUFDO0NBQUEsQUExREQsSUEwREM7U0ExRFksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uRGVzdHJveSwgT3B0aW9uYWwsIE91dHB1dCwgU2VsZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG5pbXBvcnQgeyBNYXRLZXlib2FyZFJlZiB9IGZyb20gJy4uL2NsYXNzZXMva2V5Ym9hcmQtcmVmLmNsYXNzJztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2tleWJvYXJkL2tleWJvYXJkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE1hdEtleWJvYXJkU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2tleWJvYXJkLnNlcnZpY2UnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdpbnB1dFttYXRLZXlib2FyZF0sIHRleHRhcmVhW21hdEtleWJvYXJkXSdcclxufSlcclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkRGlyZWN0aXZlIGltcGxlbWVudHMgT25EZXN0cm95IHtcclxuXHJcbiAgcHJpdmF0ZSBfa2V5Ym9hcmRSZWY6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PjtcclxuXHJcbiAgQElucHV0KCkgbWF0S2V5Ym9hcmQ6IHN0cmluZztcclxuICBASW5wdXQoKSBkYXJrVGhlbWU6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgZHVyYXRpb246IG51bWJlcjtcclxuICBASW5wdXQoKSBpc0RlYnVnOiBib29sZWFuO1xyXG5cclxuICBAT3V0cHV0KCkga2V5Q2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICBAT3V0cHV0KCkgYmtzcENsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgQE91dHB1dCgpIGVudGVyQ2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICBAT3V0cHV0KCkgY2Fwc0NsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgQE91dHB1dCgpIGFsdENsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgQE91dHB1dCgpIHNoaWZ0Q2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuICBAT3V0cHV0KCkgc3BhY2VDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgX2tleWJvYXJkU2VydmljZTogTWF0S2V5Ym9hcmRTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgcHJpdmF0ZSBfY29udHJvbD86IE5nQ29udHJvbCkge31cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLmhpZGVLZXlib2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnLCBbJyRldmVudCddKVxyXG4gIHB1YmxpYyBzaG93S2V5Ym9hcmQoKSB7XHJcbiAgICB0aGlzLl9rZXlib2FyZFJlZiA9IHRoaXMuX2tleWJvYXJkU2VydmljZS5vcGVuKHRoaXMubWF0S2V5Ym9hcmQsIHtcclxuICAgICAgZGFya1RoZW1lOiB0aGlzLmRhcmtUaGVtZSxcclxuICAgICAgZHVyYXRpb246IHRoaXMuZHVyYXRpb24sXHJcbiAgICAgIGlzRGVidWc6IHRoaXMuaXNEZWJ1Z1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gcmVmZXJlbmNlIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICB0aGlzLl9rZXlib2FyZFJlZi5pbnN0YW5jZS5zZXRJbnB1dEluc3RhbmNlKHRoaXMuX2VsZW1lbnRSZWYpO1xyXG5cclxuICAgIC8vIHNldCBjb250cm9sIGlmIGdpdmVuLCBjYXN0IHRvIHNtdGguIG5vbi1hYnN0cmFjdFxyXG4gICAgaWYgKHRoaXMuX2NvbnRyb2wpIHtcclxuICAgICAgdGhpcy5fa2V5Ym9hcmRSZWYuaW5zdGFuY2UuYXR0YWNoQ29udHJvbCh0aGlzLl9jb250cm9sLmNvbnRyb2wpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbm5lY3Qgb3V0cHV0c1xyXG4gICAgdGhpcy5fa2V5Ym9hcmRSZWYuaW5zdGFuY2Uua2V5Q2xpY2suc3Vic2NyaWJlKChldmVudDogYW55KSA9PiB0aGlzLmtleUNsaWNrLm5leHQoZXZlbnQpKTtcclxuICAgIHRoaXMuX2tleWJvYXJkUmVmLmluc3RhbmNlLmJrc3BDbGljay5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHRoaXMuYmtzcENsaWNrLm5leHQoZXZlbnQpKVxyXG4gICAgdGhpcy5fa2V5Ym9hcmRSZWYuaW5zdGFuY2UuZW50ZXJDbGljay5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHRoaXMuZW50ZXJDbGljay5uZXh0KDxhbnk+dGhpcy5fa2V5Ym9hcmRSZWYpKTtcclxuICAgIHRoaXMuX2tleWJvYXJkUmVmLmluc3RhbmNlLmNhcHNDbGljay5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHRoaXMuY2Fwc0NsaWNrLm5leHQoZXZlbnQpKTtcclxuICAgIHRoaXMuX2tleWJvYXJkUmVmLmluc3RhbmNlLmFsdENsaWNrLnN1YnNjcmliZSgoKSA9PiB0aGlzLmFsdENsaWNrLm5leHQoKSk7XHJcbiAgICB0aGlzLl9rZXlib2FyZFJlZi5pbnN0YW5jZS5zaGlmdENsaWNrLnN1YnNjcmliZSgoZXZlbnQ6IGFueSkgPT4gdGhpcy5zaGlmdENsaWNrLm5leHQoZXZlbnQpKTtcclxuICAgIHRoaXMuX2tleWJvYXJkUmVmLmluc3RhbmNlLnNwYWNlQ2xpY2suc3Vic2NyaWJlKChldmVudDogYW55KSA9PiB0aGlzLnNwYWNlQ2xpY2submV4dChldmVudCkpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignYmx1cicsIFsnJGV2ZW50J10pXHJcbiAgcHVibGljIGhpZGVLZXlib2FyZCgpIHtcclxuICAgIGlmICh0aGlzLl9rZXlib2FyZFJlZikge1xyXG4gICAgICB0aGlzLl9rZXlib2FyZFJlZi5kaXNtaXNzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=