import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import NotificationCard from "../notifications/NotificationCard";
import * as api from "../../api/apiRoutes";

const Notifications = ({ selectedTab, setSelectedTab }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (selectedTab === "notifications") {
      handleFetchNotifications();
    }
  }, [selectedTab]);

  const handleFetchNotifications = async () => {
    try {
      const response = await api.getNotifications({ limit: 7, offset: 0 });
      console.log(response.data);
      setNotifications(response.data);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  return (
    <div>
      <div className="cardBorder rounded-sm">
        <div className="buttonBackground flex justify-between p-4 items-center">
          <h2 className="font-bold text-xl">{t("notification")}</h2>
        </div>
        {notifications?.map((notification, idx) => (
          <NotificationCard
            notification={notification}
            key={notification?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
