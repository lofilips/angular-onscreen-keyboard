import { Subject } from 'rxjs';
/**
 * Reference to a keyboard dispatched from the keyboard service.
 */
export class MatKeyboardRef {
    constructor(instance, containerInstance, _overlayRef) {
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the keyboard has closed. */
        this._afterClosed = new Subject();
        /** Subject for notifying the user that the keyboard has opened and appeared. */
        this._afterOpened = new Subject();
        // Sets the readonly instance of the keyboard content component.
        this.instance = instance;
        this.containerInstance = containerInstance;
        // Finish dismiss on exitting
        containerInstance.onExit.subscribe(() => this._finishDismiss());
    }
    /** Dismisses the keyboard. */
    dismiss() {
        if (!this._afterClosed.closed) {
            this.containerInstance.exit();
        }
    }
    /** Marks the keyboard as opened */
    _open() {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    }
    /** Gets an observable that is notified when the keyboard is finished closing. */
    afterDismissed() {
        return this._afterClosed.asObservable();
    }
    /** Gets an observable that is notified when the keyboard has opened and appeared. */
    afterOpened() {
        return this.containerInstance.onEnter;
    }
    /** Cleans up the DOM after closing. */
    _finishDismiss() {
        this._overlayRef.dispose();
        this._afterClosed.next();
        this._afterClosed.complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQtcmVmLmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbImNsYXNzZXMva2V5Ym9hcmQtcmVmLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFJM0M7O0dBRUc7QUFDSCxNQUFNLE9BQU8sY0FBYztJQWN6QixZQUFZLFFBQThCLEVBQ3hDLGlCQUFnRCxFQUN4QyxXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQWRqQyxtRUFBbUU7UUFDM0QsaUJBQVksR0FBaUIsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUVuRCxnRkFBZ0Y7UUFDeEUsaUJBQVksR0FBaUIsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQVdqRCxnRUFBZ0U7UUFDaEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBRTNDLDZCQUE2QjtRQUM3QixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCw4QkFBOEI7SUFDOUIsT0FBTztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtZQUM3QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLEtBQUs7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVELGlGQUFpRjtJQUNqRixjQUFjO1FBQ1osT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCxxRkFBcUY7SUFDckYsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztJQUN4QyxDQUFDO0lBRUQsdUNBQXVDO0lBQy9CLGNBQWM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDL0IsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMva2V5Ym9hcmQtY29udGFpbmVyL2tleWJvYXJkLWNvbnRhaW5lci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZENvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMva2V5Ym9hcmQva2V5Ym9hcmQuY29tcG9uZW50JztcclxuXHJcbi8qKlxyXG4gKiBSZWZlcmVuY2UgdG8gYSBrZXlib2FyZCBkaXNwYXRjaGVkIGZyb20gdGhlIGtleWJvYXJkIHNlcnZpY2UuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWF0S2V5Ym9hcmRSZWY8VD4ge1xyXG5cclxuICAvKiogU3ViamVjdCBmb3Igbm90aWZ5aW5nIHRoZSB1c2VyIHRoYXQgdGhlIGtleWJvYXJkIGhhcyBjbG9zZWQuICovXHJcbiAgcHJpdmF0ZSBfYWZ0ZXJDbG9zZWQ6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XHJcblxyXG4gIC8qKiBTdWJqZWN0IGZvciBub3RpZnlpbmcgdGhlIHVzZXIgdGhhdCB0aGUga2V5Ym9hcmQgaGFzIG9wZW5lZCBhbmQgYXBwZWFyZWQuICovXHJcbiAgcHJpdmF0ZSBfYWZ0ZXJPcGVuZWQ6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XHJcblxyXG4gIC8qKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBtYWtpbmcgdXAgdGhlIGNvbnRlbnQgb2YgdGhlIGtleWJvYXJkLiAqL1xyXG4gIGluc3RhbmNlOiBNYXRLZXlib2FyZENvbXBvbmVudDtcclxuXHJcbiAgLyoqIFRoZSBpbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50IG1ha2luZyB1cCB0aGUgY29udGVudCBvZiB0aGUga2V5Ym9hcmQuICovXHJcbiAgY29udGFpbmVySW5zdGFuY2U6IE1hdEtleWJvYXJkQ29udGFpbmVyQ29tcG9uZW50O1xyXG5cclxuICBjb25zdHJ1Y3RvcihpbnN0YW5jZTogTWF0S2V5Ym9hcmRDb21wb25lbnQsXHJcbiAgICBjb250YWluZXJJbnN0YW5jZTogTWF0S2V5Ym9hcmRDb250YWluZXJDb21wb25lbnQsXHJcbiAgICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmKSB7XHJcbiAgICAvLyBTZXRzIHRoZSByZWFkb25seSBpbnN0YW5jZSBvZiB0aGUga2V5Ym9hcmQgY29udGVudCBjb21wb25lbnQuXHJcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2U7XHJcbiAgICB0aGlzLmNvbnRhaW5lckluc3RhbmNlID0gY29udGFpbmVySW5zdGFuY2U7XHJcblxyXG4gICAgLy8gRmluaXNoIGRpc21pc3Mgb24gZXhpdHRpbmdcclxuICAgIGNvbnRhaW5lckluc3RhbmNlLm9uRXhpdC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZmluaXNoRGlzbWlzcygpKTtcclxuICB9XHJcblxyXG4gIC8qKiBEaXNtaXNzZXMgdGhlIGtleWJvYXJkLiAqL1xyXG4gIGRpc21pc3MoKSB7XHJcbiAgICBpZiAoIXRoaXMuX2FmdGVyQ2xvc2VkLmNsb3NlZCkge1xyXG4gICAgICB0aGlzLmNvbnRhaW5lckluc3RhbmNlLmV4aXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBNYXJrcyB0aGUga2V5Ym9hcmQgYXMgb3BlbmVkICovXHJcbiAgX29wZW4oKSB7XHJcbiAgICBpZiAoIXRoaXMuX2FmdGVyT3BlbmVkLmNsb3NlZCkge1xyXG4gICAgICB0aGlzLl9hZnRlck9wZW5lZC5uZXh0KCk7XHJcbiAgICAgIHRoaXMuX2FmdGVyT3BlbmVkLmNvbXBsZXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUga2V5Ym9hcmQgaXMgZmluaXNoZWQgY2xvc2luZy4gKi9cclxuICBhZnRlckRpc21pc3NlZCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLl9hZnRlckNsb3NlZC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBHZXRzIGFuIG9ic2VydmFibGUgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBrZXlib2FyZCBoYXMgb3BlbmVkIGFuZCBhcHBlYXJlZC4gKi9cclxuICBhZnRlck9wZW5lZCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcclxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lckluc3RhbmNlLm9uRW50ZXI7XHJcbiAgfVxyXG5cclxuICAvKiogQ2xlYW5zIHVwIHRoZSBET00gYWZ0ZXIgY2xvc2luZy4gKi9cclxuICBwcml2YXRlIF9maW5pc2hEaXNtaXNzKCkge1xyXG4gICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XHJcblxyXG4gICAgdGhpcy5fYWZ0ZXJDbG9zZWQubmV4dCgpO1xyXG4gICAgdGhpcy5fYWZ0ZXJDbG9zZWQuY29tcGxldGUoKTtcclxuICB9XHJcbn1cclxuIl19