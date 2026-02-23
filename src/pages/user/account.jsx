import Header from "@/components/user/Header";
import { useEffect, useState } from "react";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap";

const Icon = ({ d, size = 18, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {Array.isArray(d) ? (
      d.map((p, i) => <path key={i} d={p} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const icons = {
  mail: [
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",
    "M22 6l-10 7L2 6",
  ],
  lock: ["M3 11h18v11H3z", "M7 11V7a5 5 0 0 1 10 0v4"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  user: [
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
    "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  ],
  eye: [
    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z",
    "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  ],
  eyeOff: [
    "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
    "M1 1l22 22",
  ],
  check: ["M20 6L9 17l-5-5"],
  bell: [
    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
    "M13.73 21a2 2 0 0 1-3.46 0",
  ],
  logout: [
    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
    "M16 17l5-5-5-5",
    "M21 12H9",
  ],
  bar: ["M18 20V10", "M12 20V4", "M6 20v-6"],
  circle: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
  menu: ["M3 12h18", "M3 6h18", "M3 18h18"],
  x: ["M18 6L6 18", "M6 6l12 12"],
  chevronDown: ["M6 9l6 6 6-6"],
};

/* ── Toggle ── */
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white ${checked ? "bg-teal-600" : "bg-slate-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

/* ── InputField ── */
function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  hint,
  hintType = "muted",
  readOnly,
  rightSlot,
}) {
  const [focused, setFocused] = useState(false);
  const hintColor = {
    muted: "text-slate-400",
    error: "text-red-500",
    success: "text-teal-600",
  }[hintType];
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
            <Icon d={icons[icon]} size={14} />
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            "w-full rounded-xl border bg-slate-50 py-2.5 text-sm text-slate-700 placeholder-slate-300 transition-all duration-200 outline-none",
            icon ? "pl-10" : "pl-4",
            rightSlot ? "pr-10" : "pr-4",
            readOnly ? "cursor-not-allowed opacity-50" : "",
            focused && !readOnly
              ? "border-teal-500 ring-2 ring-teal-100"
              : "border-slate-200",
          ].join(" ")}
        />
        {rightSlot && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
      {hint && <p className={`text-[11px] mt-0.5 ${hintColor}`}>{hint}</p>}
    </div>
  );
}

/* ── Card ── */
function Card({ children, className = "", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Toast ── */
function Toast({ msg, visible }) {
  return (
    <div
      className={`fixed bottom-6 right-4 z-50 flex items-center gap-3 rounded-xl bg-slate-800 px-5 py-3 text-sm text-slate-100 shadow-xl transition-all duration-300 sm:bottom-8 sm:right-8 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
    >
      <span className="text-teal-400">
        <Icon d={icons.check} size={14} />
      </span>
      {msg}
    </div>
  );
}

/* ── StrengthBar ── */
function StrengthBar({ password }) {
  const hasLen = password.length >= 8;
  const hasUp = /[A-Z]/.test(password);
  const hasNum = /[0-9!@#$%^&*]/.test(password);
  const score = (hasLen ? 1 : 0) + (hasUp ? 1 : 0) + (hasNum ? 1 : 0);
  const barClass =
    ["bg-red-400", "bg-amber-400", "bg-teal-500"][score - 1] || "bg-slate-200";
  const labels = ["", "Weak", "Fair", "Strong"];
  const reqs = [
    { label: "8+ characters", met: hasLen },
    { label: "Uppercase letter", met: hasUp },
    { label: "Number or symbol", met: hasNum },
  ];
  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${password && i < score ? barClass : "bg-slate-200"}`}
          />
        ))}
      </div>
      {password && (
        <p className="text-[11px] text-slate-400">{labels[score]}</p>
      )}
      <div className="space-y-1.5">
        {reqs.map((r) => (
          <div
            key={r.label}
            className={`flex items-center gap-1.5 text-[11px] transition-colors duration-200 ${r.met ? "text-teal-600" : "text-slate-300"}`}
          >
            <Icon d={r.met ? icons.check : icons.circle} size={10} />
            {r.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CardHeader ── */
function CardHeader({ iconKey, title, sub, badge }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-600">
          <Icon d={icons[iconKey]} size={16} />
        </div>
        <div>
          <div className="font-display text-base font-normal text-slate-800 sm:text-lg">
            {title}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>
        </div>
      </div>
      {badge && (
        <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-0.5 text-[10px] font-medium uppercase tracking-widest text-teal-600">
          {badge}
        </span>
      )}
    </div>
  );
}

/* ── BtnRow ── */
function BtnRow({ onCancel, onSave, label }) {
  return (
    <div className="flex justify-end gap-2.5 pt-1">
      <button
        onClick={onCancel}
        className="rounded-xl border border-slate-200 px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="rounded-xl bg-teal-600 px-5 py-2 text-[11px] font-medium uppercase tracking-widest text-white shadow-sm shadow-teal-200 transition-all hover:bg-teal-700 hover:shadow-md hover:shadow-teal-200"
      >
        {label}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════════ */
export default function AccountSettings() {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailHint, setEmailHint] = useState({
    msg: "A verification link will be sent to your new address.",
    type: "muted",
  });
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [pwHint, setPwHint] = useState({ msg: "", type: "muted" });
  const [twoFA, setTwoFA] = useState(true);
  const [loginNotif, setLoginNotif] = useState(true);
  const [bookingNotif, setBookingNotif] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: "" });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const showToast = (msg) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: "" }), 3200);
  };

  const saveEmail = () => {
    if (!newEmail || !confirmEmail)
      return setEmailHint({
        msg: "Please fill in both fields.",
        type: "error",
      });
    if (!/\S+@\S+\.\S+/.test(newEmail))
      return setEmailHint({
        msg: "Please enter a valid email address.",
        type: "error",
      });
    if (newEmail !== confirmEmail)
      return setEmailHint({
        msg: "Email addresses do not match.",
        type: "error",
      });
    setEmailHint({ msg: "Verification sent!", type: "success" });
    showToast("Verification email sent to " + newEmail);
    setNewEmail("");
    setConfirmEmail("");
  };

  const matchHint = () =>
    !confirmPw
      ? { msg: "", type: "muted" }
      : newPw === confirmPw
        ? { msg: "Passwords match ✓", type: "success" }
        : { msg: "Passwords do not match", type: "error" };

  const savePw = () => {
    if (!currentPw) return showToast("Please enter your current password.");
    if (newPw.length < 8)
      return setPwHint({
        msg: "Password must be at least 8 characters.",
        type: "error",
      });
    if (newPw !== confirmPw)
      return setPwHint({ msg: "Passwords do not match.", type: "error" });
    showToast("Password updated successfully.");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwHint({ msg: "", type: "muted" });
  };

  const eyeBtn = (show, setShow) => (
    <button
      onClick={() => setShow(!show)}
      className="text-slate-300 transition-colors hover:text-teal-500"
    >
      <Icon d={show ? icons.eyeOff : icons.eye} size={14} />
    </button>
  );

  const navItems = [
    { label: "Account Security", icon: "user", active: true },
    { label: "Privacy", icon: "lock" },
    { label: "Membership", icon: "bar" },
    { label: "Notifications", icon: "bell" },
    { label: "Sign Out", icon: "logout" },
  ];

  const divider = <div className="my-1 h-px bg-slate-100" />;

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');
        * { box-sizing: border-box; }
        body { background: #f1f5f6; font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #f8fafc inset !important; -webkit-text-fill-color: #374151 !important; }
        input::placeholder { color: #cbd5e1; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f1f5f6; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>

      {/* Faint bg accent */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 400px at 80% 0%, rgba(13,148,136,0.05) 0%, transparent 70%)",
        }}
      />

      {/* ── Nav ── */}
      <Header />

      {/* ── Layout ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-38 sm:px-6 lg:px-8">
        {/* Page title — visible on mobile above grid */}
        <div className="mb-6 lg:hidden">
          <h1 className="font-display text-3xl font-light text-slate-800">
            Settings
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-slate-400">
            Account Preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:h-fit">
            {/* Title — desktop only */}
            <div className="hidden lg:block">
              <h1 className="font-display text-3xl font-light text-slate-800">
                Settings
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-slate-400">
                Account Preferences
              </p>
            </div>

            {/* User card */}
            <Card delay={0} className="p-5 text-center">
              <div className="relative mx-auto mb-3 h-14 w-14 sm:h-16 sm:w-16">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-teal-600 font-display text-xl text-white shadow-md shadow-teal-100 sm:text-2xl">
                  A
                </div>
                <div className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-400">
                  <Icon d={icons.check} size={8} className="text-white" />
                </div>
              </div>
              <div className="font-display text-sm font-normal text-slate-800 sm:text-base">
                Alexandra Mercer
              </div>
              <div className="mt-2 inline-block rounded-full border border-teal-100 bg-teal-50 px-3 py-0.5 text-[10px] uppercase tracking-widest text-teal-600">
                Gold Member
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                a.mercer@example.com
              </div>
            </Card>

            {/* Sidebar nav — horizontal scroll on mobile, vertical on desktop */}
            <Card delay={80} className="overflow-hidden">
              {/* Mobile: horizontal scrollable pill list */}
              <div className="flex gap-2 overflow-x-auto p-3 lg:hidden">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-colors ${item.active ? "bg-teal-50 text-teal-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"}`}
                  >
                    <Icon d={icons[item.icon]} size={13} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </a>
                ))}
              </div>

              {/* Desktop: vertical list */}
              <div className="hidden lg:block">
                {navItems.map((item, idx) => (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${idx < navItems.length - 1 ? "border-b border-slate-100" : ""} ${item.active ? "border-l-2 border-l-teal-500 bg-teal-50 pl-3.5 text-teal-600" : "border-l-2 border-l-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-700"}`}
                  >
                    <Icon d={icons[item.icon]} size={14} />
                    <span className="tracking-wide">{item.label}</span>
                  </a>
                ))}
              </div>
            </Card>
          </aside>

          {/* ── Main ── */}
          <main className="flex flex-col gap-5">
            {/* Email Card */}
            <Card delay={120}>
              <CardHeader
                iconKey="mail"
                title="Email Address"
                sub="Manage your login email"
                badge="Verified"
              />
              <div className="space-y-4 p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="Current Email"
                    type="email"
                    value="a.mercer@example.com"
                    icon="mail"
                    readOnly
                  />
                  <InputField
                    label="New Email Address"
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    icon="mail"
                  />
                </div>
                <InputField
                  label="Confirm New Email"
                  type="email"
                  placeholder="Re-enter new email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  icon="mail"
                  hint={emailHint.msg}
                  hintType={emailHint.type}
                />
                {divider}
                <BtnRow
                  onCancel={() => {
                    setNewEmail("");
                    setConfirmEmail("");
                    setEmailHint({
                      msg: "A verification link will be sent to your new address.",
                      type: "muted",
                    });
                  }}
                  onSave={saveEmail}
                  label="Update Email"
                />
              </div>
            </Card>

            {/* Password Card */}
            <Card delay={200}>
              <CardHeader
                iconKey="lock"
                title="Password"
                sub="Keep your account secure"
              />
              <div className="space-y-4 p-5 sm:p-6">
                <InputField
                  label="Current Password"
                  type={showCur ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  icon="lock"
                  rightSlot={eyeBtn(showCur, setShowCur)}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <InputField
                      label="New Password"
                      type={showNew ? "text" : "password"}
                      placeholder="Create new password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      icon="lock"
                      rightSlot={eyeBtn(showNew, setShowNew)}
                    />
                    {newPw && <StrengthBar password={newPw} />}
                  </div>
                  <InputField
                    label="Confirm Password"
                    type={showConf ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    icon="lock"
                    rightSlot={eyeBtn(showConf, setShowConf)}
                    hint={matchHint().msg}
                    hintType={matchHint().type}
                  />
                </div>
                {pwHint.msg && (
                  <p
                    className={`text-[11px] ${pwHint.type === "error" ? "text-red-500" : "text-teal-600"}`}
                  >
                    {pwHint.msg}
                  </p>
                )}
                {divider}
                <BtnRow
                  onCancel={() => {
                    setCurrentPw("");
                    setNewPw("");
                    setConfirmPw("");
                    setPwHint({ msg: "", type: "muted" });
                  }}
                  onSave={savePw}
                  label="Update Password"
                />
              </div>
            </Card>

            {/* Security Card */}
            <Card delay={280}>
              <CardHeader
                iconKey="shield"
                title="Security & Access"
                sub="Additional layers of protection"
              />
              <div className="divide-y divide-slate-100 px-5 sm:px-6">
                {[
                  {
                    label: "Two-Factor Authentication",
                    desc: "Require a code via SMS or authenticator each time you sign in.",
                    val: twoFA,
                    set: setTwoFA,
                  },
                  {
                    label: "Login Notifications",
                    desc: "Get an email alert when a new device accesses your account.",
                    val: loginNotif,
                    set: setLoginNotif,
                  },
                  {
                    label: "Booking Confirmations",
                    desc: "Receive emails for restaurant, hotel and club reservations.",
                    val: bookingNotif,
                    set: setBookingNotif,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-700">
                        {item.label}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                    <Toggle checked={item.val} onChange={item.set} />
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="m-5 rounded-xl border border-red-100 bg-red-50 p-4 sm:m-6">
                <p className="mb-1.5 text-[10px] uppercase tracking-widest text-red-300">
                  Danger Zone
                </p>
                <p className="mb-3 text-[11px] leading-relaxed text-red-300">
                  Permanently removes all reservation history, saved venues and
                  membership rewards. This cannot be undone.
                </p>
                <button className="rounded-lg border border-red-200 px-3.5 py-1.5 text-[11px] uppercase tracking-wider text-red-400 transition-colors hover:border-red-300 hover:bg-red-100 hover:text-red-500">
                  Delete Account
                </button>
              </div>
            </Card>
          </main>
        </div>
      </div>

      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}
