import { Subject } from 'rxjs';
/**
 * Reference to a keyboard dispatched from the keyboard service.
 */
var MatKeyboardRef = /** @class */ (function () {
    function MatKeyboardRef(instance, containerInstance, _overlayRef) {
        var _this = this;
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the keyboard has closed. */
        this._afterClosed = new Subject();
        /** Subject for notifying the user that the keyboard has opened and appeared. */
        this._afterOpened = new Subject();
        // Sets the readonly instance of the keyboard content component.
        this.instance = instance;
        this.containerInstance = containerInstance;
        // Finish dismiss on exitting
        containerInstance.onExit.subscribe(function () { return _this._finishDismiss(); });
    }
    /** Dismisses the keyboard. */
    MatKeyboardRef.prototype.dismiss = function () {
        if (!this._afterClosed.closed) {
            this.containerInstance.exit();
        }
    };
    /** Marks the keyboard as opened */
    MatKeyboardRef.prototype._open = function () {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    };
    /** Gets an observable that is notified when the keyboard is finished closing. */
    MatKeyboardRef.prototype.afterDismissed = function () {
        return this._afterClosed.asObservable();
    };
    /** Gets an observable that is notified when the keyboard has opened and appeared. */
    MatKeyboardRef.prototype.afterOpened = function () {
        return this.containerInstance.onEnter;
    };
    /** Cleans up the DOM after closing. */
    MatKeyboardRef.prototype._finishDismiss = function () {
        this._overlayRef.dispose();
        this._afterClosed.next();
        this._afterClosed.complete();
    };
    return MatKeyboardRef;
}());
export { MatKeyboardRef };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQtcmVmLmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbImNsYXNzZXMva2V5Ym9hcmQtcmVmLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFJM0M7O0dBRUc7QUFDSDtJQWNFLHdCQUFZLFFBQThCLEVBQ3hDLGlCQUFnRCxFQUN4QyxXQUF1QjtRQUZqQyxpQkFTQztRQVBTLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBZGpDLG1FQUFtRTtRQUMzRCxpQkFBWSxHQUFpQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBRW5ELGdGQUFnRjtRQUN4RSxpQkFBWSxHQUFpQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBV2pELGdFQUFnRTtRQUNoRSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFFM0MsNkJBQTZCO1FBQzdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxjQUFjLEVBQUUsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCw4QkFBOEI7SUFDOUIsZ0NBQU8sR0FBUDtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtZQUM3QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLDhCQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVELGlGQUFpRjtJQUNqRix1Q0FBYyxHQUFkO1FBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCxxRkFBcUY7SUFDckYsb0NBQVcsR0FBWDtRQUNFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztJQUN4QyxDQUFDO0lBRUQsdUNBQXVDO0lBQy9CLHVDQUFjLEdBQXRCO1FBQ0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQXpERCxJQXlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2tleWJvYXJkLWNvbnRhaW5lci9rZXlib2FyZC1jb250YWluZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2tleWJvYXJkL2tleWJvYXJkLmNvbXBvbmVudCc7XHJcblxyXG4vKipcclxuICogUmVmZXJlbmNlIHRvIGEga2V5Ym9hcmQgZGlzcGF0Y2hlZCBmcm9tIHRoZSBrZXlib2FyZCBzZXJ2aWNlLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkUmVmPFQ+IHtcclxuXHJcbiAgLyoqIFN1YmplY3QgZm9yIG5vdGlmeWluZyB0aGUgdXNlciB0aGF0IHRoZSBrZXlib2FyZCBoYXMgY2xvc2VkLiAqL1xyXG4gIHByaXZhdGUgX2FmdGVyQ2xvc2VkOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xyXG5cclxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGtleWJvYXJkIGhhcyBvcGVuZWQgYW5kIGFwcGVhcmVkLiAqL1xyXG4gIHByaXZhdGUgX2FmdGVyT3BlbmVkOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xyXG5cclxuICAvKiogVGhlIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgbWFraW5nIHVwIHRoZSBjb250ZW50IG9mIHRoZSBrZXlib2FyZC4gKi9cclxuICBpbnN0YW5jZTogTWF0S2V5Ym9hcmRDb21wb25lbnQ7XHJcblxyXG4gIC8qKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBtYWtpbmcgdXAgdGhlIGNvbnRlbnQgb2YgdGhlIGtleWJvYXJkLiAqL1xyXG4gIGNvbnRhaW5lckluc3RhbmNlOiBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudDtcclxuXHJcbiAgY29uc3RydWN0b3IoaW5zdGFuY2U6IE1hdEtleWJvYXJkQ29tcG9uZW50LFxyXG4gICAgY29udGFpbmVySW5zdGFuY2U6IE1hdEtleWJvYXJkQ29udGFpbmVyQ29tcG9uZW50LFxyXG4gICAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZikge1xyXG4gICAgLy8gU2V0cyB0aGUgcmVhZG9ubHkgaW5zdGFuY2Ugb2YgdGhlIGtleWJvYXJkIGNvbnRlbnQgY29tcG9uZW50LlxyXG4gICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG4gICAgdGhpcy5jb250YWluZXJJbnN0YW5jZSA9IGNvbnRhaW5lckluc3RhbmNlO1xyXG5cclxuICAgIC8vIEZpbmlzaCBkaXNtaXNzIG9uIGV4aXR0aW5nXHJcbiAgICBjb250YWluZXJJbnN0YW5jZS5vbkV4aXQuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2ZpbmlzaERpc21pc3MoKSk7XHJcbiAgfVxyXG5cclxuICAvKiogRGlzbWlzc2VzIHRoZSBrZXlib2FyZC4gKi9cclxuICBkaXNtaXNzKCkge1xyXG4gICAgaWYgKCF0aGlzLl9hZnRlckNsb3NlZC5jbG9zZWQpIHtcclxuICAgICAgdGhpcy5jb250YWluZXJJbnN0YW5jZS5leGl0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogTWFya3MgdGhlIGtleWJvYXJkIGFzIG9wZW5lZCAqL1xyXG4gIF9vcGVuKCkge1xyXG4gICAgaWYgKCF0aGlzLl9hZnRlck9wZW5lZC5jbG9zZWQpIHtcclxuICAgICAgdGhpcy5fYWZ0ZXJPcGVuZWQubmV4dCgpO1xyXG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5jb21wbGV0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIGtleWJvYXJkIGlzIGZpbmlzaGVkIGNsb3NpbmcuICovXHJcbiAgYWZ0ZXJEaXNtaXNzZWQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5fYWZ0ZXJDbG9zZWQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUga2V5Ym9hcmQgaGFzIG9wZW5lZCBhbmQgYXBwZWFyZWQuICovXHJcbiAgYWZ0ZXJPcGVuZWQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXJJbnN0YW5jZS5vbkVudGVyO1xyXG4gIH1cclxuXHJcbiAgLyoqIENsZWFucyB1cCB0aGUgRE9NIGFmdGVyIGNsb3NpbmcuICovXHJcbiAgcHJpdmF0ZSBfZmluaXNoRGlzbWlzcygpIHtcclxuICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xyXG5cclxuICAgIHRoaXMuX2FmdGVyQ2xvc2VkLm5leHQoKTtcclxuICAgIHRoaXMuX2FmdGVyQ2xvc2VkLmNvbXBsZXRlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==