import Header from "@/components/user/Header";
import { logout } from "@/redux/slices/authSlice";
import { capitalize } from "@/utils/helper";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "@/services/user.service";

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
  camera: [
    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z",
    "M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  ],
  trash: ["M3 6h18", "M19 6l-1 14H6L5 6", "M8 6V4h8v2"],
  upload: [
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    "M17 8l-5-5-5 5",
    "M12 3v12",
  ],
  circle: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
  x: ["M18 6L6 18", "M6 6l12 12"],
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
          <div className=" text-base font-normal text-slate-800 sm:text-lg">
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

/* ── SignOut Confirm Modal ── */
function SignOutModal({ visible, onCancel, onConfirm }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <Icon d={icons.logout} size={20} />
        </div>
        <h3 className=" text-lg font-normal text-slate-800">Sign out?</h3>
        <p className="mt-1.5 text-[13px] text-slate-400">
          You'll be logged out of your account on this device.
        </p>
        <div className="mt-5 flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-[11px] font-medium uppercase tracking-widest text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-[11px] font-medium uppercase tracking-widest text-white shadow-sm shadow-red-100 transition-all hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Avatar Editor ── */
function AvatarEditor({
  avatar,
  firstName,
  lastName,
  onAvatarChange,
  uploadRef,
}) {
  const fileInputRef = useRef(null);
  // expose trigger to parent
  useEffect(() => {
    if (uploadRef) uploadRef.current = () => fileInputRef.current?.click();
  }, [uploadRef]);
  const [dragging, setDragging] = useState(false);

  // const initials = name
  //   .split(" ")
  //   .map((n) => n[0])
  //   .join("")
  //   .toUpperCase()
  //   .slice(0, 2);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      onAvatarChange({
        preview: e.target.result,
        file,
      });
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="group relative mx-auto w-fit">
      <div
        className={`relative h-24 w-24 cursor-pointer rounded-full ring-4 ring-white shadow-xl transition-all duration-200 ${dragging ? "ring-teal-400 scale-105" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Profile"
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full uppercase items-center justify-center rounded-full bg-teal-600  text-3xl text-white">
            {firstName[0]} {lastName[0]}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Icon d={icons.camera} size={18} className="text-white" />
          <span className="mt-1 text-[9px] font-medium uppercase tracking-widest text-white">
            Change
          </span>
        </div>

        {/* Online badge */}
        <div className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-400">
          <Icon d={icons.check} size={8} className="text-white" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════════ */
export default function AccountSettings() {
  const [avatar, setAvatar] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const uploadRef = useRef(null);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [pwHint, setPwHint] = useState({ msg: "", type: "muted" });
  const [toast, setToast] = useState({ visible: false, msg: "" });
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user.isAuthenticated) {
          setProfile(user.user);
          if (user.user?.profilePic) {
            setAvatar(user.user.profilePic);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, [user.isAuthenticated, user.user]);
  console.log(profile);
  const showToast = (msg) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: "" }), 3200);
  };

  const matchHint = () =>
    !confirmPw
      ? { msg: "", type: "muted" }
      : newPw === confirmPw
        ? { msg: "Passwords match ✓", type: "success" }
        : { msg: "Passwords do not match", type: "error" };

  const savePw = async ()  => {
    if (!currentPw) return showToast("Please enter your current password.");
    if (newPw.length < 8)
      return setPwHint({
        msg: "Password must be at least 8 characters.",
        type: "error",
      });
    if (newPw !== confirmPw)
      return setPwHint({ msg: "Passwords do not match.", type: "error" });
    try{
     const res = await userService.updatePassword({
      currentPassword: currentPw,
      newPassword: newPw
     });
     if(res.status === 200)[
      toast.success(res.data.message || "Password Change succesful")
     ]
    } catch (error) {
      console.error(error)
      toast.error(error || "Password Change Failed")
    }
    showToast("Password updated successfully.");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwHint({ msg: "", type: "muted" });
  };

  const handleAvatarChange = async (payload) => {
    // Handle remove
    if (!payload) {
      setAvatar(null);
      try {
        setAvatarUploading(true);
        // Optional: backend may also support removing picture (not specified)
        // For now, just clear locally and show toast.
        showToast("Profile picture removed.");
      } finally {
        setAvatarUploading(false);
      }
      return;
    }

    const { preview, file } = payload;
    if (!file) return;

    // Optimistic preview
    setAvatar(preview);

    try {
      setAvatarUploading(true);
      const res = await userService.updateProfilePicture(file);

      if (res?.profilePic) {
        setAvatar(res.profilePic);
        setProfile((prev) =>
          prev ? { ...prev, profilePic: res.profilePic } : prev,
        );
      }

      showToast("Profile picture updated successfully.");
    } catch (error) {
      console.error("Failed to update profile picture", error);
      showToast("Failed to update profile picture. Please try again.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSignOut = () => {
    setShowSignOutModal(false);
    showToast("Signed out successfully.");

    dispatch(logout());
    setProfile(null);
    // Add actual sign-out logic here (e.g., router.push('/login'))
  };

  const eyeBtn = (show, setShow) => (
    <button
      onClick={() => setShow(!show)}
      className="text-slate-300 transition-colors hover:text-teal-500"
    >
      <Icon d={show ? icons.eyeOff : icons.eye} size={14} />
    </button>
  );

  const divider = <div className="my-1 h-px bg-slate-100" />;

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');
        * { box-sizing: border-box; }
        body { background: #f1f5f6; font-family: 'DM Sans', sans-serif; }
        . { font-family: 'Playfair Display', serif; }
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

      {/* NAVBAR */}
      <Header />
      {/* ── Layout ── */}
      <div className="relative z-10 mx-auto max-w-5xl mt-20 px-4 py-16 sm:px-6 lg:px-8">
        {/* Page title — visible on mobile above grid */}
        <div className="mb-6 lhidden">
          <h1 className=" text-3xl font-light text-slate-800">Settings</h1>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-slate-400">
            Account Preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:h-fit">
            {/* Title — desktop only */}
            {/* <div className="hidden lg:block">
              <h1 className=" text-3xl font-light text-slate-800">
                Settings
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-slate-400">
                Account Preferences
              </p>
            </div> */}

            {/* User card */}
            <Card delay={0} className="overflow-hidden">
              {/* Decorative top band */}
              <div className="h-16 w-full bg-gradient-to-br from-teal-500 to-teal-700" />

              <div className="px-4 pb-6">
                {/* Avatar — overlaps the band */}
                <div className="-mt-10 mb-4 flex justify-center">
                  <AvatarEditor
                    avatar={avatar}
                    // name={`${profile.firstName} ${profile.lastName}`}
                    firstName={profile?.firstName  ?? "--"}
                    lastName={profile?.lastName  ?? "--"}
                    onAvatarChange={handleAvatarChange}
                    uploadRef={uploadRef}
                  />
                </div>

                {/* User info */}
                <div className="text-center">
                  <div className="shrink-0 text-xl font-normal text-slate-800">
                    {capitalize(profile?.firstName)}{" "}
                    {capitalize(profile?.lastName)}
                  </div>
                  <div className="mt-1 text-[12px] text-slate-400">
                    {/* {profile.email} */}
                  </div>
                  {/* <div className="mt-3 inline-block rounded-full border border-teal-100 bg-teal-50 px-4 py-1 text-[10px] uppercase tracking-widest text-teal-600">
                    Gold Member
                  </div> */}
                </div>

                {/* Upload / Remove buttons */}
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => !avatarUploading && uploadRef.current?.()}
                    className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-teal-600 transition-colors hover:bg-teal-100 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={avatarUploading}
                  >
                    <Icon d={icons.upload} size={11} />
                    {avatarUploading ? "Uploading..." : "Upload Photo"}
                  </button>
                  {avatar && (
                    <button
                      onClick={() => handleAvatarChange(null)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-red-400 transition-colors hover:bg-red-100"
                    >
                      <Icon d={icons.trash} size={11} />
                      Remove
                    </button>
                  )}
                </div>

                <p className="mt-2 text-center text-[10px] text-slate-300">
                  JPG, PNG or GIF · Max 5 MB
                </p>

                {/* Divider */}
                <div className="my-5 h-px bg-slate-100" />

                {/* Sign Out Button */}
                <button
                  onClick={() => setShowSignOutModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-[11px] font-medium uppercase tracking-widest text-red-400 transition-all hover:border-red-200 hover:bg-red-100 hover:text-red-500"
                >
                  <Icon d={icons.logout} size={13} />
                  Sign Out
                </button>
              </div>
            </Card>
          </aside>

          {/* ── Main ── */}
          <main className="flex flex-col gap-5">
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
          </main>
        </div>
      </div>

      <Toast msg={toast.msg} visible={toast.visible} />
      <SignOutModal
        visible={showSignOutModal}
        onCancel={() => setShowSignOutModal(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
}

 