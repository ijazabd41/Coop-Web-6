import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import * as api from "@/api/apiRoutes";
import CardSkeleton from "@/components/skeleton/CardSkeleton";

const Loyalty = () => {
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    setLoading(true);
    try {
      const [programsRes, couponsRes, cardsRes] = await Promise.all([
        api.getLoyaltyPrograms(),
        api.getLoyaltyCoupons(),
        api.getLoyaltyCards()
      ]);

      if (programsRes?.status === 1) {
        setPrograms(programsRes.data || []);
      }
      if (couponsRes?.status === 1) {
        setCoupons(couponsRes.data || []);
      }
      if (cardsRes?.status === 1) {
        setCards(cardsRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching loyalty data", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <CardSkeleton height={100} />
        <CardSkeleton height={100} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="cardBorder p-4 rounded-sm backgroundColor flex justify-between items-center">
        <h2 className="text-xl font-bold textColor">{t("loyalty_program")}</h2>
      </div>

      <div className="cardBorder p-6 rounded-sm backgroundColor flex flex-col gap-4">
        <h3 className="text-lg font-bold textColor mb-2">{t("my_loyalty_cards")}</h3>
        {cards?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card, idx) => (
              <div key={idx} className="border flex items-center p-4 rounded-lg shadow-sm bg-white border-l-8 border-l-[#00a8b3]">
                <div className="mr-5">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="-rotate-12">
                    <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" fill="#F0F8FF" stroke="#102A43" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" fill="#F0F8FF" stroke="#102A43" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11L13.22 8.52L16 8.12L14 6.16L14.46 3.4L12 4.69L9.54 3.4L10 6.16L8 8.12L10.78 8.52L12 11Z" fill="#C5E4F3" stroke="#102A43" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">
                    {t("loyalty_program")}
                  </h4>
                  <p className="text-gray-500 text-lg mb-1">
                    {Number(card.points).toFixed(2)} {t("loyalty_points", "Loyalty point(s)")}
                  </p>
                  <p className="text-[#00a8b3] text-lg">
                    {t("reward_waiting", "A reward is waiting for you")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t("no_loyalty_cards_found")}</p>
        )}
      </div>

      <div className="cardBorder p-6 rounded-sm backgroundColor flex flex-col gap-4">
        <h3 className="text-lg font-bold textColor mb-2">{t("loyalty_programs")}</h3>
        {programs?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog, idx) => (
              <div key={idx} className="border p-4 rounded-md shadow-sm">
                <p className="font-semibold">{prog.name || prog.display_name}</p>
                <p className="text-sm">{t("program_type")}: {prog.program_type}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t("no_loyalty_programs_found")}</p>
        )}
      </div>

      <div className="cardBorder p-6 rounded-sm backgroundColor flex flex-col gap-4">
        <h3 className="text-lg font-bold textColor mb-2">{t("my_coupons")}</h3>
        {coupons?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon, idx) => (
              <div key={idx} className="border p-4 rounded-md shadow-sm">
                <p className="font-semibold">{coupon.promo_code}</p>
                <p className="text-sm">{t("discount")}: {coupon.discount}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t("no_coupons_found")}</p>
        )}
      </div>

    </div>
  );
};

export default Loyalty;
