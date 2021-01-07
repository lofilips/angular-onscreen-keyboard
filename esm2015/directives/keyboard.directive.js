import { __decorate, __param } from "tslib";
import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatKeyboardService } from '../services/keyboard.service';
let MatKeyboardDirective = class MatKeyboardDirective {
    constructor(_elementRef, _keyboardService, _control) {
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
    ngOnDestroy() {
        this.hideKeyboard();
    }
    showKeyboard() {
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
        this._keyboardRef.instance.keyClick.subscribe((event) => this.keyClick.next(event));
        this._keyboardRef.instance.bkspClick.subscribe((event) => this.bkspClick.next(event));
        this._keyboardRef.instance.enterClick.subscribe((event) => this.enterClick.next(this._keyboardRef));
        this._keyboardRef.instance.capsClick.subscribe((event) => this.capsClick.next(event));
        this._keyboardRef.instance.altClick.subscribe(() => this.altClick.next());
        this._keyboardRef.instance.shiftClick.subscribe((event) => this.shiftClick.next(event));
        this._keyboardRef.instance.spaceClick.subscribe((event) => this.spaceClick.next(event));
    }
    hideKeyboard() {
        if (this._keyboardRef) {
            this._keyboardRef.dismiss();
        }
    }
};
MatKeyboardDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: MatKeyboardService },
    { type: NgControl, decorators: [{ type: Optional }, { type: Self }] }
];
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
export { MatKeyboardDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMva2V5Ym9hcmQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSTNDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBS2xFLElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0lBaUIvQixZQUFvQixXQUF1QixFQUN2QixnQkFBb0MsRUFDaEIsUUFBb0I7UUFGeEMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFvQjtRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBVmxELGFBQVEsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUN4RCxjQUFTLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFDekQsZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBQzFELGNBQVMsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUN6RCxhQUFRLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFDeEQsZUFBVSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBQzFELGVBQVUsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztJQUlMLENBQUM7SUFFaEUsV0FBVztRQUNULElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBR00sWUFBWTtRQUNqQixJQUFJLENBQUMsWUFBWSxHQUFH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QUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7d0RBd0JqQztBQUdEO0lBREMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dEQUtoQztBQXhEVSxvQkFBb0I7SUFIaEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLDJDQUEyQztLQUN0RCxDQUFDO0lBb0JhLFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLElBQUksRUFBRSxDQUFBO0dBbkJwQixvQkFBb0IsQ0EwRGhDO1NBMURZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBPdXRwdXQsIFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRSZWYgfSBmcm9tICcuLi9jbGFzc2VzL2tleWJvYXJkLXJlZi5jbGFzcyc7XHJcbmltcG9ydCB7IE1hdEtleWJvYXJkQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9rZXlib2FyZC9rZXlib2FyZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9rZXlib2FyZC5zZXJ2aWNlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnaW5wdXRbbWF0S2V5Ym9hcmRdLCB0ZXh0YXJlYVttYXRLZXlib2FyZF0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXRLZXlib2FyZERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XHJcblxyXG4gIHByaXZhdGUgX2tleWJvYXJkUmVmOiBNYXRLZXlib2FyZFJlZjxNYXRLZXlib2FyZENvbXBvbmVudD47XHJcblxyXG4gIEBJbnB1dCgpIG1hdEtleWJvYXJkOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgZGFya1RoZW1lOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGR1cmF0aW9uOiBudW1iZXI7XHJcbiAgQElucHV0KCkgaXNEZWJ1ZzogYm9vbGVhbjtcclxuXHJcbiAgQE91dHB1dCgpIGtleUNsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgQE91dHB1dCgpIGJrc3BDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG4gIEBPdXRwdXQoKSBlbnRlckNsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgQE91dHB1dCgpIGNhcHNDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG4gIEBPdXRwdXQoKSBhbHRDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG4gIEBPdXRwdXQoKSBzaGlmdENsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgQE91dHB1dCgpIHNwYWNlQ2xpY2s6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICAgICAgICBwcml2YXRlIF9rZXlib2FyZFNlcnZpY2U6IE1hdEtleWJvYXJkU2VydmljZSxcclxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHByaXZhdGUgX2NvbnRyb2w/OiBOZ0NvbnRyb2wpIHt9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy5oaWRlS2V5Ym9hcmQoKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJywgWyckZXZlbnQnXSlcclxuICBwdWJsaWMgc2hvd0tleWJvYXJkKCkge1xyXG4gICAgdGhpcy5fa2V5Ym9hcmRSZWYgPSB0aGlzLl9rZXlib2FyZFNlcnZpY2Uub3Blbih0aGlzLm1hdEtleWJvYXJkLCB7XHJcbiAgICAgIGRhcmtUaGVtZTogdGhpcy5kYXJrVGhlbWUsXHJcbiAgICAgIGR1cmF0aW9uOiB0aGlzLmR1cmF0aW9uLFxyXG4gICAgICBpc0RlYnVnOiB0aGlzLmlzRGVidWdcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHJlZmVyZW5jZSB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgdGhpcy5fa2V5Ym9hcmRSZWYuaW5zdGFuY2Uuc2V0SW5wdXRJbnN0YW5jZSh0aGlzLl9lbGVtZW50UmVmKTtcclxuXHJcbiAgICAvLyBzZXQgY29udHJvbCBpZiBnaXZlbiwgY2FzdCB0byBzbXRoLiBub24tYWJzdHJhY3RcclxuICAgIGlmICh0aGlzLl9jb250cm9sKSB7XHJcbiAgICAgIHRoaXMuX2tleWJvYXJkUmVmLmluc3RhbmNlLmF0dGFjaENvbnRyb2wodGhpcy5fY29udHJvbC5jb250cm9sKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25uZWN0IG91dHB1dHNcclxuICAgIHRoaXMuX2tleWJvYXJkUmVmLmluc3RhbmNlLmtleUNsaWNrLnN1YnNjcmliZSgoZXZlbnQ6IGFueSkgPT4gdGhpcy5rZXlDbGljay5uZXh0KGV2ZW50KSk7XHJcbiAgICB0aGlzLl9rZXlib2FyZFJlZi5pbnN0YW5jZS5ia3NwQ2xpY2suc3Vic2NyaWJlKChldmVudDogYW55KSA9PiB0aGlzLmJrc3BDbGljay5uZXh0KGV2ZW50KSlcclxuICAgIHRoaXMuX2tleWJvYXJkUmVmLmluc3RhbmNlLmVudGVyQ2xpY2suc3Vic2NyaWJlKChldmVudDogYW55KSA9PiB0aGlzLmVudGVyQ2xpY2submV4dCg8YW55PnRoaXMuX2tleWJvYXJkUmVmKSk7XHJcbiAgICB0aGlzLl9rZXlib2FyZFJlZi5pbnN0YW5jZS5jYXBzQ2xpY2suc3Vic2NyaWJlKChldmVudDogYW55KSA9PiB0aGlzLmNhcHNDbGljay5uZXh0KGV2ZW50KSk7XHJcbiAgICB0aGlzLl9rZXlib2FyZFJlZi5pbnN0YW5jZS5hbHRDbGljay5zdWJzY3JpYmUoKCkgPT4gdGhpcy5hbHRDbGljay5uZXh0KCkpO1xyXG4gICAgdGhpcy5fa2V5Ym9hcmRSZWYuaW5zdGFuY2Uuc2hpZnRDbGljay5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHRoaXMuc2hpZnRDbGljay5uZXh0KGV2ZW50KSk7XHJcbiAgICB0aGlzLl9rZXlib2FyZFJlZi5pbnN0YW5jZS5zcGFjZUNsaWNrLnN1YnNjcmliZSgoZXZlbnQ6IGFueSkgPT4gdGhpcy5zcGFjZUNsaWNrLm5leHQoZXZlbnQpKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInLCBbJyRldmVudCddKVxyXG4gIHB1YmxpYyBoaWRlS2V5Ym9hcmQoKSB7XHJcbiAgICBpZiAodGhpcy5fa2V5Ym9hcmRSZWYpIHtcclxuICAgICAgdGhpcy5fa2V5Ym9hcmRSZWYuZGlzbWlzcygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19