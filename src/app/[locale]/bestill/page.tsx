"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type Step = "date" | "details" | "confirm" | "success";

export default function BookingPage() {
  const t = useTranslations("bookingPage");

  const [step, setStep] = useState<Step>("date");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const [rangeMode, setRangeMode] = useState(false);

  // Form state
  const [pkg, setPkg] = useState<string>("premium");
  const [eventType, setEventType] = useState<string>("");
  const [guestCount, setGuestCount] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [wantsCallback, setWantsCallback] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchDates = useCallback(async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const start = new Date(year, month, 1).toISOString().split("T")[0];
    const end = new Date(year, month + 1, 0).toISOString().split("T")[0];

    try {
      const res = await fetch(`/api/calendar?start=${start}&end=${end}`);
      const data = await res.json();
      setBlockedDates(data.blockedDates ?? []);
      setBookedDates(data.bookedDates ?? []);
    } catch {
      // Fail silently — calendar still works, just no blocked/booked indicators
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchDates();
  }, [fetchDates]);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          end_date: selectedEndDate,
          package: pkg,
          guest_count: guestCount,
          event_type: eventType,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          wants_callback: wantsCallback,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("form.error"));
        setSubmitting(false);
        return;
      }

      setStep("success");
    } catch {
      setError(t("form.error"));
    }
    setSubmitting(false);
  };

  // Calendar rendering
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
  const today = new Date().toISOString().split("T")[0];

  const days: (number | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getDateStr = (day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const monthNames = [
    "Januar", "Februar", "Mars", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Desember",
  ];

  const isFormValid =
    selectedDate && pkg && eventType && guestCount && name && email && consentGiven;

  return (
    <>
      {/* Hero */}
      <section className="pt-48 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-[11px] tracking-[0.25em] uppercase text-gold mb-6"
          >
            {t("hero.label")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1]"
          >
            {t("hero.heading")}
          </motion.h1>
        </div>
      </section>

      {/* Booking flow */}
      <section className="pb-40 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {step === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center border border-border bg-background-card p-16"
              >
                <div className="w-16 h-px bg-gold mx-auto mb-8" />
                <h2 className="font-display font-light text-3xl text-text-primary mb-4">
                  {t("success.heading")}
                </h2>
                <p className="text-text-muted text-lg leading-relaxed max-w-md mx-auto">
                  {t("success.text")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border bg-background-card"
              >
                {/* Step indicators */}
                <div className="flex border-b border-border">
                  {(["date", "details", "confirm"] as Step[]).map((s, i) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (s === "date") setStep("date");
                        if (s === "details" && selectedDate) setStep("details");
                        if (s === "confirm" && isFormValid) setStep("confirm");
                      }}
                      className={`flex-1 py-4 text-[11px] tracking-[0.2em] uppercase text-center border-b-2 transition-colors cursor-pointer ${
                        step === s
                          ? "border-gold text-gold"
                          : "border-transparent text-text-muted"
                      }`}
                    >
                      {i + 1}. {t(`steps.${s}`)}
                    </button>
                  ))}
                </div>

                <div className="p-8 md:p-12">
                  {/* Step 1: Date */}
                  {step === "date" && (
                    <div>
                      <h2 className="font-display font-light text-2xl text-text-primary mb-2">
                        {t("calendar.heading")}
                      </h2>
                      <p className="text-text-muted text-sm mb-8">
                        {t("calendar.subheading")}
                      </p>

                      {/* Month nav */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => setCurrentMonth(new Date(year, month - 1))}
                          className="text-text-muted hover:text-text-primary transition-colors cursor-pointer px-3 py-1"
                        >
                          &larr;
                        </button>
                        <span className="text-sm font-medium">
                          {monthNames[month]} {year}
                        </span>
                        <button
                          onClick={() => setCurrentMonth(new Date(year, month + 1))}
                          className="text-text-muted hover:text-text-primary transition-colors cursor-pointer px-3 py-1"
                        >
                          &rarr;
                        </button>
                      </div>

                      {/* Calendar */}
                      <div className="border border-border">
                        <div className="grid grid-cols-7">
                          {["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"].map((d) => (
                            <div key={d} className="p-2 text-center text-[10px] tracking-wider uppercase text-text-muted border-b border-border">
                              {d}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7">
                          {days.map((day, i) => {
                            if (!day) {
                              return <div key={`e-${i}`} className="p-3 min-h-[48px]" />;
                            }

                            const dateStr = getDateStr(day);
                            const isPast = dateStr < today;
                            const isBlocked = blockedDates.includes(dateStr);
                            const isBooked = bookedDates.includes(dateStr);
                            const isAvailable = !isPast && !isBlocked && !isBooked;
                            const isSelected = selectedDate === dateStr;
                            const isEndSelected = selectedEndDate === dateStr;
                            const isInRange = rangeMode && selectedDate && selectedEndDate &&
                              dateStr > selectedDate && dateStr < selectedEndDate;

                            const handleDateClick = () => {
                              if (!isAvailable) return;
                              if (rangeMode) {
                                if (!selectedDate || (selectedDate && selectedEndDate)) {
                                  setSelectedDate(dateStr);
                                  setSelectedEndDate(null);
                                } else if (dateStr > selectedDate) {
                                  setSelectedEndDate(dateStr);
                                } else {
                                  setSelectedDate(dateStr);
                                  setSelectedEndDate(null);
                                }
                              } else {
                                setSelectedDate(dateStr);
                                setSelectedEndDate(null);
                              }
                            };

                            return (
                              <button
                                key={day}
                                onClick={handleDateClick}
                                disabled={!isAvailable}
                                className={`p-3 min-h-[48px] text-center text-sm transition-all ${
                                  isSelected || isEndSelected
                                    ? "bg-gold text-background font-medium cursor-pointer"
                                    : isInRange
                                      ? "bg-gold/20 text-gold cursor-pointer"
                                      : isBooked
                                      ? "text-text-muted/50 cursor-not-allowed bg-text-muted/[0.03]"
                                      : isAvailable
                                        ? "text-text-primary hover:bg-gold/10 cursor-pointer"
                                        : "text-text-muted/30 cursor-not-allowed"
                                }`}
                              >
                                <span>{day}</span>
                                {isBooked && (
                                  <div className="w-1.5 h-1.5 bg-text-muted/30 mx-auto mt-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-6 text-[11px] text-text-muted">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border border-border" /> {t("calendar.available")}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-text-muted/30 mx-0.5" /> {t("calendar.booked")}
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-[11px] text-text-muted cursor-pointer">
                          <input type="checkbox" checked={rangeMode} onChange={(e) => { setRangeMode(e.target.checked); setSelectedEndDate(null); }} className="accent-[#C9A84C]" />
                          {t("calendar.multiDay")}
                        </label>
                      </div>

                      {selectedDate && (
                        <button
                          onClick={() => setStep("details")}
                          className="w-full mt-8 bg-gold text-background py-4 text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold-hover transition-colors cursor-pointer"
                        >
                          {t("calendar.next")} &rarr;
                        </button>
                      )}
                    </div>
                  )}

                  {/* Step 2: Details */}
                  {step === "details" && (
                    <div className="space-y-6">
                      <h2 className="font-display font-light text-2xl text-text-primary mb-6">
                        {t("form.heading")}
                      </h2>

                      {/* Package selection */}
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-text-muted mb-3">
                          {t("form.package")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {(["basis", "premium", "eksklusiv"] as const).map((p) => (
                            <button
                              key={p}
                              onClick={() => setPkg(p)}
                              className={`py-4 border text-center text-sm transition-all cursor-pointer ${
                                pkg === p
                                  ? "border-gold text-gold bg-gold/5"
                                  : "border-border text-text-muted hover:border-border-gold"
                              }`}
                            >
                              {t(`form.packages.${p}`)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Event type */}
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-text-muted mb-2">
                          {t("form.eventType")}
                        </label>
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          className="w-full bg-background border border-border px-4 py-3 text-sm text-text-primary outline-none focus:border-border-gold transition-colors cursor-pointer"
                        >
                          <option value="">{t("form.selectType")}</option>
                          <option value="wedding">{t("form.types.wedding")}</option>
                          <option value="corporate">{t("form.types.corporate")}</option>
                          <option value="private">{t("form.types.private")}</option>
                          <option value="other">{t("form.types.other")}</option>
                        </select>
                      </div>

                      {/* Guest count */}
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-text-muted mb-2">
                          {t("form.guests")}
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          className="w-full bg-background border border-border px-4 py-3 text-sm text-text-primary outline-none focus:border-border-gold transition-colors cursor-pointer"
                        >
                          <option value="">{t("form.selectGuests")}</option>
                          <option value="Under 50">{t("form.guestRanges.small")}</option>
                          <option value="50-100">{t("form.guestRanges.medium")}</option>
                          <option value="100-200">{t("form.guestRanges.large")}</option>
                          <option value="Over 200">{t("form.guestRanges.xlarge")}</option>
                        </select>
                      </div>

                      {/* Contact info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] tracking-[0.2em] uppercase text-text-muted mb-2">
                            {t("form.name")}
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background border border-border px-4 py-3 text-sm text-text-primary outline-none focus:border-border-gold transition-colors"
                            placeholder={t("form.namePlaceholder")}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] tracking-[0.2em] uppercase text-text-muted mb-2">
                            {t("form.email")}
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-border px-4 py-3 text-sm text-text-primary outline-none focus:border-border-gold transition-colors"
                            placeholder={t("form.emailPlaceholder")}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-text-muted mb-2">
                          {t("form.phone")}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-background border border-border px-4 py-3 text-sm text-text-primary outline-none focus:border-border-gold transition-colors"
                          placeholder={t("form.phonePlaceholder")}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-text-muted mb-2">
                          {t("form.message")}
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="w-full bg-background border border-border px-4 py-3 text-sm text-text-primary outline-none focus:border-border-gold transition-colors resize-none"
                          placeholder={t("form.messagePlaceholder")}
                        />
                      </div>

                      {/* Callback checkbox */}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={wantsCallback}
                          onChange={(e) => setWantsCallback(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border border-border peer-checked:border-gold peer-checked:bg-gold/10 flex items-center justify-center transition-colors">
                          {wantsCallback && <span className="text-gold text-xs">&#10003;</span>}
                        </div>
                        <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">
                          {t("form.callback")}
                        </span>
                      </label>

                      {/* GDPR consent */}
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={consentGiven}
                          onChange={(e) => setConsentGiven(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 mt-0.5 border border-border peer-checked:border-gold peer-checked:bg-gold/10 flex items-center justify-center transition-colors shrink-0">
                          {consentGiven && <span className="text-gold text-xs">&#10003;</span>}
                        </div>
                        <span className="text-xs text-text-muted leading-relaxed">
                          {t("form.consent")}
                        </span>
                      </label>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setStep("date")}
                          className="flex-1 border border-border py-4 text-xs font-medium tracking-[0.15em] uppercase text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                        >
                          &larr; {t("form.back")}
                        </button>
                        <button
                          onClick={() => isFormValid && setStep("confirm")}
                          disabled={!isFormValid}
                          className="flex-1 bg-gold text-background py-4 text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t("form.next")} &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirm */}
                  {step === "confirm" && (
                    <div>
                      <h2 className="font-display font-light text-2xl text-text-primary mb-8">
                        {t("confirm.heading")}
                      </h2>

                      <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("confirm.date")}</p>
                            <p className="text-text-primary">
                              {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("no-NO", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("confirm.package")}</p>
                            <p className="text-text-primary capitalize">{pkg}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("confirm.type")}</p>
                            <p className="text-text-primary">{t(`form.types.${eventType}`)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("confirm.guests")}</p>
                            <p className="text-text-primary">{guestCount}</p>
                          </div>
                        </div>

                        <div className="border-t border-border pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("confirm.name")}</p>
                              <p className="text-text-primary">{name}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("confirm.email")}</p>
                              <p className="text-text-primary">{email}</p>
                            </div>
                          </div>
                          {phone && (
                            <div className="mt-4">
                              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("confirm.phone")}</p>
                              <p className="text-text-primary">{phone}</p>
                            </div>
                          )}
                        </div>

                        {message && (
                          <div className="border-t border-border pt-4">
                            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("confirm.message")}</p>
                            <p className="text-text-muted">{message}</p>
                          </div>
                        )}

                        {wantsCallback && (
                          <p className="text-gold text-[11px]">{t("form.callback")}</p>
                        )}
                      </div>

                      {error && (
                        <p className="text-red-400 text-sm mt-4">{error}</p>
                      )}

                      <div className="flex gap-3 pt-8">
                        <button
                          onClick={() => setStep("details")}
                          className="flex-1 border border-border py-4 text-xs font-medium tracking-[0.15em] uppercase text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                        >
                          &larr; {t("form.back")}
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="flex-1 bg-gold text-background py-4 text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold-hover transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {submitting ? t("form.sending") : t("form.submit")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
