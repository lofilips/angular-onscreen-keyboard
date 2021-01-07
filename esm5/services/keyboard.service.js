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
var MatKeyboardService = /** @class */ (function () {
    function MatKeyboardService(_overlay, _live, _defaultLocale, _layouts, _parentKeyboard) {
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
    Object.defineProperty(MatKeyboardService.prototype, "_openedKeyboardRef", {
        /** Reference to the currently opened keyboard at *any* level. */
        get: function () {
            var parent = this._parentKeyboard;
            return parent ? parent._openedKeyboardRef : this._keyboardRefAtThisLevel;
        },
        set: function (value) {
            if (this._parentKeyboard) {
                this._parentKeyboard._openedKeyboardRef = value;
            }
            else {
                this._keyboardRefAtThisLevel = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardService.prototype, "availableLocales", {
        get: function () {
            return this._availableLocales;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatKeyboardService.prototype, "isOpened", {
        get: function () {
            return !!this._openedKeyboardRef;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and dispatches a keyboard with a custom component for the content, removing any
     * currently opened keyboards.
     *
     * @param layoutOrLocale layout or locale to use.
     * @param config Extra configuration for the keyboard.
     */
    MatKeyboardService.prototype.openFromComponent = function (layoutOrLocale, config) {
        var _this = this;
        var keyboardRef = this._attachKeyboardContent(config);
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
            .subscribe(function () {
            // Clear the keyboard ref if it hasn't already been replaced by a newer keyboard.
            if (_this._openedKeyboardRef === keyboardRef) {
                _this._openedKeyboardRef = null;
            }
        });
        if (this._openedKeyboardRef) {
            // If a keyboard is already in view, dismiss it and enter the
            // new keyboard after exit animation is complete.
            this._openedKeyboardRef
                .afterDismissed()
                .subscribe(function () {
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
    };
    /**
     * Opens a keyboard with a message and an optional action.
     * @param layoutOrLocale A string representing the locale or the layout name to be used.
     * @param config Additional configuration options for the keyboard.
     */
    MatKeyboardService.prototype.open = function (layoutOrLocale, config) {
        if (layoutOrLocale === void 0) { layoutOrLocale = this._defaultLocale; }
        if (config === void 0) { config = {}; }
        var _config = _applyConfigDefaults(config);
        return this.openFromComponent(layoutOrLocale, _config);
    };
    /**
     * Dismisses the currently-visible keyboard.
     */
    MatKeyboardService.prototype.dismiss = function () {
        if (this._openedKeyboardRef) {
            this._openedKeyboardRef.dismiss();
        }
    };
    /**
     * Map a given locale to a layout name.
     * @param locale The layout name
     */
    MatKeyboardService.prototype.mapLocale = function (locale) {
        if (locale === void 0) { locale = this._defaultLocale; }
        var layout;
        var country = locale
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
            throw Error("No layout found for locale " + locale);
        }
        return layout;
    };
    MatKeyboardService.prototype.getLayoutForLocale = function (locale) {
        return this._layouts[this.mapLocale(locale)];
    };
    /**
     * Attaches the keyboard container component to the overlay.
     */
    MatKeyboardService.prototype._attachKeyboardContainer = function (overlayRef, config) {
        var containerPortal = new ComponentPortal(MatKeyboardContainerComponent, config.viewContainerRef);
        var containerRef = overlayRef.attach(containerPortal);
        // set config
        containerRef.instance.keyboardConfig = config;
        return containerRef.instance;
    };
    /**
     * Places a new component as the content of the keyboard container.
     */
    MatKeyboardService.prototype._attachKeyboardContent = function (config) {
        var overlayRef = this._createOverlay();
        var container = this._attachKeyboardContainer(overlayRef, config);
        var portal = new ComponentPortal(MatKeyboardComponent);
        var contentRef = container.attachComponentPortal(portal);
        return new MatKeyboardRef(contentRef.instance, container, overlayRef);
    };
    /**
     * Creates a new overlay and places it in the correct location.
     */
    MatKeyboardService.prototype._createOverlay = function () {
        var state = new OverlayConfig({
            width: '100%'
        });
        state.positionStrategy = this._overlay
            .position()
            .global()
            .centerHorizontally()
            .bottom('0');
        return this._overlay.create(state);
    };
    MatKeyboardService.ctorParameters = function () { return [
        { type: Overlay },
        { type: LiveAnnouncer },
        { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_KEYBOARD_LAYOUTS,] }] },
        { type: MatKeyboardService, decorators: [{ type: Optional }, { type: SkipSelf }] }
    ]; };
    MatKeyboardService = __decorate([
        Injectable(),
        __param(2, Inject(LOCALE_ID)),
        __param(3, Inject(MAT_KEYBOARD_LAYOUTS)),
        __param(4, Optional()), __param(4, SkipSelf())
    ], MatKeyboardService);
    return MatKeyboardService;
}());
export { MatKeyboardService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItb25zY3JlZW4tbWF0ZXJpYWwta2V5Ym9hcmQvIiwic291cmNlcyI6WyJzZXJ2aWNlcy9rZXlib2FyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBZ0IsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVoRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDL0QsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDOUcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDakYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFLMUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFdkY7O0dBRUc7QUFFSDtJQWdDRSw0QkFBb0IsUUFBaUIsRUFDakIsS0FBb0IsRUFDRCxjQUFzQixFQUNYLFFBQTBCLEVBQ2hDLGVBQW1DO1FBSjNELGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUNELG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQ1gsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDaEMsb0JBQWUsR0FBZixlQUFlLENBQW9CO1FBbkMvRTs7OztXQUlHO1FBQ0ssNEJBQXVCLEdBQWdELElBQUksQ0FBQztRQUU1RSxzQkFBaUIs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QUM7UUFDekQsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNELE9BQU8sSUFBSSxjQUFjLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUF5QyxDQUFDO0lBQ2hILENBQUM7SUFFRDs7T0FFRztJQUNLLDJDQUFjLEdBQXRCO1FBQ0UsSUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFhLENBQUM7WUFDOUIsS0FBSyxFQUFFLE1BQU07U0FDZCxDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVE7YUFDbkMsUUFBUSxFQUFFO2FBQ1YsTUFBTSxFQUFFO2FBQ1Isa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWYsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDOztnQkF4SzZCLE9BQU87Z0JBQ1YsYUFBYTs2Q0FDM0IsTUFBTSxTQUFDLFNBQVM7Z0RBQ2hCLE1BQU0sU0FBQyxvQkFBb0I7Z0JBQ3FCLGtCQUFrQix1QkFBbEUsUUFBUSxZQUFJLFFBQVE7O0lBcEN0QixrQkFBa0I7UUFEOUIsVUFBVSxFQUFFO1FBbUNFLFdBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ2pCLFdBQUEsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFDNUIsV0FBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsUUFBUSxFQUFFLENBQUE7T0FwQ3hCLGtCQUFrQixDQXlNOUI7SUFBRCx5QkFBQztDQUFBLEFBek1ELElBeU1DO1NBek1ZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExpdmVBbm5vdW5jZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XHJcbmltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlDb25maWcsIE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XHJcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xyXG5pbXBvcnQgeyBDb21wb25lbnRSZWYsIEluamVjdCwgSW5qZWN0YWJsZSwgTE9DQUxFX0lELCBPcHRpb25hbCwgU2tpcFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IE1hdEtleWJvYXJkUmVmIH0gZnJvbSAnLi4vY2xhc3Nlcy9rZXlib2FyZC1yZWYuY2xhc3MnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMva2V5Ym9hcmQtY29udGFpbmVyL2tleWJvYXJkLWNvbnRhaW5lci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXRLZXlib2FyZENvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMva2V5Ym9hcmQva2V5Ym9hcmQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTUFUX0tFWUJPQVJEX0xBWU9VVFMgfSBmcm9tICcuLi9jb25maWdzL2tleWJvYXJkLWxheW91dHMuY29uZmlnJztcclxuaW1wb3J0IHsgTWF0S2V5Ym9hcmRDb25maWcgfSBmcm9tICcuLi9jb25maWdzL2tleWJvYXJkLmNvbmZpZyc7XHJcbmltcG9ydCB7IElLZXlib2FyZExheW91dCB9IGZyb20gJy4uL2ludGVyZmFjZXMva2V5Ym9hcmQtbGF5b3V0LmludGVyZmFjZSc7XHJcbmltcG9ydCB7IElLZXlib2FyZExheW91dHMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2tleWJvYXJkLWxheW91dHMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgSUxvY2FsZU1hcCB9IGZyb20gJy4uL2ludGVyZmFjZXMvbG9jYWxlLW1hcC5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBfYXBwbHlBdmFpbGFibGVMYXlvdXRzLCBfYXBwbHlDb25maWdEZWZhdWx0cyB9IGZyb20gJy4uL3V0aWxzL2tleWJvYXJkLnV0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBTZXJ2aWNlIHRvIGRpc3BhdGNoIE1hdGVyaWFsIERlc2lnbiBrZXlib2FyZC5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE1hdEtleWJvYXJkU2VydmljZSB7XHJcbiAgLyoqXHJcbiAgICogUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IGtleWJvYXJkIGluIHRoZSB2aWV3ICphdCB0aGlzIGxldmVsKiAoaW4gdGhlIEFuZ3VsYXIgaW5qZWN0b3IgdHJlZSkuXHJcbiAgICogSWYgdGhlcmUgaXMgYSBwYXJlbnQga2V5Ym9hcmQgc2VydmljZSwgYWxsIG9wZXJhdGlvbnMgc2hvdWxkIGRlbGVnYXRlIHRvIHRoYXQgcGFyZW50XHJcbiAgICogdmlhIGBfb3BlbmVkS2V5Ym9hcmRSZWZgLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2tleWJvYXJkUmVmQXRUaGlzTGV2ZWw6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICBwcml2YXRlIF9hdmFpbGFibGVMb2NhbGVzOiBJTG9jYWxlTWFwID0ge307XHJcblxyXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQga2V5Ym9hcmQgYXQgKmFueSogbGV2ZWwuICovXHJcbiAgcHJpdmF0ZSBnZXQgX29wZW5lZEtleWJvYXJkUmVmKCk6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiB8IG51bGwge1xyXG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50S2V5Ym9hcmQ7XHJcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9vcGVuZWRLZXlib2FyZFJlZiA6IHRoaXMuX2tleWJvYXJkUmVmQXRUaGlzTGV2ZWw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldCBfb3BlbmVkS2V5Ym9hcmRSZWYodmFsdWU6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50Pikge1xyXG4gICAgaWYgKHRoaXMuX3BhcmVudEtleWJvYXJkKSB7XHJcbiAgICAgIHRoaXMuX3BhcmVudEtleWJvYXJkLl9vcGVuZWRLZXlib2FyZFJlZiA9IHZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fa2V5Ym9hcmRSZWZBdFRoaXNMZXZlbCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IGF2YWlsYWJsZUxvY2FsZXMoKTogSUxvY2FsZU1hcCB7XHJcbiAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlTG9jYWxlcztcclxuICB9XHJcblxyXG4gIGdldCBpc09wZW5lZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAhIXRoaXMuX29wZW5lZEtleWJvYXJkUmVmO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcclxuICAgICAgICAgICAgICBwcml2YXRlIF9saXZlOiBMaXZlQW5ub3VuY2VyLFxyXG4gICAgICAgICAgICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIF9kZWZhdWx0TG9jYWxlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfS0VZQk9BUkRfTEFZT1VUUykgcHJpdmF0ZSBfbGF5b3V0czogSUtleWJvYXJkTGF5b3V0cyxcclxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnRLZXlib2FyZDogTWF0S2V5Ym9hcmRTZXJ2aWNlKSB7XHJcbiAgICAvLyBwcmVwYXJlIGF2YWlsYWJsZSBsYXlvdXRzIG1hcHBpbmdcclxuICAgIHRoaXMuX2F2YWlsYWJsZUxvY2FsZXMgPSBfYXBwbHlBdmFpbGFibGVMYXlvdXRzKF9sYXlvdXRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW5kIGRpc3BhdGNoZXMgYSBrZXlib2FyZCB3aXRoIGEgY3VzdG9tIGNvbXBvbmVudCBmb3IgdGhlIGNvbnRlbnQsIHJlbW92aW5nIGFueVxyXG4gICAqIGN1cnJlbnRseSBvcGVuZWQga2V5Ym9hcmRzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGxheW91dE9yTG9jYWxlIGxheW91dCBvciBsb2NhbGUgdG8gdXNlLlxyXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBmb3IgdGhlIGtleWJvYXJkLlxyXG4gICAqL1xyXG4gIG9wZW5Gcm9tQ29tcG9uZW50KGxheW91dE9yTG9jYWxlOiBzdHJpbmcsIGNvbmZpZzogTWF0S2V5Ym9hcmRDb25maWcpOiBNYXRLZXlib2FyZFJlZjxNYXRLZXlib2FyZENvbXBvbmVudD4ge1xyXG4gICAgY29uc3Qga2V5Ym9hcmRSZWY6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiA9IHRoaXMuX2F0dGFjaEtleWJvYXJkQ29udGVudChjb25maWcpO1xyXG5cclxuICAgIGtleWJvYXJkUmVmLmluc3RhbmNlLmRhcmtUaGVtZSA9IGNvbmZpZy5kYXJrVGhlbWU7XHJcbiAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5pc0RlYnVnID0gY29uZmlnLmlzRGVidWc7XHJcblxyXG4gICAgLy8gYSBsb2NhbGUgaXMgcHJvdmlkZWRcclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZUxvY2FsZXNbbGF5b3V0T3JMb2NhbGVdKSB7XHJcbiAgICAgIGtleWJvYXJkUmVmLmluc3RhbmNlLmxvY2FsZSA9IGxheW91dE9yTG9jYWxlO1xyXG4gICAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5sYXlvdXQgPSB0aGlzLmdldExheW91dEZvckxvY2FsZShsYXlvdXRPckxvY2FsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYSBsYXlvdXQgbmFtZSBpcyBwcm92aWRlZFxyXG4gICAgaWYgKHRoaXMuX2xheW91dHNbbGF5b3V0T3JMb2NhbGVdKSB7XHJcbiAgICAgIGtleWJvYXJkUmVmLmluc3RhbmNlLmxheW91dCA9IHRoaXMuX2xheW91dHNbbGF5b3V0T3JMb2NhbGVdO1xyXG4gICAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5sb2NhbGUgPSB0aGlzLl9sYXlvdXRzW2xheW91dE9yTG9jYWxlXS5sYW5nICYmIHRoaXMuX2xheW91dHNbbGF5b3V0T3JMb2NhbGVdLmxhbmcucG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbmZpZy5jdXN0b21JY29ucykge1xyXG4gICAgICBrZXlib2FyZFJlZi5pbnN0YW5jZS5pY29ucyA9IGNvbmZpZy5jdXN0b21JY29ucztcclxuICAgIH1cclxuXHJcbiAgICAvLyBXaGVuIHRoZSBrZXlib2FyZCBpcyBkaXNtaXNzZWQsIGxvd2VyIHRoZSBrZXlib2FyZCBjb3VudGVyLlxyXG4gICAga2V5Ym9hcmRSZWZcclxuICAgICAgLmFmdGVyRGlzbWlzc2VkKClcclxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgLy8gQ2xlYXIgdGhlIGtleWJvYXJkIHJlZiBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHJlcGxhY2VkIGJ5IGEgbmV3ZXIga2V5Ym9hcmQuXHJcbiAgICAgICAgaWYgKHRoaXMuX29wZW5lZEtleWJvYXJkUmVmID09PSBrZXlib2FyZFJlZikge1xyXG4gICAgICAgICAgdGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWYgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuX29wZW5lZEtleWJvYXJkUmVmKSB7XHJcbiAgICAgIC8vIElmIGEga2V5Ym9hcmQgaXMgYWxyZWFkeSBpbiB2aWV3LCBkaXNtaXNzIGl0IGFuZCBlbnRlciB0aGVcclxuICAgICAgLy8gbmV3IGtleWJvYXJkIGFmdGVyIGV4aXQgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxyXG4gICAgICB0aGlzLl9vcGVuZWRLZXlib2FyZFJlZlxyXG4gICAgICAgIC5hZnRlckRpc21pc3NlZCgpXHJcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICBrZXlib2FyZFJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB0aGlzLl9vcGVuZWRLZXlib2FyZFJlZi5kaXNtaXNzKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBJZiBubyBrZXlib2FyZCBpcyBpbiB2aWV3LCBlbnRlciB0aGUgbmV3IGtleWJvYXJkLlxyXG4gICAgICBrZXlib2FyZFJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGEgZGlzbWlzcyB0aW1lb3V0IGlzIHByb3ZpZGVkLCBzZXQgdXAgZGlzbWlzcyBiYXNlZCBvbiBhZnRlciB0aGUga2V5Ym9hcmQgaXMgb3BlbmVkLlxyXG4gICAgLy8gaWYgKGNvbmZpZ3MuZHVyYXRpb24gPiAwKSB7XHJcbiAgICAvLyAgIGtleWJvYXJkUmVmLmFmdGVyT3BlbmVkKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgIC8vICAgICBzZXRUaW1lb3V0KCgpID0+IGtleWJvYXJkUmVmLmRpc21pc3MoKSwgY29uZmlncy5kdXJhdGlvbik7XHJcbiAgICAvLyAgIH0pO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIGlmIChjb25maWcuYW5ub3VuY2VtZW50TWVzc2FnZSkge1xyXG4gICAgICB0aGlzLl9saXZlLmFubm91bmNlKGNvbmZpZy5hbm5vdW5jZW1lbnRNZXNzYWdlLCBjb25maWcucG9saXRlbmVzcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWYgPSBrZXlib2FyZFJlZjtcclxuICAgIHJldHVybiB0aGlzLl9vcGVuZWRLZXlib2FyZFJlZjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9wZW5zIGEga2V5Ym9hcmQgd2l0aCBhIG1lc3NhZ2UgYW5kIGFuIG9wdGlvbmFsIGFjdGlvbi5cclxuICAgKiBAcGFyYW0gbGF5b3V0T3JMb2NhbGUgQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBsb2NhbGUgb3IgdGhlIGxheW91dCBuYW1lIHRvIGJlIHVzZWQuXHJcbiAgICogQHBhcmFtIGNvbmZpZyBBZGRpdGlvbmFsIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIGtleWJvYXJkLlxyXG4gICAqL1xyXG4gIG9wZW4obGF5b3V0T3JMb2NhbGU6IHN0cmluZyA9IHRoaXMuX2RlZmF1bHRMb2NhbGUsIGNvbmZpZzogTWF0S2V5Ym9hcmRDb25maWcgPSB7fSk6IE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PiB7XHJcbiAgICBjb25zdCBfY29uZmlnID0gX2FwcGx5Q29uZmlnRGVmYXVsdHMoY29uZmlnKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcGVuRnJvbUNvbXBvbmVudChsYXlvdXRPckxvY2FsZSwgX2NvbmZpZyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseS12aXNpYmxlIGtleWJvYXJkLlxyXG4gICAqL1xyXG4gIGRpc21pc3MoKSB7XHJcbiAgICBpZiAodGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWYpIHtcclxuICAgICAgdGhpcy5fb3BlbmVkS2V5Ym9hcmRSZWYuZGlzbWlzcygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFwIGEgZ2l2ZW4gbG9jYWxlIHRvIGEgbGF5b3V0IG5hbWUuXHJcbiAgICogQHBhcmFtIGxvY2FsZSBUaGUgbGF5b3V0IG5hbWVcclxuICAgKi9cclxuICBtYXBMb2NhbGUobG9jYWxlOiBzdHJpbmcgPSB0aGlzLl9kZWZhdWx0TG9jYWxlKTogc3RyaW5nIHtcclxuICAgIGxldCBsYXlvdXQ6IHN0cmluZztcclxuICAgIGNvbnN0IGNvdW50cnkgPSBsb2NhbGVcclxuICAgICAgLnNwbGl0KCctJylcclxuICAgICAgLnNoaWZ0KCk7XHJcblxyXG4gICAgLy8gc2VhcmNoIGZvciBsYXlvdXQgbWF0Y2hpbmcgdGhlXHJcbiAgICAvLyBmaXJzdCBwYXJ0LCB0aGUgY291bnRyeSBjb2RlXHJcbiAgICBpZiAodGhpcy5hdmFpbGFibGVMb2NhbGVzW2NvdW50cnldKSB7XHJcbiAgICAgIGxheW91dCA9IHRoaXMuYXZhaWxhYmxlTG9jYWxlc1tsb2NhbGVdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxvb2sgaWYgdGhlIGRldGFpbGVkIGxvY2FsZSBtYXRjaGVzIGFueSBsYXlvdXRcclxuICAgIGlmICh0aGlzLmF2YWlsYWJsZUxvY2FsZXNbbG9jYWxlXSkge1xyXG4gICAgICBsYXlvdXQgPSB0aGlzLmF2YWlsYWJsZUxvY2FsZXNbbG9jYWxlXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWxheW91dCkge1xyXG4gICAgICB0aHJvdyBFcnJvcihgTm8gbGF5b3V0IGZvdW5kIGZvciBsb2NhbGUgJHtsb2NhbGV9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxheW91dDtcclxuICB9XHJcblxyXG4gIGdldExheW91dEZvckxvY2FsZShsb2NhbGU6IHN0cmluZyk6IElLZXlib2FyZExheW91dCB7XHJcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0c1t0aGlzLm1hcExvY2FsZShsb2NhbGUpXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF0dGFjaGVzIHRoZSBrZXlib2FyZCBjb250YWluZXIgY29tcG9uZW50IHRvIHRoZSBvdmVybGF5LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2F0dGFjaEtleWJvYXJkQ29udGFpbmVyKG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsIGNvbmZpZzogTWF0S2V5Ym9hcmRDb25maWcpOiBNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudCB7XHJcbiAgICBjb25zdCBjb250YWluZXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKE1hdEtleWJvYXJkQ29udGFpbmVyQ29tcG9uZW50LCBjb25maWcudmlld0NvbnRhaW5lclJlZik7XHJcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxNYXRLZXlib2FyZENvbnRhaW5lckNvbXBvbmVudD4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xyXG5cclxuICAgIC8vIHNldCBjb25maWdcclxuICAgIGNvbnRhaW5lclJlZi5pbnN0YW5jZS5rZXlib2FyZENvbmZpZyA9IGNvbmZpZztcclxuXHJcbiAgICByZXR1cm4gY29udGFpbmVyUmVmLmluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGxhY2VzIGEgbmV3IGNvbXBvbmVudCBhcyB0aGUgY29udGVudCBvZiB0aGUga2V5Ym9hcmQgY29udGFpbmVyLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2F0dGFjaEtleWJvYXJkQ29udGVudChjb25maWc6IE1hdEtleWJvYXJkQ29uZmlnKTogTWF0S2V5Ym9hcmRSZWY8TWF0S2V5Ym9hcmRDb21wb25lbnQ+IHtcclxuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KCk7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9hdHRhY2hLZXlib2FyZENvbnRhaW5lcihvdmVybGF5UmVmLCBjb25maWcpO1xyXG4gICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChNYXRLZXlib2FyZENvbXBvbmVudCk7XHJcbiAgICBjb25zdCBjb250ZW50UmVmID0gY29udGFpbmVyLmF0dGFjaENvbXBvbmVudFBvcnRhbChwb3J0YWwpO1xyXG4gICAgcmV0dXJuIG5ldyBNYXRLZXlib2FyZFJlZihjb250ZW50UmVmLmluc3RhbmNlLCBjb250YWluZXIsIG92ZXJsYXlSZWYpIGFzIE1hdEtleWJvYXJkUmVmPE1hdEtleWJvYXJkQ29tcG9uZW50PjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgb3ZlcmxheSBhbmQgcGxhY2VzIGl0IGluIHRoZSBjb3JyZWN0IGxvY2F0aW9uLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoKTogT3ZlcmxheVJlZiB7XHJcbiAgICBjb25zdCBzdGF0ZSA9IG5ldyBPdmVybGF5Q29uZmlnKHtcclxuICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3RhdGUucG9zaXRpb25TdHJhdGVneSA9IHRoaXMuX292ZXJsYXlcclxuICAgICAgLnBvc2l0aW9uKClcclxuICAgICAgLmdsb2JhbCgpXHJcbiAgICAgIC5jZW50ZXJIb3Jpem9udGFsbHkoKVxyXG4gICAgICAuYm90dG9tKCcwJyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkuY3JlYXRlKHN0YXRlKTtcclxuICB9XHJcbn1cclxuIl19