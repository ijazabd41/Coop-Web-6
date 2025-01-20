import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import NotificationCard from "../notifications/NotificationCard";
import * as api from "../../api/apiRoutes";
import NoNotificationImage from "@/assets/not_found_images/No_Notification.svg"
import Image from "next/image";

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
      setNotifications(response.data);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  return (
    <div>
      <div className="cardBorder rounded-sm">
        <div className="backgroundColor flex justify-between p-4 items-center">
          <h2 className="font-bold text-xl">{t("notification")}</h2>
        </div>
        {notifications?.length > 0 ? notifications?.map((notification, idx) => (
          <NotificationCard
            notification={notification}
            key={notification?.id}
          />
        )) : <div className=' col-span-12 h-full w-full flex items-center justify-center flex-col gap-2 p-2'>
          <Image src={NoNotificationImage} alt='Notification Not found' height={0} width={0} className='h-3/4 w-3/4' />
          <h2 className='text-2xl font-bold'>{t("empty_notification_list_message")}</h2>
        </div>}
      </div>
    </div>
  );
};

export default Notifications;
