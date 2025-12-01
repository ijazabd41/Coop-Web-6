import React from "react";
import { X, Truck, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { DialogTitle } from "@radix-ui/react-dialog";
import { t } from "@/utils/translation";
import { toast } from "react-toastify";

const PlanSelectionModal = ({
  isOpen,
  onClose,
  selectedPlan,
  onSelectPlan,
  setAddWalletModal,
}) => {
  const plans = [
    {
      name: "MAX Lite",
      days: 90,
      currentPrice: 299.0,
      oldPrice: 599.0,
      deliveryThreshold: 500.0,
      value: "MAX Lite",
    },
    {
      name: "MAX Plus",
      days: 180,
      currentPrice: 499.0,
      oldPrice: 1199.0,
      deliveryThreshold: 200.0,
      value: "MAX Plus",
    },
    {
      name: "MAX Ultra",
      days: 365,
      currentPrice: 799.0,
      oldPrice: 1999.0,
      deliveryThreshold: 99.0,
      value: "MAX Ultra",
    },
  ];

  const getPlanCardStyle = (planValue) => {
    const isSelected = selectedPlan === planValue;
    return {
      backgroundColor: "var(--body-background-color)",
      borderColor: isSelected ? "var(--primary-color)" : "var(--border-color)",
    };
  };

  const handleSetWalletModal = () => {
    if (!selectedPlan) {
      toast.error(t("please_select_a_plan"));
      return;
    }
    onClose();
    setAddWalletModal(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-6 focus-visible:outline-none focus:outline-none rounded-2xl shadow-2xl max-w-4xl w-full  "
        style={{ backgroundColor: "var(--body-background-color)" }}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between items-start  border-b pb-2">
              <div>
                <h2 className="text-2xl font-bold textColor">
                  {t("choose_your_plan")}
                </h2>
                <p className="text-sm subTextColor mt-1">
                  {t("select_subscription_desc")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <div className="mt-6 space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.value}
                onClick={() => onSelectPlan(plan.value)}
                style={getPlanCardStyle(plan.value)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.value
                    ? "shadow-md"
                    : "hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold textColor">
                        {plan.name}
                      </span>
                      <span className="text-xs font-medium text-white primaryBackColor py-0.5 px-2 rounded-full">
                        {plan.days} Days
                      </span>
                    </div>
                    <div className="textColor font-bold flex items-center">
                      <span className="text-xl">
                        ${plan.currentPrice.toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-gray-400 ml-2">
                        ${plan.oldPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0`}
                    style={{
                      borderColor:
                        selectedPlan === plan.value
                          ? "var(--primary-color)"
                          : "var(--border-color)",
                    }}
                  >
                    {selectedPlan === plan.value && (
                      <div className="w-2.5 h-2.5 rounded-full primaryBackColor" />
                    )}
                  </div>
                </div>
                <div
                  className="mt-3 p-3 rounded-lg flex items-center gap-3"
                  style={{ backgroundColor: "var(--swiper-background-color)" }}
                >
                  <Truck className="w-5 h-5 subTextColor" />
                  <span className="text-sm subTextColor">
                    {t("free_delivery_on")} **$
                    {plan.deliveryThreshold.toFixed(2)}**
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end w-full">
          <button
            className="w-64 items-center text-xl primaryBackColor  text-white py-2 px-4 rounded-md flex gap-6"
            onClick={handleSetWalletModal}
          >
            {t("proceed_to_payment")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanSelectionModal;
