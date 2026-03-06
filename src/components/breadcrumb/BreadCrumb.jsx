import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { isRtl } from "@/lib/utils";
import { t } from "@/utils/translation";

const notFoundRoute = ["/order-detail"];

const BreadCrumb = ({ title }) => {
  const rtl = isRtl();
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  useEffect(() => {
    if (router.pathname) {
      const pathArray = router.asPath
        .split("?")[0]
        .split("/")
        .filter((path) => path);
      const formattedBreadcrumbs = pathArray.map((path, index) => {
        const href = `/${pathArray.slice(0, index + 1).join("/")}`;
        return { label: decodeURIComponent(path), href };
      });

      if (title && formattedBreadcrumbs.length > 0) {
        formattedBreadcrumbs[formattedBreadcrumbs.length - 1].label = title;
      }


      setBreadcrumbs(formattedBreadcrumbs);
    }
  }, [router.pathname, router.asPath, title]);

  const handleNotFoundRoutes = (href) => {
    if (href === "/product") {
      return router.push("/products");
    }
    if (href == "/blog") {
      return router.push("/blogs");
    }
    if (href === "/categories") {
      return router.push("/categories/all");
    }
    const notFound = notFoundRoute.includes(href);
    if (notFound) {
      return router.back();
    }
    return router.push(href);
  };

  const handleCheckBreadCrumb = () => {
    if (
      breadcrumbs?.length === 2 &&
      parseInt(breadcrumbs[breadcrumbs.length - 1]?.label)
    ) {
      return formatBreadcrumbLabel(breadcrumbs[0]?.label);
    }
    if (breadcrumbs?.length === 1) {
      if (breadcrumbs[0]?.label === "about-us") {
        return t("about_us");
      }
      if (breadcrumbs[0]?.label === "contact-us") {
        return t("contact_us");
      }
      if (breadcrumbs[0]?.label === "products") {
        return t("products");
      }
      if (breadcrumbs[0]?.label === "blogs") {
        return t("blogs");
      }
      if (breadcrumbs[0]?.label === "orders") {
        return t("orders");
      }
      if (breadcrumbs[0]?.label === "wishlist") {
        return t("wishlist");
      }
      if (breadcrumbs[0]?.label === "profile") {
        return t("profile");
      }
      if (breadcrumbs[0]?.label === "address") {
        return t("address");
      }

      if (breadcrumbs[0]?.label === "subscription") {
        return t("subscription");
      }

      if (breadcrumbs[0]?.label === "transaction") {
        return t("transaction");
      }

      if (breadcrumbs[0]?.label === "notifications") {
        return t("notifications");
      }

      if (breadcrumbs[0]?.label === "notification-setting") {
        return t("notification-setting");
      }

      if (breadcrumbs[0]?.label === "requested-products") {
        return t("requestedProducts");
      }

      if (breadcrumbs[0].label === "faqs") {
        return t("faqs");
      }

      if (breadcrumbs[0].label === "terms-and-conditions") {
        return t("terms-and-conditions");
      }

      if (breadcrumbs[0].label === "privacy-policy") {
        return t("privacy-policy");
      }

      if (breadcrumbs[0].label === "return-and-exchange-policy") {
        return t("return-and-exchange-policy");
      }

      if (breadcrumbs[0].label === "shipping-policy") {
        return t("shipping-policy");
      }

      if (breadcrumbs[0].label === "cancellation-policy") {
        return t("cancellation-policy");
      }

      if (breadcrumbs[0].label === "cart") {
        return t("cart");
      }

      if (breadcrumbs[0].label === "checkout") {
        return t("checkout");
      }

      if (breadcrumbs[0].label === "order-detail") {
        return t("order-detail");
      }

      if (breadcrumbs[0].label === "brands") {
        return t("brands");
      }

      if (breadcrumbs[0].label === "countries") {
        return t("countries");
      }

      return breadcrumbs?.[0]?.label;
    }
    if (breadcrumbs[1]?.label === "activeorders") {
      return t("active_orders");
    }

    if (breadcrumbs[1]?.label === "orderhistory") {
      return t("order_history");
    }
    if (breadcrumbs[1]?.label === "wallethistory") {
      return t("wallet_history");
    }

    if (breadcrumbs[1]?.label === "requested-products") {
      return t("requestedProducts");
    }

    if (breadcrumbs[1]?.label === "categories") {
      return t("categories");
    }

    if (breadcrumbs[1]?.label === "products") {
      return t("products");
    }

    if (breadcrumbs[1]?.label === "blogs") {
      return t("blogs");
    }

    if (breadcrumbs[1]?.label === "profile") {
      return t("profile");
    }

    if (breadcrumbs[1]?.label === "orders") {
      return t("orders");
    }

    if (breadcrumbs[1]?.label === "wishlist") {
      return t("wishlist");
    }

    if (breadcrumbs[1]?.label === "address") {
      return t("address");
    }

    if (breadcrumbs[1]?.label === "subscription") {
      return t("subscription");
    }

    if (breadcrumbs[1]?.label === "notifications") {
      return t("notifications");
    }

    if (breadcrumbs[1]?.label === "transaction") {
      return t("transaction");
    }

    if (breadcrumbs[1]?.label === "notification-setting") {
      return t("notification-setting");
    }

    if (breadcrumbs[1]?.label === "all") {
      return t("all");
    }

    return breadcrumbs[1]?.label;
  };

  const formatBreadcrumbLabel = (label) => {
    const map = {
      activeorders: t("active_orders"),
      orderhistory: t("order_history"),
      wallethistory: t("wallet_history"),
      "about-us": t("about_us"),
      "contact-us": t("contact_us"),
      categories: t("categories"),
      products: t("products"),
      blogs: t("blogs"),
      profile: t("profile"),
      all: t("all"),
      orders: t("orders"),
      wishlist: t("wishlist"),
      address: t("address"),
      subscription: t("subscription"),
      transaction: t("transaction"),
      notifications: t("notifications"),
      "notification-setting": t("notification-setting"),
      "requested-products": t("requestedProducts"),
      faqs: t("faqs"),
      "terms-and-conditions": t("terms-and-conditions"),
      active_orders: t("active_orders"),
      "privacy-policy": t("privacy-policy"),
      "return-and-exchange-policy": t("return-and-exchange-policy"),
      "shipping-policy": t("shipping-policy"),
      "cancellation-policy": t("cancellation-policy"),
      "cart": t("cart"),
      "checkout": t("checkout"),
      "order-detail": t("order-detail"),
      "product":t("product"),
      "blog":t("blog"),
      "brands":t("brands"),
      "countries":t("countries")
      
    };

    if (map[label]) return map[label];

    return label
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };



  return (
    <section className="p-3 md:p-6 breadCrumbBg">
      <div className=" container px-2">
        <div className="flex justify-between flex-col gap-1 md:flex-row">
          <p className="text-xl font-bold capitalize">
            {title
              ? title
              : breadcrumbs.length
                ? handleCheckBreadCrumb()
                : t("home")}
          </p>
          <div className="flex gap-1 items-center overflow-hidden ">
            <Link
              href="/"
              className="text-sm font-bold capitalize primaryColor"
            >
              {t("home")}
            </Link>

            {breadcrumbs.map((crumb, index) => (
              <div
                key={crumb.href}
                className="flex items-center gap-1 max-w-[150px]"
              >
                {rtl ? (
                  <FaChevronLeft size={14} className="shrink-0"/>
                ) : (
                  <FaChevronRight size={14} className="shrink-0"/>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span
                    className="text-sm font-bold capitalize cursor-pointer text-ellipsis  whitespace-nowrap line-clamp-1"
                    style={{ maxWidth: "100%" }}
                    title={crumb.label}
                  >
                    {formatBreadcrumbLabel(crumb.label)}
                  </span>
                ) : (
                  <div
                    onClick={() => handleNotFoundRoutes(crumb.href)}
                    className="text-sm font-bold capitalize text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer primaryColor "
                    style={{ maxWidth: "100%" }}
                    title={crumb.label}
                  >
                    {formatBreadcrumbLabel(crumb.label)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreadCrumb;
