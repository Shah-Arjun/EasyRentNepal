import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const length = 4;

  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("verifyEmail");




  // SESSION STATE 
  const isSessionValid = !!email;



  // AUTO FOCUS
  useEffect(() => {
    if (!isSessionValid) return;
    inputsRef.current[0]?.focus();
  }, [isSessionValid]);




  // TIMER
  useEffect(() => {
    if (!isSessionValid) return;
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isSessionValid]);

  
  
  
  //  VERIFY OTP
  const verifyOtp = async (finalOtp) => {
    if (loading || !isSessionValid) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register/verify-otp`,
        { email, otp: finalOtp }
      );

      alert(res.data.message);

      localStorage.removeItem("verifyEmail");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message;

      alert(msg || "Error verifying OTP");

      if (msg === "OTP expired") {
        setOtp(new Array(length).fill(""));
        setCanResend(true);
      }
    } finally {
      setLoading(false);
    }
  };




  // INPUT CHANGE HANDLERS
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    const finalOtp = newOtp.join("");

    if (finalOtp.length === length && !loading) {
      verifyOtp(finalOtp);
    }
  };



  //   BACKSPACE HANDLER
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };



  //   PASTE HANDLER
  const handlePaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasteData) return;

    const newOtp = new Array(length).fill("");

    pasteData.split("").forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);

    const finalOtp = newOtp.join("");

    if (finalOtp.length === length) {
      verifyOtp(finalOtp);
    }
  };


  //   RESEND OTP
  const resendOtp = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
        { email }
      );

      alert(res.data.message);

      setOtp(new Array(length).fill(""));
      inputsRef.current[0]?.focus();

      setTimer(60);
      setCanResend(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };




  // EARLY RETURN FOR INVALID SESSION
  if (!isSessionValid) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h3>Session expired</h3>
        <button onClick={() => navigate("/register")}>
          Go to Register
        </button>
      </div>
    );
  }




  return (
    <div style={styles.container}>
      <h3>Verify OTP</h3>
      <p>
        OTP sent to: <b>{email}</b>
      </p>

      <div style={styles.inputContainer} onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            value={digit}
            maxLength={1}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              ...styles.input,
              border: digit ? "2px solid #007bff" : "1px solid #ccc",
            }}
          />
        ))}
      </div>

      <button
        onClick={() => verifyOtp(otp.join(""))}
        disabled={loading}
        style={{
          ...styles.button,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <div style={{ marginTop: "15px" }}>
        {canResend ? (
          <button onClick={resendOtp} style={styles.resend}>
            Resend OTP
          </button>
        ) : (
          <p>Resend OTP in {timer}s</p>
        )}
      </div>
    </div>
  );
};



export default VerifyOtp;




/* styles */
const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    margin: "20px 0",
  },
  input: {
    width: "55px",
    height: "55px",
    fontSize: "22px",
    textAlign: "center",
    borderRadius: "8px",
    outline: "none",
    transition: "0.2s",
  },
  button: {
    padding: "10px 25px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
  resend: {
    padding: "8px 15px",
    border: "none",
    background: "transparent",
    color: "#007bff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};