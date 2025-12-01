import { t } from "@/utils/translation";
import { Zap, Truck, ArrowRight, HelpCircle } from "lucide-react";
import React, { useState } from "react";
import LightImage from "@/assets/Vector-filled.png";
import Image from "next/image";
import BikeImage from "@/assets/bike.png";
import PlanSelectionModal from "./EgrocerMaxPaymentModal";
import WalletBalanceModal from "../wallet/WalletBalanceModal";
import EgrocerMaxFaqs from "./EgrocerMaxFaqs";

const EgrocerMax = () => {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [addWalletModal, setAddWalletModal] = useState(false);
  const [isFaqsModalOpen, setIsFaqsModalOpen] = useState(false);

  function onSelectPlan(plan) {
    setSelectedPlan(plan);
  }

  function handleFaqOpen() {
    setIsFaqsModalOpen(true);
  }

  return (
    <div className="w-full mx-auto h-fit border-2 rounded-lg">
      <div className="w-full backgroundColor flex justify-between items-center">
        <h2 className=" text-base md:text-xl font-bold p-4">
          {t("egrocer_max_title")}
        </h2>
      </div>
      <div className="w-full mx-auto h-fit space-y-6 p-6">
        <div
          style={{ backgroundColor: "var(--footer-background-color)" }}
          className="rounded-3xl p-5 md:p-6 text-white shadow-xl"
        >
          <div className="flex gap-4 mb-6 items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-white rounded-full  h-16 w-16 ">
                <Image
                  src={LightImage}
                  alt="light logo"
                  className={`h-12 w-12 object-contain `}
                  height={0}
                  width={0}
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {t("save_more_with_egrocermax")}
              </h2>
              <p className="text-[#8BA2B3] text-base font-medium mt-1 leading-relaxed">
                {t("save_more_with_egrocermax_desc")}
              </p>
            </div>
          </div>

          <div className="dashedBorder"></div>

          <div className=" my-6 flex flex-col gap-2">
            <h3 className=" font-bold">{t("max_benefits")}</h3>

            <div
              style={{ backgroundColor: "var(--button-background-color)" }}
              className="rounded-xl p-4 flex items-center gap-4"
            >
              <div
                style={{ backgroundColor: "var(--footer-background-color)" }}
                className="p-3 rounded-lg flex-shrink-0"
              >
                <Image
                  src={BikeImage}
                  className={`h-8 w-8 object-contain `}
                  alt="light logo"
                />
              </div>
              <div className="flex-grow">
                <h4 className="textColor font-bold text-base">
                  {t("free_delivery")}
                </h4>
                <p className="subTextColor text-sm mt-0.5 leading-snug">
                  {t("free_delivery_perks")}
                </p>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-6 primaryBackColor hover:opacity-90 active:opacity-80 transition-opacity text-white font-normal text-xl py-3.5 rounded-lg flex items-center justify-center gap-2"
            onClick={() => setIsPlanModalOpen(true)}
          >
            {t("choose_your_plan")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div
          style={{
            backgroundColor: "var(--swiper-background-color)",
            borderColor: "var(--border-color)",
          }}
          onClick={handleFaqOpen}
          className="rounded-2xl p-4 flex items-center justify-between cursor-pointer cardBorder transition-colors"
        >
          <div className="flex items-center gap-4">
            <div
              style={{ backgroundColor: "var(--light-primary-color)" }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <HelpCircle className="w-5 h-5 md:w-6 md:h-6 primaryColor" />
            </div>
            <div>
              <h4 className="font-bold textColor text-sm">
                {t("faqs_for_subscription")}
              </h4>
              <p className="subTextColor text-xs mt-0.5">
                {t("get_answer_to_common_queries")}
              </p>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 textColor" />
        </div>
      </div>

      <PlanSelectionModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSelectPlan={onSelectPlan}
        selectedPlan={selectedPlan}
        setAddWalletModal={setAddWalletModal}
      />
      <WalletBalanceModal
        setAddWalletModal={setAddWalletModal}
        addWalletModal={addWalletModal}
        type="subscription"
        selectedPlan={selectedPlan}
      />
      <EgrocerMaxFaqs isOpen={isFaqsModalOpen} setIsOpen={setIsFaqsModalOpen} />
    </div>
  );
};

export default EgrocerMax;
