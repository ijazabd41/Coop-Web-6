import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { t } from "@/utils/translation";
import EgrocerMaxFaq from "@/components/faqs/EgrocerMaxFaqCard";

const EgrocerMaxFaqs = ({ isOpen, setIsOpen }) => {
  const onClose = () => {
    setIsOpen(false);
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
                  {t("faqs_for_subscription")}
                </h2>
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
        <div>
          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="">
                <EgrocerMaxFaq
                  faq={{
                    question: `Sample Question ${index + 1}`,
                    answer: `This is a sample answer for question ${
                      index + 1
                    }. It provides detailed information regarding the query.`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EgrocerMaxFaqs;
