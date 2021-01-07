var MatKeyboardConfig = /** @class */ (function () {
    function MatKeyboardConfig() {
        /** The politeness level for the MatAriaLiveAnnouncer announcement. */
        this.politeness = 'assertive';
        /** Message to be announced by the MatAriaLiveAnnouncer */
        this.announcementMessage = '';
        /** The view container to place the overlay for the keyboard into. */
        this.viewContainerRef = null;
        /** The length of time in milliseconds to wait before automatically dismissing the keyboard after blur. */
        this.duration = 0;
        /** Enable a dark keyboard */
        this.darkTheme = null;
        /** Enable the debug view */
        this.isDebug = false;
        /** Custom icon overrides */
        this.customIcons = {};
    }
    return MatKeyboardConfig;
}());
export { MatKeyboardConfig };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuY29uZmlnLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbImNvbmZpZ3Mva2V5Ym9hcmQuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBO0lBQUE7UUFDRSxzRUFBc0U7UUFDdEUsZUFBVSxHQUF3QixXQUFXLENBQUM7UUFFOUMsMERBQTBEO1FBQzFELHdCQUFtQixHQUFJLEVBQUUsQ0FBQztRQUUxQixxRUFBcUU7UUFDckUscUJBQWdCLEdBQXNCLElBQUksQ0FBQztRQUUzQywwR0FBMEc7UUFDMUcsYUFBUSxHQUFJLENBQUMsQ0FBQztRQUVkLDZCQUE2QjtRQUM3QixjQUFTLEdBQUksSUFBSSxDQUFDO1FBRWxCLDRCQUE0QjtRQUM1QixZQUFPLEdBQUksS0FBSyxDQUFDO1FBS2pCLDRCQUE0QjtRQUM1QixnQkFBVyxHQUFvQixFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUFELHdCQUFDO0FBQUQsQ0FBQyxBQXhCRCxJQXdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFyaWFMaXZlUG9saXRlbmVzcyB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcclxuaW1wb3J0IHsgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IElLZXlib2FyZEljb25zIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9rZXlib2FyZC1pY29ucy5pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkQ29uZmlnIHtcclxuICAvKiogVGhlIHBvbGl0ZW5lc3MgbGV2ZWwgZm9yIHRoZSBNYXRBcmlhTGl2ZUFubm91bmNlciBhbm5vdW5jZW1lbnQuICovXHJcbiAgcG9saXRlbmVzcz86IEFyaWFMaXZlUG9saXRlbmVzcyA9ICdhc3NlcnRpdmUnO1xyXG5cclxuICAvKiogTWVzc2FnZSB0byBiZSBhbm5vdW5jZWQgYnkgdGhlIE1hdEFyaWFMaXZlQW5ub3VuY2VyICovXHJcbiAgYW5ub3VuY2VtZW50TWVzc2FnZT8gPSAnJztcclxuXHJcbiAgLyoqIFRoZSB2aWV3IGNvbnRhaW5lciB0byBwbGFjZSB0aGUgb3ZlcmxheSBmb3IgdGhlIGtleWJvYXJkIGludG8uICovXHJcbiAgdmlld0NvbnRhaW5lclJlZj86IFZpZXdDb250YWluZXJSZWYgPSBudWxsO1xyXG5cclxuICAvKiogVGhlIGxlbmd0aCBvZiB0aW1lIGluIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBhdXRvbWF0aWNhbGx5IGRpc21pc3NpbmcgdGhlIGtleWJvYXJkIGFmdGVyIGJsdXIuICovXHJcbiAgZHVyYXRpb24/ID0gMDtcclxuXHJcbiAgLyoqIEVuYWJsZSBhIGRhcmsga2V5Ym9hcmQgKi9cclxuICBkYXJrVGhlbWU/ID0gbnVsbDtcclxuXHJcbiAgLyoqIEVuYWJsZSB0aGUgZGVidWcgdmlldyAqL1xyXG4gIGlzRGVidWc/ID0gZmFsc2U7XHJcblxyXG4gIC8qKiBFbmFibGUgdGhlIGRlYnVnIHZpZXcgKi9cclxuICBuZ0NvbnRyb2w/OiBOZ0NvbnRyb2w7XHJcblxyXG4gIC8qKiBDdXN0b20gaWNvbiBvdmVycmlkZXMgKi9cclxuICBjdXN0b21JY29ucz86IElLZXlib2FyZEljb25zID0ge307XHJcbn1cclxuIl19