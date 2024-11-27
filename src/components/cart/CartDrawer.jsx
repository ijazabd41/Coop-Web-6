import React from 'react';
import { t } from "@/utils/translation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import CartProductsCard from '../productcards/CartProductsCard';

const CartDrawer = ({ showCart, setShowCart }) => {
    return (
        <Sheet open={showCart} onOpenChange={setShowCart}>
            <SheetContent className="p-0 w-full sm:w-[900px]">
                <SheetHeader className="px-0 py-3 border-[1px] flex justify-between text-left">
                    <SheetTitle className="text-2xl font-bold">
                        {t("shoppingCart")}
                    </SheetTitle>
                </SheetHeader>
                <CartProductsCard />
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
