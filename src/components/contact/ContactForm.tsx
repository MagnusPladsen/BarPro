"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

function useContactSchema() {
  const t = useTranslations("contactPage.validation");

  return z.object({
    name: z.string().min(1, t("nameRequired")),
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    phone: z.string().optional(),
    eventType: z.string().min(1, t("eventTypeRequired")),
    guests: z.string().min(1, t("guestsRequired")),
    date: z.string().optional(),
    message: z.string().min(1, t("messageRequired")).min(10, t("messageMin")),
  });
}

type ContactFormData = z.infer<ReturnType<typeof useContactSchema>>;

export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const schema = useContactSchema();
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full bg-background border border-border px-4 py-4 text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-gold/40 transition-colors duration-300";
  const labelClasses =
    "block text-[11px] tracking-[0.15em] uppercase text-text-muted mb-3";
  const errorClasses = "text-red-400/80 text-xs mt-2";

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="py-16 text-center"
      >
        <div className="w-16 h-16 border border-gold/30 flex items-center justify-center mx-auto mb-8">
          <span className="text-gold text-2xl">&#10003;</span>
        </div>
        <p className="font-display font-light text-2xl text-text-primary">
          {t("success")}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
      >
        <label htmlFor="name" className={labelClasses}>
          {t("name")}
        </label>
        <input
          id="name"
          type="text"
          placeholder={t("namePlaceholder")}
          className={inputClasses}
          {...register("name")}
        />
        {errors.name && (
          <p className={errorClasses}>{errors.name.message}</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
      >
        <label htmlFor="email" className={labelClasses}>
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          className={inputClasses}
          {...register("email")}
        />
        {errors.email && (
          <p className={errorClasses}>{errors.email.message}</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
      >
        <label htmlFor="phone" className={labelClasses}>
          {t("phone")}
        </label>
        <input
          id="phone"
          type="tel"
          placeholder={t("phonePlaceholder")}
          className={inputClasses}
          {...register("phone")}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div>
          <label htmlFor="eventType" className={labelClasses}>
            {t("eventType")}
          </label>
          <select
            id="eventType"
            className={inputClasses}
            defaultValue=""
            {...register("eventType")}
          >
            <option value="" disabled>
              {t("eventTypePlaceholder")}
            </option>
            <option value="wedding">{t("eventTypes.wedding")}</option>
            <option value="corporate">{t("eventTypes.corporate")}</option>
            <option value="private">{t("eventTypes.private")}</option>
            <option value="other">{t("eventTypes.other")}</option>
          </select>
          {errors.eventType && (
            <p className={errorClasses}>{errors.eventType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="guests" className={labelClasses}>
            {t("guests")}
          </label>
          <select
            id="guests"
            className={inputClasses}
            defaultValue=""
            {...register("guests")}
          >
            <option value="" disabled>
              {t("guestsPlaceholder")}
            </option>
            <option value="under-50">{t("guestRanges.small")}</option>
            <option value="50-100">{t("guestRanges.medium")}</option>
            <option value="100-200">{t("guestRanges.large")}</option>
            <option value="200+">{t("guestRanges.xlarge")}</option>
          </select>
          {errors.guests && (
            <p className={errorClasses}>{errors.guests.message}</p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        <label htmlFor="date" className={labelClasses}>
          {t("date")}
        </label>
        <input
          id="date"
          type="date"
          className={inputClasses}
          {...register("date")}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease }}
      >
        <label htmlFor="message" className={labelClasses}>
          {t("message")}
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          className={`${inputClasses} resize-none`}
          {...register("message")}
        />
        {errors.message && (
          <p className={errorClasses}>{errors.message.message}</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease }}
      >
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-gold text-background font-body font-medium tracking-[0.15em] uppercase text-xs px-8 py-5 hover:bg-gold-hover transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? t("sending") : t("submit")}
        </button>
      </motion.div>

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400/80 text-sm text-center"
        >
          {t("error")}
        </motion.p>
      )}
    </form>
  );
}
