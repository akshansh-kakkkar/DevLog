"use client";
import { authClient, useSession } from "@/lib/auth-client";
import { Session } from "better-auth";
import {
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  Loader2,
  Mail,
  MonitorSmartphone,
  ShieldAlert,
} from "lucide-react";
import { Geist, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const geist = Geist({
  subsets: ["latin"],
});
const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
});
type UserSession = Session & {
  location?: string;
};
export default function Security() {
  const router = useRouter();
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPasswrd, setConfirmNewPasswrd] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [togglePassword, setTogglePassword] = useState(true);
  const [togglePasseyeConfirmnew, setTogglePasseyeConfirmnew] = useState(true);
  const [togglePassEyeNew, setTogglePassEyeNew] = useState(true);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { data: session } = useSession();
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);
  const toggleEyePass = () => {
    setTogglePassword((prev) => !prev);
  };
  const toggleEyePassNew = () => {
    setTogglePassEyeNew((prev) => !prev);
  };
  const togglePassEyeConfirm = () => {
    setTogglePasseyeConfirmnew((prev) => !prev);
  };
  const handleChangePassword = async () => {
    if (newPassword === currentPassword) {
      toast.error("new password should not match current password.");
      return;
    }
    if (newPassword !== confirmNewPasswrd) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      setIsChangingPassword(true);
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      await fetch("/api/security/passwordchanged", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
        }),
      });
      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      toast.success(
        <div>
          <span> Password updated successfully. </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://github.com/akshansh-kakkkar"
          >
            Hire this smart guy
          </a>
        </div>,
      );
      setCurrentPassword("");
      setConfirmNewPasswrd("");
      setNewPassword("");
    } catch (error) {
      toast.error(
        "Something went wrong please try again this is not my fault.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/security/sessions");
        const data = await response.json();
        setSessions(data.sessions);
      } catch (error) {
        toast.error(`Something Went Wrong. This is clearly not my fault`);
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchSessions();
  }, []);
  const handleRevokeSessions = async () => {
    try {
      const response = await fetch(`/api/security/sessions`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        toast.error(
          "Failed to revoke sessions. Try refreshing the page this is not my fault.",
        );
        return;
      }
      if (response.ok) {
        router.push("/");
      }
      toast.success(
        <div>
          <span> Active sessions fetched Successfully. </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            href="https://github.com/akshansh-kakkkar"
          >
            Hire this smart guy
          </a>
        </div>,
      );
    } catch (error) {
      toast.error(`Something Went Wrong. This is clearly not my fault`);
    } finally {
      setLoadingSessions(false);
    }
  };
  const [isSocialUser, setIsSocialUser] = useState(false);
  useEffect(() => {
    fetch("/api/security/provider")
      .then((res) => res.json())
      .then((data) => setIsSocialUser(data.isSocialUser));
  }, []);

  const handleChangeEmail = async () => {
    try{
    setIsUpdatingEmail(true)
    const OtpValue = otp.join("");
    const response = await fetch("/api/security/verifyemailotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newEmail,
        otp: OtpValue,
      }),
    });
    if (!response.ok) {
      toast.error("Invalid OTP");
      return;
    }

    toast.success("Email updated successfully.");
    setNewEmail("");
    setConfirmEmail("");
    setOtp(["", "", "", "", "", ""]);
    window.location.reload()
  }
  catch(error){
    return toast.error("Something went wrong this is not my fault try to refresh.")
  }
  finally{
    setIsUpdatingEmail(false)
  }
  };
  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      if (newEmail !== confirmEmail) {
        toast.error("Emails do not match.");
        return;
      }
      const OtpValue = otp.join("");
      const response = await fetch("/api/security/sendemailotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail,
          otp: OtpValue,
        }),
      });
      if (!response.ok) {
        toast.error("Can't send the otp this is not my fault :(");
      }
      if (response.ok) {
        toast.success("OTP Sent");
        setCooldown(60)
      }

    } catch (error) {
      return toast.error("OTP failed to send.");
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const previousInput = document.getElementById(`otp-${index - 1}`);
      previousInput?.focus();
    }
  };
  const isCompleteOtp = otp.every((digit)=> digit !== "")
  return (
    <div className="flex flex-col gap-8">
      <div className="flex  sm:justify-start justify-center flex-col gap-4 border-[#C6C6CD] border-b-2 pb-2 ">
        <div
          className={`${geist.className} text-[#2D2D2D] text-4xl font-semibold`}
        >
          Security Settings
        </div>
        <div className={`${geist.className} text-[#45464D]`}>
          Manage your account, security, passwords and active sessions.
        </div>
      </div>
      <div className="lg:grid flex flex-col lg:grid-cols-3 gap-7 ">
        <div className="col-span-2 flex flex-col gap-8">
          <div className="bg-white border px-8 flex flex-col gap-4 py-12 w-full  rounded-lg  border-[#C6C6CD]">
            <div className="flex gap-4 flex-col">
              <div className="flex gap-2 items-center">
                <span>
                  <Mail strokeWidth={2} size={32} className="text-[#191C1E]" />
                </span>
                <span
                  className={`text-2xl ${geist.className} text-[#191C1E] font-semibold`}
                >
                  Change Email
                </span>
              </div>{" "}
              <div className={`${geist.className} text-[#45464D] text-md`}>
                update the primary email address associated with the account.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className={`${jetBrains.className} font-[600] text-[#191C1E]`}
              >
                Current Email Address
              </label>
              <input
                value={session?.user?.email || ""}
                readOnly
                className="rounded-sm bg-[#F2F4F6] border   border-[#C6C6CD] p-2 "
                type="text"
                placeholder="current@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className={`${jetBrains.className} font-[600] text-[#191C1E]`}
              >
                New Email Address
              </label>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="rounded-sm  bg-[#F2F4F6] border border-[#C6C6CD] p-2"
                type="text"
                placeholder="new@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className={`${jetBrains.className} font-[600] text-[#191C1E]`}
              >
                Confirm Email Address
              </label>
              <input
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="rounded-sm bg-[#F2F4F6] border border-[#C6C6CD] p-2 ]"
                type="text"
                placeholder="new@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className={`${jetBrains.className} font-[600] text-[#191C1E]`}
              >
                One Time Password (OTP)
              </label>
              <div className="flex gap-2 md:gap-4">
                <div className="flex items-center gap-1 md:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      value={digit}
                      maxLength={1}
                      inputMode="numeric"
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="rounded-sm md:w-14 md:h-14 h-7 w-7 border flex justify-center items-center text-center  tracking-widest bg-[#F2F4F6]  border-[#C6C6CD] p-2"
                      type="text"
                    />
                  ))}
                </div>
                <button
                  disabled={isSendingOtp || cooldown > 0}
                  onClick={handleSendOtp}

                  className={`border-[#00687A] border-2 md:px-8 py-1 px-2 font-bold md:py-2 text-[#00687A] text-sm md:text-xl rounded-sm text-md w-fit ${jetBrains.className} ${isSendingOtp || cooldown > 0 ? "opacity-50 cursor-not-allowed" : " hover:cursor-pointer hover:bg-[#00687A] hover:text-[#ffffff]"}`}
                >
                  {isSendingOtp ? "Sending" : cooldown > 0 ? `${cooldown}s` : "SEND"}

                </button>
              </div>
            </div>
            <button
              onClick={ handleChangeEmail}
              disabled={!isCompleteOtp ||isUpdatingEmail}
              className={`bg-[#00687A] px-5 py-3 text-white rounded-sm text-xl transition-all w-fit ${jetBrains.className} ${isUpdatingEmail || !isCompleteOtp ? "opacity-50 cursor-not-allowed" : "hover:bg-[#00687a94] hover:cursor-pointer"}`}
            >
              {isUpdatingEmail ? "Updating..." : "Update Email"}            </button>
          </div>
          <div className="bg-white border px-8 flex flex-col gap-4 py-12 w-full  rounded-lg  border-[#C6C6CD]">
            <div className="flex gap-4 flex-col">
              <div className="flex gap-2 items-center">
                <span>
                  <KeyRound
                    strokeWidth={2}
                    size={32}
                    className="text-[#191C1E]"
                  />
                </span>
                <span
                  className={`text-2xl ${geist.className} text-[#191C1E] font-semibold`}
                >
                  Change Passwsord
                </span>
              </div>{" "}
              <div>
                {loadingSessions ? (
                  <div className="flex flex-col justify-center items-center text-center">
                    <Loader2
                      className="animate-spin text-[#00687A] "
                      strokeWidth={2}
                      size={64}
                    />
                  </div>
                ) : (
                  <div>
                    {isSocialUser ? (
                      <div
                        className={`${geist.className} flex justify-center flex-col gap-4 items-center text-[#45464D]`}
                      >
                        <p className="flex sm:w-100 text-center flex-wrap ">
                          This account uses Google or Github Sign-In. Password
                          changes are managed by your social provider.{" "}
                        </p>
                        <div>
                          You need to{" "}
                          <Link
                            className="underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.github.com/akshansh-kakkkar"
                          >
                            Hire Me
                          </Link>{" "}
                          to perform this action xd.
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div
                          className={`${geist.className} text-[#45464D] text-md`}
                        >
                          Ensure your account is using a long , random password
                          to stay secure.
                        </div>
                        <div className="flex flex-col select-none gap-2">
                          <label
                            htmlFor=""
                            className={`${jetBrains.className}  font-[600] text-[#191C1E]`}
                          >
                            Current Password
                          </label>
                          <div className="relative w-full">
                            <div onClick={toggleEyePass}>
                              {togglePassword ? (
                                <EyeOff className="absolute right-4 top-1/4" />
                              ) : (
                                <Eye className="absolute right-4 top-1/4" />
                              )}
                            </div>

                            <input
                              placeholder="••••••••••••••••"
                              className={`   w-full border  text-[#191C1E] rounded-sm bg-[#F2F4F6]  text-lg  p-2 `}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                              value={currentPassword}
                              type={togglePassword ? "password" : "text"}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col select-none gap-2">
                          <label
                            htmlFor=""
                            className={`${jetBrains.className} font-[600] text-[#191C1E]`}
                          >
                            New Password
                          </label>
                          <div className="relative w-full">
                            <div onClick={toggleEyePassNew}>
                              {togglePassEyeNew ? (
                                <EyeOff className="absolute right-4 top-1/4" />
                              ) : (
                                <Eye className="absolute right-4 top-1/4" />
                              )}
                            </div>
                            <input
                              placeholder="••••••••••••••••"
                              className={` w-full text-[#] border text-[#191C1E] rounded-sm bg-[#F2F4F6]  text-lg  p-2`}
                              onChange={(e) => setNewPassword(e.target.value)}
                              value={newPassword}
                              type={togglePassEyeNew ? "password" : "text"}
                            />
                          </div>
                        </div>
                        <div className="flex select-none flex-col gap-2">
                          <label
                            htmlFor=""
                            className={`${jetBrains.className} font-[600] text-[#191C1E]`}
                          >
                            Confirm New Passowrd
                          </label>
                          <div className="w-full relative">
                            <div onClick={togglePassEyeConfirm}>
                              {togglePasseyeConfirmnew ? (
                                <EyeOff className="absolute right-4  top-1/4" />
                              ) : (
                                <Eye className="absolute right-4  top-1/4" />
                              )}
                            </div>
                            <input
                              placeholder="••••••••••••••••"
                              type={
                                togglePasseyeConfirmnew ? "password" : "text"
                              }
                              className={` pr-14 w-full border text-[#191C1E] rounded-sm bg-[#F2F4F6]  text-lg  p-2 `}
                              onChange={(e) => {
                                setConfirmNewPasswrd(e.target.value);
                              }}
                              value={confirmNewPasswrd}
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleChangePassword}
                          disabled={isChangingPassword}
                          className={`bg-[#00687A] hover:cursor-pointer hover:bg-[#00687a6d] px-5 py-3 text-white rounded-sm text-xl w-fit ${jetBrains.className}`}
                        >
                          {isChangingPassword
                            ? "updating..."
                            : "Update Password"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border px-8 flex flex-col gap-4 py-12 w-full  rounded-lg  border-[#C6C6CD]">
            <div className="flex flex-col md:flex-row justify-center text-center md:justify-start md:text-start gap-2 items-center">
              <span>
                <Fingerprint
                  strokeWidth={2}
                  size={32}
                  className="text-[#191C1E]"
                />
              </span>
              <span
                className={`text-2xl ${geist.className} flex flex-col md:flex-row gap-4 text-[#191C1E] font-semibold`}
              >
                <span>Two Factor Authentication</span>
                <span className="text-[#76777D] font-medium">(Optional)</span>
              </span>
            </div>{" "}
            <div className="bg-[#E0E3E5] w-fit px-2 py-1 text-sm text-[#45464D] rounded-xs">
              NOT ENABLED
            </div>
            <div className={`text-xl text-[#45464D]`}>
              Add an additional layer of security to your account by requiring
              more than just a passoword to sign in. 2FA is strongly
              recommended.
            </div>
            <button
              onClick={() =>
                toast.error("This Feature is currently not available.")
              }
              className={`bg-[#191C1E] px-5 py-3 cursor-pointer transition-all duration-300 hover:bg-[#3c3e40] text-white rounded-sm text-xl w-fit ${jetBrains.className}`}
            >
              Coming Soon{" "}
            </button>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-8">
          <div className="bg-white border px-8 flex flex-col gap-4 py-6 w-full  rounded-lg  border-[#C6C6CD]">
            <div className={`${jetBrains.className} uppercase `}>
              Security Health (coming soon)
            </div>
            <div className="flex justify-center  items-center">
              <div className="h-40 w-40 flex justify-center items-center bg-[#00687A] rounded-full">
                <div className="h-25 w-25 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white h-[900px] border px-8 flex flex-col gap-4 py-6 w-full  rounded-lg  border-[#C6C6CD]">
            <div
              className={`${jetBrains.className} uppercase flex flex-col flex-1 gap-4 `}
            >
              <div className="flex justify-between border-b-2 pb-4">
                <div>Active Sessions</div>
                <div>
                  <MonitorSmartphone />
                </div>
              </div>

              {loadingSessions ? (
                <div className=" flex-1 flex  justify-center items-center text-center">
                  <Loader2
                    className="text-xl animate-spin text-[#00687A]"
                    strokeWidth={2}
                    size={64}
                  />
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-1 justify-center items-center text-center flex-col gap-4">
                  <span>
                    <ShieldAlert className={`text-[#00687A]`} size={128} />
                  </span>
                  <span
                    className={`${geist.className} text-2xl text-[#191C1E] fontsem`}
                  >
                    No Sessions Found
                  </span>
                </div>
              ) : (
                sessions.map((session) => {
                  const expiredAt = new Date(session.expiresAt) < new Date();
                  const browser = session.userAgent?.includes("Chrome")
                    ? "Google Chrome"
                    : session.userAgent?.includes("Firefox")
                      ? "Firefox"
                      : session.userAgent?.includes("Safari")
                        ? "Safari"
                        : "Unknown Browser";
                  const device = session.userAgent?.includes("Linux")
                    ? "Linux PC"
                    : session.userAgent?.includes("Windows")
                      ? "Windows PC"
                      : session.userAgent?.includes("Macintosh")
                        ? "Mac"
                        : session.userAgent?.includes("Android")
                          ? "Android"
                          : session.userAgent?.includes("iPhone")
                            ? "IPhone"
                            : "Unknown Device";
                  return (
                    <div key={session.id}>
                      <div className="flex border p-4 flex-col gap-2 rounded-lg justify-between py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`${geist.className} text-[#191C1E] font-semibold`}
                          >
                            {device}
                          </div>
                          <div
                            className={`${jetBrains.className} text-[#45464D] bg-[#E0E3E5] rounded-sm px-1.5 py-0.5 text-sm`}
                          >
                            {browser}
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div
                            className={`${geist.className} text-[#45464D] text-md lowercase`}
                          >
                            {session.location || "Unknown Location"}
                          </div>
                          <div
                            className={`${geist.className} text-md text-[#45464D] lowercase`}
                          >
                            {"Session"}
                          </div>
                        </div>
                        <div>
                          {new Date(session.updatedAt).toLocaleString()}
                        </div>
                        <div className="flex justify-end">
                          <div
                            className={`text-sm flex justify-end w-fit px-2 py-1 rounded-md  ${expiredAt ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                          >
                            {expiredAt ? "Expired" : "Active"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <button
              onClick={handleRevokeSessions}
              className="flex cursor-pointer justify-center py-2 rounded items-center hover:bg-red-600 transition-all duration-300 text-center bg-[#BA1A1A]  text-white"
            >
              <span className={`${jetBrains.className} text-xl`}>
                Revoke All Sessions
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
