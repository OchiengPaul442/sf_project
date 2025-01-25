"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EngineerForm } from "./engineer-form";
import { RestaurantForm } from "./restaurant-form";
import { InvestorForm } from "./investor-form";
import { ArrowLeft } from "lucide-react";

type FormType = "engineer" | "restaurant" | "investor";

export function ContactForm() {
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="h-full py-6 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {!selectedForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              How can we help?
            </h2>
            <div className="grid gap-4">
              {[
                {
                  type: "engineer",
                  title: "I'm an Engineer",
                  description:
                    "Join our team and help build the future of restaurant management",
                },
                {
                  type: "restaurant",
                  title: "I'm a Restaurant Owner",
                  description:
                    "Transform your restaurant operations with our innovative solutions",
                },
                {
                  type: "investor",
                  title: "I'm an Investor",
                  description:
                    "Partner with us in revolutionizing the restaurant industry",
                },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedForm(item.type as FormType)}
                  className="p-4 text-left border rounded-xl hover:bg-gray-50 transition-colors w-full"
                >
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedForm}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bottom-2"
            >
              <button
                onClick={() => setSelectedForm(null)}
                className="mb-6 text-sm font-medium hover:underline inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to options
              </button>
              {selectedForm === "engineer" && <EngineerForm />}
              {selectedForm === "restaurant" && <RestaurantForm />}
              {selectedForm === "investor" && <InvestorForm />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
