import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  MailCheck,
} from "lucide-react";
import api from "../api/axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [timer, setTimer] = useState(0);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    localStorage.getItem("pending_email") ||
    "your email";

  /* ===============================
     HANDLE OTP INPUT
  =============================== */
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  /* ===============================
     VERIFY OTP → REDIRECT TO LOGIN
  =============================== */
  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length < 6) {
      return setError("Please enter the full 6-digit code.");
    }

    setError(null);
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await api.post("/auth/verify-otp", {
        email,
        otp: otpString,
      });

      setSuccessMsg("Account verified successfully ");
      setOtp(new Array(6).fill(""));

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ===============================
     RESEND OTP (60 SECOND TIMER)
  =============================== */
  const startResendTimer = () => {
    setTimer(60);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendCode = async () => {
    if (timer > 0 || isResending) return;

    setError(null);
    setSuccessMsg("");
    setIsResending(true);

    try {
      await api.post("/auth/resend-otp", { email });
      setSuccessMsg("A new verification code has been sent.");
      startResendTimer();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to resend code right now.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    return `0:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-emerald-100 dark:border-emerald-800 p-10 rounded-[3.5rem] shadow-2xl shadow-emerald-200/50"
      >
        <button
          onClick={() => navigate("/register")}
          className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-8 hover:opacity-70 transition-all"
        >
          <ArrowLeft size={16} /> Edit Email
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl text-white">
            <KeyRound size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Verify Account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
            Enter the 6-digit code sent to <br />
            <span className="font-bold text-emerald-600">{email}</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-200 dark:border-red-800"
            >
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center gap-3 text-xs font-bold border border-emerald-200 dark:border-emerald-800"
            >
              <MailCheck size={18} /> {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleVerify} className="space-y-10">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-3xl font-black rounded-2xl 
                           bg-emerald-100 dark:bg-slate-800 
                           border-2 border-emerald-200 dark:border-slate-700
                           text-emerald-900 dark:text-white
                           focus:bg-white dark:focus:bg-emerald-900 
                           focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 
                           outline-none transition-all shadow-md"
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-500/40 flex items-center justify-center gap-3 disabled:bg-emerald-300"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={22} /> VERIFY
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 text-center space-y-2">
          <button
            type="button"
            onClick={resendCode}
            disabled={timer > 0 || isResending}
            className={`flex items-center justify-center gap-2 mx-auto text-sm font-bold transition-all ${
              timer > 0 || isResending
                ? "text-slate-400 cursor-not-allowed"
                : "text-emerald-600 hover:underline hover:text-emerald-700"
            }`}
          >
            {isResending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RotateCcw size={18} />
            )}
            {isResending ? "Sending Code..." : "Resend OTP"}
          </button>

          {timer > 0 && (
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              You can request a new code in{" "}
              <span className="text-emerald-600 font-bold">
                {formatTime(timer)}
              </span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
