import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
var MatKeyboardKebabCasePipe = /** @class */ (function () {
    function MatKeyboardKebabCasePipe() {
    }
    MatKeyboardKebabCasePipe.prototype.transform = function (value) {
        return value.replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase();
    };
    MatKeyboardKebabCasePipe = __decorate([
        Pipe({
            name: 'matKeyboardKebabCase',
            pure: false
        })
    ], MatKeyboardKebabCasePipe);
    return MatKeyboardKebabCasePipe;
}());
export { MatKeyboardKebabCasePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2ViYWItY2FzZS5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbInBpcGVzL2tlYmFiLWNhc2UucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFNcEQ7SUFBQTtJQVFBLENBQUM7SUFOQyw0Q0FBUyxHQUFULFVBQVUsS0FBYTtRQUNyQixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDO2FBQzdDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO2FBQ3BCLFdBQVcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFOVSx3QkFBd0I7UUFKcEMsSUFBSSxDQUFDO1lBQ0osSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixJQUFJLEVBQUUsS0FBSztTQUNaLENBQUM7T0FDVyx3QkFBd0IsQ0FRcEM7SUFBRCwrQkFBQztDQUFBLEFBUkQsSUFRQztTQVJZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBQaXBlKHtcclxuICBuYW1lOiAnbWF0S2V5Ym9hcmRLZWJhYkNhc2UnLFxyXG4gIHB1cmU6IGZhbHNlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXRLZXlib2FyZEtlYmFiQ2FzZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuXHJcbiAgdHJhbnNmb3JtKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpXHJcbiAgICAgIC5yZXBsYWNlKC9cXHMrL2csICctJylcclxuICAgICAgLnRvTG93ZXJDYXNlKCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=