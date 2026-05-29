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
              <div key={idx} className="border p-4 rounded-md shadow-sm">
                <p className="font-semibold">{t("card_number")}: {card.code || card.display_name}</p>
                <p>{t("points")}: {card.points}</p>
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
