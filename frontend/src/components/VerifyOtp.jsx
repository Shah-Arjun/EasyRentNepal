import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

const VerifyOtp = () => {
  const length = 4;

  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { loadUserData } = useAppContext();

  const email = location.state?.email || localStorage.getItem("verifyEmail")
  const role = location.state?.role || localStorage.getItem("verifyRole")



  useEffect(() => {
    if (email) {
      localStorage.setItem("verifyEmail", email);
    }
  }, [email]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("verifyRole", role);
    }
  }, [role]);




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
      console.log("🔐 Verifying OTP for:", role)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/${role === 'tenant' ? 'auth/register' : 'agency'}/verify-otp`, 
        { email, otp: finalOtp },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      console.log("✅ OTP verified successfully")

      localStorage.removeItem("verifyEmail");
      localStorage.removeItem("verifyRole");

      if (role && role === "tenant") {
        navigate("/login");
      } else if(role === "owner") {
        // Reload user data to refresh the context with new role
        console.log("📊 Reloading user data after agency OTP verification...")
        await loadUserData()
        console.log("🚀 Navigating to /owner")
        navigate("/owner");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg = err.response?.data?.message;

      toast.error(msg || "Error verifying OTP");

      if (err.status === 400 || msg === "OTP expired") {
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
        `${import.meta.env.VITE_API_URL}/${role === 'tenant' ? 'auth/register' : 'agency'}/resend-otp`,
        { email }
      );

      toast.success(res.data.message);

      setOtp(new Array(length).fill(""));
      inputsRef.current[0]?.focus();

      setTimer(60);
      setCanResend(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };




  // EARLY RETURN FOR INVALID SESSION
  if (!isSessionValid) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h3>Session expired</h3>
        {role === "tenant" ? (
          <button onClick={() => navigate("/register")}>Go to Register</button>
        ) : (
          <button onClick={() => navigate("/login")}>Go to Login</button>
        )}
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