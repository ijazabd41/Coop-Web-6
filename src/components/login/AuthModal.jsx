import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiX, FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import * as api from "@/api/apiRoutes";
import { loginSuccess } from "@/redux/slices/userSlice";
import { redirectToRoleDashboard } from "@/lib/dashboardRedirect";
import { pushErrorLog } from "@/utils/errorLogger";

/**
 * Premium login/signup modal that appears when guests try to:
 * - Add items permanently to backend cart
 * - Proceed to checkout
 * - Increase quantity beyond guest session
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onSuccess: (user) => void — called after successful login/register
 */
const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Register form
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const validateLogin = () => {
    const errs = {};
    if (!loginForm.email.trim()) errs.email = "Email is required";
    if (!loginForm.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateRegister = () => {
    const errs = {};
    if (!registerForm.name.trim()) errs.name = "Name is required";
    if (!registerForm.email.trim() && !registerForm.phone.trim()) {
      errs.email = "Email or phone is required";
    }
    if (registerForm.email && !/\S+@\S+\.\S+/.test(registerForm.email)) {
      errs.email = "Invalid email format";
    }
    if (!registerForm.password) errs.password = "Password is required";
    if (registerForm.password.length < 4) errs.password = "Min 4 characters";
    if (registerForm.password !== registerForm.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const res = await api.login({
        id: loginForm.email,
        password: loginForm.password,
        type: loginForm.email.includes("@") ? "email" : "phone",
      });
      if (res.status === 1 && res.data) {
        dispatch(
          loginSuccess({
            jwtToken: res.data.access_token,
            user: res.data.user,
          })
        );
        if (res.data?.cd_mobile_role?.role_code) {
          localStorage.setItem("role_code", res.data.cd_mobile_role.role_code);
          localStorage.setItem("cd_role_code", res.data.cd_mobile_role.role_code);
        } else {
          localStorage.removeItem("role_code");
          localStorage.removeItem("cd_role_code");
        }
        if (redirectToRoleDashboard(res.data)) {
          onClose();
          return;
        }
        toast.success("Welcome back!");
        onSuccess?.(res.data.user);
        onClose();
      } else {
        const msg = res.message || "Login failed";
        if (msg.includes("invalid_password")) {
          setErrors({ password: "Invalid email or password" });
        } else if (msg.includes("not_exist")) {
          setErrors({ email: "Account not found" });
        } else {
          toast.error(msg.replace(/_/g, " "));
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      pushErrorLog({
        error_title: 'AuthModal Login Error',
        error_detail: err.stack || err.message || String(err),
        source: 'web',
        user_email: loginForm.email,
        screen_name: '/auth-modal (Login)',
        priority: '1',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const res = await api.registerUser({
        name: registerForm.name,
        email: registerForm.email,
        mobile: registerForm.phone,
        password: registerForm.password,
        type: registerForm.phone ? "phone" : "email",
      });
      if (res.status === 1 && res.data) {
        dispatch(
          loginSuccess({
            jwtToken: res.data.access_token,
            user: res.data.user,
          })
        );
        toast.success("Account created successfully!");
        onSuccess?.(res.data.user);
        onClose();
      } else {
        const msg = res.message || "Registration failed";
        if (msg.includes("exist")) {
          setErrors({ email: "This account already exists" });
        } else {
          toast.error(msg.replace(/_/g, " "));
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      pushErrorLog({
        error_title: 'AuthModal Register Error',
        error_detail: err.stack || err.message || String(err),
        source: 'web',
        user_email: registerForm.email,
        screen_name: '/auth-modal (Register)',
        priority: '1',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForms = useCallback(() => {
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    setErrors({});
    setShowPassword(false);
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    resetForms();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 animate-slideUp">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header with gradient */}
          <div
            className="relative px-6 pt-8 pb-6 text-center"
            style={{
              background: "linear-gradient(135deg, #D61F26 0%, #B91C1C 50%, #991B1B 100%)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
              <FiUser className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {activeTab === "login"
                ? "Sign in to access your cart & orders"
                : "Join us for the best shopping experience"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === "login"
                  ? "text-[#D61F26] border-b-2 border-[#D61F26]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === "register"
                  ? "text-[#D61F26] border-b-2 border-[#D61F26]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6">
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <InputField
                  icon={FiMail}
                  type="text"
                  placeholder="Email or Phone"
                  value={loginForm.email}
                  onChange={(v) => setLoginForm({ ...loginForm, email: v })}
                  error={errors.email}
                />
                <InputField
                  icon={FiLock}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(v) => setLoginForm({ ...loginForm, password: v })}
                  error={errors.password}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  }
                />
                <SubmitButton loading={loading} text="Sign In" />
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <InputField
                  icon={FiUser}
                  type="text"
                  placeholder="Full Name"
                  value={registerForm.name}
                  onChange={(v) => setRegisterForm({ ...registerForm, name: v })}
                  error={errors.name}
                />
                <InputField
                  icon={FiMail}
                  type="email"
                  placeholder="Email Address"
                  value={registerForm.email}
                  onChange={(v) => setRegisterForm({ ...registerForm, email: v })}
                  error={errors.email}
                />
                <InputField
                  icon={FiPhone}
                  type="tel"
                  placeholder="Phone (optional)"
                  value={registerForm.phone}
                  onChange={(v) => setRegisterForm({ ...registerForm, phone: v })}
                  error={errors.phone}
                />
                <InputField
                  icon={FiLock}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={(v) => setRegisterForm({ ...registerForm, password: v })}
                  error={errors.password}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  }
                />
                <InputField
                  icon={FiLock}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={registerForm.confirmPassword}
                  onChange={(v) => setRegisterForm({ ...registerForm, confirmPassword: v })}
                  error={errors.confirmPassword}
                />
                <SubmitButton loading={loading} text="Create Account" />
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

function InputField({ icon: Icon, type, placeholder, value, onChange, error, suffix }) {
  return (
    <div>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
          error
            ? "border-red-400 bg-red-50 dark:bg-red-900/10"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus-within:border-[#D61F26] focus-within:bg-white dark:focus-within:bg-gray-900"
        }`}
      >
        <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
        />
        {suffix}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}

function SubmitButton({ loading, text }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 disabled:opacity-60 hover:shadow-lg active:scale-[0.98]"
      style={{
        background: "linear-gradient(135deg, #D61F26 0%, #B91C1C 100%)",
      }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : (
        text
      )}
    </button>
  );
}

export default AuthModal;
