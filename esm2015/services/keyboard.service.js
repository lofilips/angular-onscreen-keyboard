import { __decorate, __param } from "tslib";
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Inject, Injectable, LOCALE_ID, Optional, SkipSelf } from '@angular/core';
import { MatKeyboardRef } from '../classes/keyboard-ref.class';
import { MatKeyboardContainerComponent } from '../components/keyboard-container/keyboard-container.component';
import { MatKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MAT_KEYBOARD_LAYOUTS } from '../configs/keyboard-layouts.config';
import { _applyAvailableLayouts, _applyConfigDefaults } from '../utils/keyboard.utils';
/**
 * Service to dispatch Material Design keyboard.
 */
let MatKeyboardService = class MatKeyboardService {
    constructor(_overlay, _live, _defaultLocale, _layouts, _parentKeyboard) {
        this._overlay = _overlay;
        this._live = _live;
        this._defaultLocale = _defaultLocale;
        this._layouts = _layouts;
        this._parentKeyboard = _parentKeyboard;
        /**
         * Reference to the current keyboard in the view *at this level* (in the Angular injector tree).
         * If there is a parent keyboard service, all operations should delegate to that parent
         * via `_openedKeyboardRef`.
         */
        this._keyboardRefAtThisLevel = null;
        this._availableLocales = {};
        // prepare available layouts mapping
        this._availableLocales = _applyAvailableLayouts(_layouts);
    }
    /** Reference to the currently opened keyboard at *any* level. */
    get _openedKeyboardRef() {
        const parent = this._parentKeyboard;
        return parent ? parent._openedKeyboardRef : this._keyboardRefAtThisLevel;
    }
    set _openedKeyboardRef(value) {
        if (this._parentKeyboard) {
            this._parentKeyboard._openedKeyboardRef = value;
        }
        else {
            this._keyboardRefAtThisLevel = value;
        }
    }
    get availableLocales() {
        return this._availableLocales;
    }
    get isOpened() {
        return !!this._openedKeyboardRef;
    }
    /**
     * Creates and dispatches a keyboard with a custom component for the content, removing any
     * currently opened keyboards.
     *
     * @param layoutOrLocale layout or locale to use.
     * @param config Extra configuration for the keyboard.
     */
    openFromComponent(layoutOrLocale, config) {
        const keyboardRef = this._attachKeyboardContent(config);
        keyboardRef.instance.darkTheme = config.darkTheme;
        keyboardRef.instance.isDebug = config.isDebug;
        // a locale is provided
        if (this.availableLocales[layoutOrLocale]) {
            keyboardRef.instance.locale = layoutOrLocale;
            keyboardRef.instance.layout = this.getLayoutForLocale(layoutOrLocale);
        }
        // a layout name is provided
        if (this._layouts[layoutOrLocale]) {
            keyboardRef.instance.layout = this._layouts[layoutOrLocale];
            keyboardRef.instance.locale = this._layouts[layoutOrLocale].lang && this._layouts[layoutOrLocale].lang.pop();
        }
        if (config.customIcons) {
            keyboardRef.instance.icons = config.customIcons;
        }
        // When the keyboard is dismissed, lower the keyboard counter.
        keyboardRef
            .afterDismissed()
            .subscribe(() => {
            // Clear the keyboard ref if it hasn't already been replaced by a newer keyboard.
            if (this._openedKeyboardRef === keyboardRef) {
                this._openedKeyboardRef = null;
            }
        });
        if (this._openedKeyboardRef) {
            // If a keyboard is already in view, dismiss it and enter the
            // new keyboard after exit animation is complete.
            this._openedKeyboardRef
                .afterDismissed()
                .subscribe(() => {
                keyboardRef.containerInstance.enter();
            });
            this._openedKeyboardRef.dismiss();
        }
        else {
            // If no keyboard is in view, enter the new keyboard.
            keyboardRef.containerInstance.enter();
        }
        // If a dismiss timeout is provided, set up dismiss based on after the keyboard is opened.
        // if (configs.duration > 0) {
        //   keyboardRef.afterOpened().subscribe(() => {
        //     setTimeout(() => keyboardRef.dismiss(), configs.duration);
        //   });
        // }
        if (config.announcementMessage) {
            this._live.announce(config.announcementMessage, config.politeness);
        }
        this._openedKeyboardRef = keyboardRef;
        return this._openedKeyboardRef;
    }
    /**
     * Opens a keyboard with a message and an optional action.
     * @param layoutOrLocale A string representing the locale or the layout name to be used.
     * @param config Additional configuration options for the keyboard.
     */
    open(layoutOrLocale = this._defaultLocale, config = {}) {
        const _config = _applyConfigDefaults(config);
        return this.openFromComponent(layoutOrLocale, _config);
    }
    /**
     * Dismisses the currently-visible keyboard.
     */
    dismiss() {
        if (this._openedKeyboardRef) {
            this._openedKeyboardRef.dismiss();
        }
    }
    /**
     * Map a given locale to a layout name.
     * @param locale The layout name
     */
    mapLocale(locale = this._defaultLocale) {
        let layout;
        const country = locale
            .split('-')
            .shift();
        // search for layout matching the
        // first part, the country code
        if (this.availableLocales[country]) {
            layout = this.availableLocales[locale];
        }
        // look if the detailed locale matches any layout
        if (this.availableLocales[locale]) {
            layout = this.availableLocales[locale];
        }
        if (!layout) {
            throw Error(`No layout found for locale ${locale}`);
        }
        return layout;
    }
    getLayoutForLocale(locale) {
        return this._layouts[this.mapLocale(locale)];
    }
    /**
     * Attaches the keyboard container component to the overlay.
     */
    _attachKeyboardContainer(overlayRef, config) {
        const containerPortal = new ComponentPortal(MatKeyboardContainerComponent, config.viewContainerRef);
        const containerRef = overlayRef.attach(containerPortal);
        // set config
        containerRef.instance.keyboardConfig = config;
        return containerRef.instance;
    }
    /**
     * Places a new component as the content of the keyboard container.
     */
    _attachKeyboardContent(config) {
        const overlayRef = this._createOverlay();
        const container = this._attachKeyboardContainer(overlayRef, config);
        const portal = new ComponentPortal(MatKeyboardComponent);
        const contentRef = container.attachComponentPortal(portal);
        return new MatKeyboardRef(contentRef.instance, container, overlayRef);
    }
    /**
     * Creates a new overlay and places it in the correct location.
     */
    _createOverlay() {
        const state = new OverlayConfig({
            width: '100%'
        });
        state.positionStrategy = this._overlay
            .position()
            .global()
            .centerHorizontally()
            .bottom('0');
        return this._overlay.create(state);
    }
};
MatKeyboardService.ctorParameters = () => [
    { type: Overlay },
    { type: LiveAnnouncer },
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_KEYBOARD_LAYOUTS,] }] },
    { type: MatKeyboardService, decorators: [{ type: Optional }, { type: SkipSelf }] }
];
MatKeyboardService = __decorate([
    Injectable(),
    __param(2, Inject(LOCALE_ID)),
    __param(3, Inject(MAT_KEYBOARD_LAYOUTS)),
    __param(4, Optional()), __param(4, SkipSelf())
], MatKeyboardService);
export { MatKeyboardService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItb25zY3JlZW4tbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9rZXlib2FyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBZ0IsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVoRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDL0QsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDOUcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDakYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFLMUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFdkY7O0dBRUc7QUFFSCxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQWdDN0IsWUFBb0IsUUFBaUIsRUFDakIsS0FBb0IsRUFDRCxjQUFzQixFQUNYLFFBQTBCLEVBQ2hDLGVBQW1DO1FBSjNELGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUNELG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQ1gsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDaEMsb0JBQWUsR0FBZixlQUFlLENBQW9CO1FBbkMvRTs7OztXQUlHO1FBQ0ssNEJBQXVC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QVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUF5QyxDQUFDO0lBQ2hILENBQUM7SUFFRDs7T0FFRztJQUNLLGNBQWM7UUFDcEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFhLENBQUM7WUFDOUIsS0FBSyxFQUFFLE1BQU07U0FDZCxDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVE7YUFDbkMsUUFBUSxFQUFFO2FBQ1YsTUFBTSxFQUFFO2FBQ1Isa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWYsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0YsQ0FBQTs7WUF6SytCLE9BQU87WUFDVixhQUFhO3lDQUMzQixNQUFNLFNBQUMsU0FBUzs0Q0FDaEIsTUFBTSxTQUFDLG9CQUFvQjtZQUNxQixrQkFBa0IsdUJBQWxFLFFBQVEsWUFBSSxRQUFROztBQXBDdEIsa0JBQWtCO0lBRDlCLFVBQVUsRUFBRTtJQW1DRSxXQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUNqQixXQUFBLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0lBQzVCLFdBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxXQUFBLFFBQVEsRUFBRSxDQUFBO0dBcEN4QixrQkFBa0IsQ0F5TTlCO1NBek1ZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExpdmVBbm5vdW5jZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XHJcbmltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlDb25maWcsIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XHJcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xyXG5pbXBvcnQgeyBDb21wb25lbnRSZWYsIEluamVjdCwgSW5qZWN0YWJsZSwgTE9DQUxFX0lELCBPcHRpb25hbCwgU2tpcFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IE1hdEtleWJvYXJkUmVmIH0gZnJvbSAnLi4vY2xhc3Nlcy9rZXlib2FyZC1yZWYuY2xhc3MnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMva2V5Ym9hcmQtY29udGFpbmVyL2tleWJvYXJkLWNvbnRhaW5lci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZENvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMva2V5Ym9hcmQva2V5Ym9hcmQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTUFUX0tFWUJPQVJEX0xBWU9VVFMgfSBmcm9tICcuLi9jb25maWdzL2tleWJvYXJkLWxheW91dHMuY29uZmlnJztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRDb25maWcgfSBmcm9tICcuLi9jb25maWdzL2tleWJvYXJkLmNvbmZpZyc7XHJcbmltcG9ydCB7IElLZXlib2FyZExheW91dCB9IGZyb20gJy4uL2ludGVyZmFjZXMva2V5Ym9hcmQtbGF5b3V0LmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElLZXlib2FyZExheW91dHMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2tleWJvYXJkLWxheW91dHMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgSUxvY2FsZU1hcCB9IGZyb20gJy4uL2ludGVyZmFjZXMvbG9jYWxlLW1hcC5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBfYXBwbHlBdmFpbGFibGVMYXlvdXRzLCBfYXBwbHlDb25maWdEZWZhdWx0cyB9IGZyb20gJy4uL3V0aWxzL2tleWJvYXJkLnV0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHRvIGRpc3BhdGNoIE1hdGVyaWFsIERlc2lnbiBrZXlib2FyZC5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkU2VydmljZSB7XHJcbiAgLyoqXHJcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IGtleWJvYXJkIGluIHRoZSB2aWV3ICphdCB0aGlzIGxldmVsKiAoaW4gdGhlIEFuZ3VsYXIgaW5qZWN0b3IgdHJlZSkuXHJcbiAgICogSWYgdGhlcmUgaXMgYSBwYXJlbnQga2V5Ym9hcmQgc2VydmljZSwgYWxsIG9wZXJhdGlvbnMgc2hvdWxkIGRlbGVnYXRlIHRvIHRoYXQgcGFyZW50XHJcbiAgICogdmlhIGBfb3BlbmVkS2V5Ym9hcmRSZWZgLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2tleWJvYXJkUmVmQXRUaGlzTGV2ZWw6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICBwcml2YXRlIF9hdmFpbGFibGVMb2NhbGVzOiBJTG9jYWxlTWFwID0ge307XHJcblxyXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQga2V5Ym9hcmQgYXQgKmFueSogbGV2ZWwuICovXHJcbiAgcHJpdmF0ZSBnZXQgX29wZW5lZEtleWJvYXJkUmVmKCk6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiB8IG51bGwge1xyXG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50S2V5Ym9hcmQ7XHJcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9vcGVuZWRLZXlib2FyZFJlZiA6IHRoaXMuX2tleWJvYXJkUmVmQXRUaGlzTGV2ZWw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldCBfb3BlbmVkS2V5Ym9hcmRSZWYodmFsdWU6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50Pikge1xyXG4gICAgaWYgKHRoaXMuX3BhcmVudEtleWJvYXJkKSB7XHJcbiAgICAgIHRoaXMuX3BhcmVudEtleWJvYXJkLl9vcGVuZWRLZXlib2FyZFJlZiA9IHZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fa2V5Ym9hcmRSZWZBdFRoaXNMZXZlbCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IGF2YWlsYWJsZUxvY2FsZXMoKTogSUxvY2FsZU1hcCB7XHJcbiAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlTG9jYWxlcztcclxuICB9XHJcblxyXG4gIGdldCBpc09wZW5lZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAhIXRoaXMuX29wZW5lZEtleWJvYXJkUmVmO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcclxuICAgICAgICAgICAgICBwcml2YXRlIF9saXZlOiBMaXZlQW5ub3VuY2VyLFxyXG4gICAgICAgICAgICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIF9kZWZhdWx0TG9jYWxlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfS0VZQk9BUkRfTEFZT1VUUykgcHJpdmF0ZSBfbGF5b3V0czogSUtleWJvYXJkTGF5b3V0cyxcclxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnRLZXlib2FyZDogTWF0S2V5Ym9hcmRTZXJ2aWNlKSB7XHJcbiAgICAvLyBwcmVwYXJlIGF2YWlsYWJsZSBsYXlvdXRzIG1hcHBpbmdcclxuICAgIHRoaXMuX2F2YWlsYWJsZUxvY2FsZXMgPSBfYXBwbHlBdmFpbGFibGVMYXlvdXRzKF9sYXlvdXRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW5kIGRpc3BhdGNoZXMgYSBrZXlib2FyZCB3aXRoIGEgY3VzdG9tIGNvbXBvbmVudCBmb3IgdGhlIGNvbnRlbnQsIHJlbW92aW5nIGFueVxyXG4gICAqIGN1cnJlbnRseSBvcGVuZWQga2V5Ym9hcmRzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGxheW91dE9yTG9jYWxlIGxheW91dCBvciBsb2NhbGUgdG8gdXNlLlxyXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgdGhlIGtleWJvYXJkLlxyXG4gICAqL1xyXG4gIG9wZW5Gcm9tQ29tcG9uZW50KGxheW91dE9yTG9jYWxlOiBzdHJpbmcsIGNvbmZpZzogTWF0S2V5Ym9hcmRDb25maWcpOiBNYXRLZXlib2FyZFJlZjxNYXRLZXlib2FyZENvbXBvbmVudD4ge1xyXG4gICAgY29uc3Qga2V5Ym9hcmRSZWY6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiA9IHRoaXMuX2F0dGFjaEtleWJvYXJkQ29udGVudChjb25maWcpO1xyXG5cclxuICAgIGtleWJvYXJkUmVmLmluc3RhbmNlLmRhcmtUaGVtZSA9IGNvbmZpZy5kYXJrVGhlbWU7XHJcbiAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5pc0RlYnVnID0gY29uZmlnLmlzRGVidWc7XHJcblxyXG4gICAgLy8gYSBsb2NhbGUgaXMgcHJvdmlkZWRcclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZUxvY2FsZXNbbGF5b3V0T3JMb2NhbGVdKSB7XHJcbiAgICAgIGtleWJvYXJkUmVmLmluc3RhbmNlLmxvY2FsZSA9IGxheW91dE9yTG9jYWxlO1xyXG4gICAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5sYXlvdXQgPSB0aGlzLmdldExheW91dEZvckxvY2FsZShsYXlvdXRPckxvY2FsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYSBsYXlvdXQgbmFtZSBpcyBwcm92aWRlZFxyXG4gICAgaWYgKHRoaXMuX2xheW91dHNbbGF5b3V0T3JMb2NhbGVdKSB7XHJcbiAgICAgIGtleWJvYXJkUmVmLmluc3RhbmNlLmxheW91dCA9IHRoaXMuX2xheW91dHNbbGF5b3V0T3JMb2NhbGVdO1xyXG4gICAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5sb2NhbGUgPSB0aGlzLl9sYXlvdXRzW2xheW91dE9yTG9jYWxlXS5sYW5nICYmIHRoaXMuX2xheW91dHNbbGF5b3V0T3JMb2NhbGVdLmxhbmcucG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbmZpZy5jdXN0b21JY29ucykge1xyXG4gICAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5pY29ucyA9IGNvbmZpZy5jdXN0b21JY29ucztcclxuICAgIH1cclxuXHJcbiAgICAvLyBXaGVuIHRoZSBrZXlib2FyZCBpcyBkaXNtaXNzZWQsIGxvd2VyIHRoZSBrZXlib2FyZCBjb3VudGVyLlxyXG4gICAga2V5Ym9hcmRSZWZcclxuICAgICAgLmFmdGVyRGlzbWlzc2VkKClcclxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgLy8gQ2xlYXIgdGhlIGtleWJvYXJkIHJlZiBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHJlcGxhY2VkIGJ5IGEgbmV3ZXIga2V5Ym9hcmQuXHJcbiAgICAgICAgaWYgKHRoaXMuX29wZW5lZEtleWJvYXJkUmVmID09PSBrZXlib2FyZFJlZikge1xyXG4gICAgICAgICAgdGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWYgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuX29wZW5lZEtleWJvYXJkUmVmKSB7XHJcbiAgICAgIC8vIElmIGEga2V5Ym9hcmQgaXMgYWxyZWFkeSBpbiB2aWV3LCBkaXNtaXNzIGl0IGFuZCBlbnRlciB0aGVcclxuICAgICAgLy8gbmV3IGtleWJvYXJkIGFmdGVyIGV4aXQgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxyXG4gICAgICB0aGlzLl9vcGVuZWRLZXlib2FyZFJlZlxyXG4gICAgICAgIC5hZnRlckRpc21pc3NlZCgpXHJcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICBrZXlib2FyZFJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB0aGlzLl9vcGVuZWRLZXlib2FyZFJlZi5kaXNtaXNzKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBJZiBubyBrZXlib2FyZCBpcyBpbiB2aWV3LCBlbnRlciB0aGUgbmV3IGtleWJvYXJkLlxyXG4gICAgICBrZXlib2FyZFJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGEgZGlzbWlzcyB0aW1lb3V0IGlzIHByb3ZpZGVkLCBzZXQgdXAgZGlzbWlzcyBiYXNlZCBvbiBhZnRlciB0aGUga2V5Ym9hcmQgaXMgb3BlbmVkLlxyXG4gICAgLy8gaWYgKGNvbmZpZ3MuZHVyYXRpb24gPiAwKSB7XHJcbiAgICAvLyAgIGtleWJvYXJkUmVmLmFmdGVyT3BlbmVkKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgIC8vICAgICBzZXRUaW1lb3V0KCgpID0+IGtleWJvYXJkUmVmLmRpc21pc3MoKSwgY29uZmlncy5kdXJhdGlvbik7XHJcbiAgICAvLyAgIH0pO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIGlmIChjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xyXG4gICAgICB0aGlzLl9saXZlLmFubm91bmNlKGNvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlLCBjb25maWcucG9saXRlbmVzcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWYgPSBrZXlib2FyZFJlZjtcclxuICAgIHJldHVybiB0aGlzLl9vcGVuZWRLZXlib2FyZFJlZjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9wZW5zIGEga2V5Ym9hcmQgd2l0aCBhIG1lc3NhZ2UgYW5kIGFuIG9wdGlvbmFsIGFjdGlvbi5cclxuICAgKiBAcGFyYW0gbGF5b3V0T3JMb2NhbGUgQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBsb2NhbGUgb3IgdGhlIGxheW91dCBuYW1lIHRvIGJlIHVzZWQuXHJcbiAgICogQHBhcmFtIGNvbmZpZyBBZGRpdGlvbmFsIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIGtleWJvYXJkLlxyXG4gICAqL1xyXG4gIG9wZW4obGF5b3V0T3JMb2NhbGU6IHN0cmluZyA9IHRoaXMuX2RlZmF1bHRMb2NhbGUsIGNvbmZpZzogTWF0S2V5Ym9hcmRDb25maWcgPSB7fSk6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiB7XHJcbiAgICBjb25zdCBfY29uZmlnID0gX2FwcGx5Q29uZmlnRGVmYXVsdHMoY29uZmlnKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcGVuRnJvbUNvbXBvbmVudChsYXlvdXRPckxvY2FsZSwgX2NvbmZpZyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseS12aXNpYmxlIGtleWJvYXJkLlxyXG4gICAqL1xyXG4gIGRpc21pc3MoKSB7XHJcbiAgICBpZiAodGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWYpIHtcclxuICAgICAgdGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWYuZGlzbWlzcygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFwIGEgZ2l2ZW4gbG9jYWxlIHRvIGEgbGF5b3V0IG5hbWUuXHJcbiAgICogQHBhcmFtIGxvY2FsZSBUaGUgbGF5b3V0IG5hbWVcclxuICAgKi9cclxuICBtYXBMb2NhbGUobG9jYWxlOiBzdHJpbmcgPSB0aGlzLl9kZWZhdWx0TG9jYWxlKTogc3RyaW5nIHtcclxuICAgIGxldCBsYXlvdXQ6IHN0cmluZztcclxuICAgIGNvbnN0IGNvdW50cnkgPSBsb2NhbGVcclxuICAgICAgLnNwbGl0KCctJylcclxuICAgICAgLnNoaWZ0KCk7XHJcblxyXG4gICAgLy8gc2VhcmNoIGZvciBsYXlvdXQgbWF0Y2hpbmcgdGhlXHJcbiAgICAvLyBmaXJzdCBwYXJ0LCB0aGUgY291bnRyeSBjb2RlXHJcbiAgICBpZiAodGhpcy5hdmFpbGFibGVMb2NhbGVzW2NvdW50cnldKSB7XHJcbiAgICAgIGxheW91dCA9IHRoaXMuYXZhaWxhYmxlTG9jYWxlc1tsb2NhbGVdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxvb2sgaWYgdGhlIGRldGFpbGVkIGxvY2FsZSBtYXRjaGVzIGFueSBsYXlvdXRcclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZUxvY2FsZXNbbG9jYWxlXSkge1xyXG4gICAgICBsYXlvdXQgPSB0aGlzLmF2YWlsYWJsZUxvY2FsZXNbbG9jYWxlXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWxheW91dCkge1xyXG4gICAgICB0aHJvdyBFcnJvcihgTm8gbGF5b3V0IGZvdW5kIGZvciBsb2NhbGUgJHtsb2NhbGV9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxheW91dDtcclxuICB9XHJcblxyXG4gIGdldExheW91dEZvckxvY2FsZShsb2NhbGU6IHN0cmluZyk6IElLZXlib2FyZExheW91dCB7XHJcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0c1t0aGlzLm1hcExvY2FsZShsb2NhbGUpXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF0dGFjaGVzIHRoZSBrZXlib2FyZCBjb250YWluZXIgY29tcG9uZW50IHRvIHRoZSBvdmVybGF5LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2F0dGFjaEtleWJvYXJkQ29udGFpbmVyKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsIGNvbmZpZzogTWF0S2V5Ym9hcmRDb25maWcpOiBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCB7XHJcbiAgICBjb25zdCBjb250YWluZXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKE1hdEtleWJvYXJkQ29udGFpbmVyQ29tcG9uZW50LCBjb25maWcudmlld0NvbnRhaW5lclJlZik7XHJcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudD4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xyXG5cclxuICAgIC8vIHNldCBjb25maWdcclxuICAgIGNvbnRhaW5lclJlZi5pbnN0YW5jZS5rZXlib2FyZENvbmZpZyA9IGNvbmZpZztcclxuXHJcbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGxhY2VzIGEgbmV3IGNvbXBvbmVudCBhcyB0aGUgY29udGVudCBvZiB0aGUga2V5Ym9hcmQgY29udGFpbmVyLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2F0dGFjaEtleWJvYXJkQ29udGVudChjb25maWc6IE1hdEtleWJvYXJkQ29uZmlnKTogTWF0S2V5Ym9hcmRSZWY8TWF0S2V5Ym9hcmRDb21wb25lbnQ+IHtcclxuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KCk7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9hdHRhY2hLZXlib2FyZENvbnRhaW5lcihvdmVybGF5UmVmLCBjb25maWcpO1xyXG4gICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChNYXRLZXlib2FyZENvbXBvbmVudCk7XHJcbiAgICBjb25zdCBjb250ZW50UmVmID0gY29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xyXG4gICAgcmV0dXJuIG5ldyBNYXRLZXlib2FyZFJlZihjb250ZW50UmVmLmluc3RhbmNlLCBjb250YWluZXIsIG92ZXJsYXlSZWYpIGFzIE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgb3ZlcmxheSBhbmQgcGxhY2VzIGl0IGluIHRoZSBjb3JyZWN0IGxvY2F0aW9uLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoKTogT3ZlcmxheVJlZiB7XHJcbiAgICBjb25zdCBzdGF0ZSA9IG5ldyBPdmVybGF5Q29uZmlnKHtcclxuICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3RhdGUucG9zaXRpb25TdHJhdGVneSA9IHRoaXMuX292ZXJsYXlcclxuICAgICAgLnBvc2l0aW9uKClcclxuICAgICAgLmdsb2JhbCgpXHJcbiAgICAgIC5jZW50ZXJIb3Jpem9udGFsbHkoKVxyXG4gICAgICAuYm90dG9tKCcwJyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKHN0YXRlKTtcclxuICB9XHJcbn1cclxuIl19