import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let MatKeyboardKebabCasePipe = class MatKeyboardKebabCasePipe {
    transform(value) {
        return value.replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase();
    }
};
MatKeyboardKebabCasePipe = __decorate([
    Pipe({
        name: 'matKeyboardKebabCase',
        pure: false
    })
], MatKeyboardKebabCasePipe);
export { MatKeyboardKebabCasePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2ViYWItY2FzZS5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1vbnNjcmVlbi1tYXRlcmlhbC1rZXlib2FyZC8iLCJzb3VyY2VzIjpbInBpcGVzL2tlYmFiLWNhc2UucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFNcEQsSUFBYSx3QkFBd0IsR0FBckMsTUFBYSx3QkFBd0I7SUFFbkMsU0FBUyxDQUFDLEtBQWE7UUFDckIsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQzthQUM3QyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQzthQUNwQixXQUFXLEVBQUUsQ0FBQztJQUNuQixDQUFDO0NBRUYsQ0FBQTtBQVJZLHdCQUF3QjtJQUpwQyxJQUFJLENBQUM7UUFDSixJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLElBQUksRUFBRSxLQUFLO0tBQ1osQ0FBQztHQUNXLHdCQUF3QixDQVFwQztTQVJZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBQaXBlKHtcclxuICBuYW1lOiAnbWF0S2V5Ym9hcmRLZWJhYkNhc2UnLFxyXG4gIHB1cmU6IGZhbHNlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXRLZXlib2FyZEtlYmFiQ2FzZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuXHJcbiAgdHJhbnNmb3JtKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpXHJcbiAgICAgIC5yZXBsYWNlKC9cXHMrL2csICctJylcclxuICAgICAgLnRvTG93ZXJDYXNlKCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=