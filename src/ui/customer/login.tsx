import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { CustomerAuthService } from "@/services/customer/customer-auth";
import { getBackendErrorMessage } from "@/backend";
import "./login.css";
import { useAlert } from "@/hooks/useAlert";
import { useForm } from "react-hook-form";

export const Customer_LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useCustomerAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [readyToVerify, setReadyToVerify] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const { showSuccess, showError } = useAlert();

  const tableNo = useMemo(() => {
    const t = searchParams.get("table") || searchParams.get("tableNo") || "05";
    return String(t).slice(0, 3).padStart(2, "0");
  }, [searchParams]);

  const { reset } = useForm<{ name: string; phone: string }>();

  // ----- LOGIN SUBMIT -----
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    try {
      const status = await CustomerAuthService.login(
        `+94${phone}`,
        name.trim()
      );

      showSuccess(
        status === "already-sent"
          ? `A verification code has already been sent to +94${phone}. Please check your messages.`
          : `Verification code sent to +94${phone}. Please check your messages.`
      );

      setReadyToVerify(phone);
      reset();
    } catch (error) {
      showError(
        `Failed to login due to an error: ${getBackendErrorMessage(error)}`
      );
    }
  };

  // ----- VERIFICATION SUBMIT -----
  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (verificationCode.length !== 6) return;

    try {
      const { accessToken, user, customerFound } =
        await CustomerAuthService.verifyLoginCode(
          `+94${readyToVerify}`,
          verificationCode
        );

      if (!customerFound) {
        showSuccess(
          `Welcome to Resto Ease, ${user.name}! You have successfully registered.`
        );
      } else {
        showSuccess(
          `Welcome back, ${user.name}! You have successfully logged in.`
        );
      }

      setAuth({ accessToken, user });

      showSuccess(
        customerFound
          ? `Welcome back, ${user.name}!`
          : `Welcome, ${user.name}! You have registered successfully.`
      );

      navigate("/view-menu");
    } catch (error) {
      showError(
        `Failed to login due to an error: ${getBackendErrorMessage(error)}`
      );
    }
  };

  // ----- CONDITIONAL RENDER -----
  if (readyToVerify) {
    // Verification Form
    return (
      <main className="cl-root">
        <header className="cl-header" aria-label={`Table number ${tableNo}`}>
          <div className="cl-table">
            <span className="cl-table__label">Table No.</span>
            <span className="cl-table__value">{tableNo}</span>
          </div>
        </header>

        <div className="cl-logo" aria-hidden>
          {/* Your logo SVG here */}
        </div>

        <form
          className="cl-form"
          onSubmit={handleVerificationSubmit}
          noValidate
        >
          <div className="cl-fields">
            <label className="cl-field">
              <input
                className="cl-input"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                inputMode="numeric"
                aria-label="Verification code"
              />
            </label>
          </div>

          <button
            type="submit"
            className="cl-cta"
            disabled={verificationCode.length !== 6}
          >
            Verify
          </button>
          <button
            type="button"
            className="cl-link"
            onClick={() => {
              setReadyToVerify("");
              setVerificationCode("");
            }}
          >
            Cancel
          </button>
        </form>
      </main>
    );
  }

  // Login Form
  return (
    <main className="cl-root">
      <header className="cl-header" aria-label={`Table number ${tableNo}`}>
        <div className="cl-table">
          <span className="cl-table__label">Table No.</span>
          <span className="cl-table__value">
            {/* Table icon (SVG) */}
            <svg
              className="cl-table__icon"
              width="32"
              height="24"
              viewBox="0 0 32 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
              focusable="false"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.58675 5.05942C3.51419 5.08258 3.39463 5.15894 3.32113 5.22902L3.1875 5.35642V12.0037V18.651L3.32812 18.7717C3.62019 19.0222 4.15956 19.0041 4.37712 18.7365C4.49419 18.5925 4.49956 18.4872 4.49975 16.3242L4.5 14.0625H7.25H10V16.2906C10 18.7366 10.0047 18.7705 10.367 18.911C10.6178 19.0083 10.8016 19.0033 11.0431 18.8929C11.1769 18.8317 11.264 18.7433 11.3083 18.6235C11.3519 18.5058 11.3744 17.2492 11.3746 14.918L11.375 11.3906H7.9375H4.5V8.36796V5.34527L4.32812 5.20225C4.14281 5.04808 3.818 4.9855 3.58675 5.05942ZM27.8993 5.05942C27.8267 5.08258 27.7071 5.15894 27.6336 5.22902C27.5002 5.35614 27.5 5.36242 27.5 8.37353V11.3906H24.061H20.622L20.6391 15.0117C20.6551 18.3817 20.6639 18.6413 20.7665 18.7545C20.9693 18.9783 21.3036 19.0387 21.633 18.911C21.9952 18.7705 22 18.7366 22 16.2906V14.0625H24.75H27.5L27.5002 16.3242C27.5004 18.4872 27.5058 18.5925 27.6229 18.7365C27.8404 19.0041 28.3798 19.0222 28.6719 18.7717L28.8125 18.651V11.9981V5.34527L28.6406 5.20225C28.4553 5.04808 28.1305 4.9855 27.8993 5.05942ZM8.88037 8.28363C8.72862 8.32385 8.48437 8.4468 8.33762 8.55686C7.97419 8.82939 7.875 9.09714 7.875 9.80542V10.3594H11.5312H15.1875V13.8903V17.4213L14.6884 17.4786C13.2026 17.6492 12.5031 18.0768 13.0655 18.4709C13.5106 18.7826 14.5701 18.9588 16 18.9588C17.0977 18.9588 17.7285 18.8896 18.4095 18.6941C19.0592 18.5076 19.3011 18.2063 18.9972 17.9617C18.7261 17.7435 17.9618 17.5356 17.1406 17.4569L16.8125 17.4254V13.8924V10.3594H20.4688H24.125V9.80542C24.125 9.0978 24.0257 8.82935 23.6635 8.5577C23.1604 8.18036 23.6498 8.20267 15.9733 8.20685C9.96669 8.21013 9.12344 8.21922 8.88037 8.28363Z"
                fill="black"
              />
            </svg>
            <span className="cl-table__num">{tableNo}</span>
          </span>
        </div>
      </header>

      <div className="cl-logo" aria-hidden>
        <svg
          width="86"
          height="38"
          viewBox="0 0 86 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M34.0976 14.4115H23.9568V8.14215H20.8038V24.0741H23.9568V17.386H34.0976V24.0741H37.2482V8.14215H34.0976V14.4115Z"
            fill="#B59B46"
          />
          <path
            d="M71.0959 19.8434L60.9299 8.14215H57.3605V24.0741H60.5135V12.3728L70.6772 24.0741H74.2512V8.14215H71.0959V19.8434Z"
            fill="#B59B46"
          />
          <path
            d="M53.0517 16.0326C53.0517 13.1634 50.5783 10.8318 47.5374 10.8318C44.4988 10.8318 42.03 13.1634 42.03 16.0326C42.03 18.8996 44.4988 21.2312 47.5374 21.2312C50.5783 21.2312 53.0517 18.8996 53.0517 16.0326ZM56.2069 16.0326C56.2069 20.5379 52.3172 24.2057 47.5374 24.2057C42.7599 24.2057 38.8747 20.5379 38.8747 16.0326C38.8747 11.5205 42.7599 7.85731 47.5374 7.85731C52.3172 7.85731 56.2069 11.5205 56.2069 16.0326Z"
            fill="#B59B46"
          />
          <path
            d="M85.6614 5.97766C71.8093 2.34189 57.4584 0.499983 42.9954 0.499983C28.5416 0.499983 14.1907 2.34189 0.343216 5.97766L0 6.0669V9.16039L0.594899 9.00022C4.17118 8.04609 7.78178 7.2178 11.4198 6.5085V23.9963H11.5159H14.6689H14.7604V5.89529C24.0455 4.28677 33.4976 3.47678 42.9954 3.47678C57.3829 3.47678 71.6537 5.33242 85.4074 9.00022L86 9.16039V6.06919L85.6614 5.97766Z"
            fill="#B59B46"
          />
          <path
            d="M26.1241 28.6775H24.7307V32.2927H20.4313V28.6775H18.832V37.4478H20.4313V33.796H24.7307V37.4478H26.3255V28.6775H26.1241Z"
            fill="#B59B46"
          />
          <path
            d="M29.6144 33.0816C29.6144 32.2121 29.905 31.4891 30.477 30.9354C31.0582 30.3725 31.8041 30.0888 32.701 30.0888C33.5659 30.0888 34.2706 30.3656 34.861 30.9399C35.4513 31.512 35.7373 32.1961 35.7373 33.0335C35.7373 33.8824 35.4421 34.6009 34.861 35.1706C34.2752 35.7404 33.5339 36.0309 32.6667 36.0309C31.7949 36.0309 31.0627 35.7472 30.4816 35.1889C29.905 34.6329 29.6144 33.9236 29.6144 33.0816ZM29.3009 29.8348C28.4177 30.6928 27.9692 31.7865 27.9692 33.0816C27.9692 34.3515 28.4154 35.4223 29.2895 36.2689C30.1635 37.1109 31.2732 37.5365 32.582 37.5365C33.9503 37.5365 35.0989 37.1132 36.0004 36.2712C36.9088 35.4246 37.3664 34.3446 37.3664 33.0587C37.3664 31.7774 36.9088 30.6905 36.0141 29.8348C35.1195 28.9836 33.9846 28.5535 32.6484 28.5535C31.3076 28.5535 30.1818 28.9836 29.3009 29.8348Z"
            fill="#B59B46"
          />
          <path
            d="M45.4077 28.6775H38.2186V30.1533H41.0855V37.4478H42.6964V30.1533H45.6091V28.6775H45.4077Z"
            fill="#B59B46"
          />
          <path
            d="M52.2519 28.6775H47.3027V37.4478H52.563V35.9674H48.8975V33.7662H52.3319V32.2927H48.8975V30.1533H52.4555V28.6775H52.2519Z"
            fill="#B59B46"
          />
          <path
            d="M56.1754 28.6775H54.7774V37.4478H60.1475V35.9536H56.3768V28.6775H56.1754Z"
            fill="#B59B46"
          />
          <path
            d="M62.8095 29.2361C62.3107 29.6822 62.0568 30.2726 62.0568 30.9887C62.0568 31.4669 62.1918 31.8994 62.4595 32.2723C62.7157 32.6316 63.1436 32.9954 63.7339 33.3523L64.64 33.906C65.3058 34.3248 65.6468 34.7526 65.6468 35.1828C65.6468 35.4322 65.5461 35.6381 65.3425 35.8097C65.132 35.9882 64.8642 36.0729 64.5348 36.0729C63.7431 36.0729 62.7752 35.4047 62.0911 34.8831V36.6655L62.1712 36.725C62.885 37.2649 63.6836 37.5372 64.5439 37.5372C65.3173 37.5372 65.9488 37.3061 66.4316 36.8531C66.9189 36.3955 67.1683 35.796 67.1683 35.0707C67.1683 34.0525 66.6215 33.2127 65.5461 32.5698L64.6354 32.0252C64.2419 31.7918 63.9605 31.5722 63.798 31.38C63.6424 31.1969 63.5646 31.0025 63.5646 30.808C63.5646 30.5906 63.6584 30.4213 63.8598 30.2748C64.0771 30.1238 64.3563 30.046 64.7041 30.046C65.4569 30.046 66.4545 30.6684 66.848 30.943V29.2475L66.7588 29.188C66.1433 28.7784 65.4591 28.5702 64.7224 28.5702C63.9467 28.5702 63.3038 28.7945 62.8095 29.2361Z"
            fill="#B59B46"
          />
        </svg>
      </div>

      <form className="cl-form" onSubmit={handleLoginSubmit} noValidate>
        <div className="cl-fields">
          <label className="cl-field">
            <input
              className="cl-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              autoComplete="name"
            />
          </label>

          <label className="cl-field">
            <input
              className={`cl-input ${phoneError ? "cl-input--error" : ""}`}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (phoneError) setPhoneError("");
              }}
              placeholder="Phone number"
              inputMode="tel"
              aria-label="Phone number"
              autoComplete="tel"
            />
            {phoneError && <div className="cl-input__error">{phoneError}</div>}
          </label>
        </div>

        <button
          type="submit"
          className="cl-cta"
          disabled={!name.trim() || !phone.trim()}
        >
          Let’s Start
        </button>

        <p className="cl-scan">
          <span>Not this table?</span>
          <button type="button" className="cl-link" onClick={() => navigate(0)}>
            Scan Again
          </button>
        </p>

        <button
          type="button"
          className="cl-link"
          onClick={() => navigate("/view-menu")}
        >
          Continue as a Guest
        </button>
      </form>
    </main>
  );
};

export default Customer_LoginPage;
