import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link, useParams } from "react-router-dom";
import { fetchApi } from "@/lib/api";
import { toast } from 'sonner';
import { formatPHNumber } from "@/lib/phoneFormatter";
import OTPModal from "@/modals/OTPmodal";

const DEFAULT_SHOP = {
    shop_name: 'Wash Wise Intelligence',
    slug: 'wash-wise-intelligence',
    shop_id: 'LMSS-00000'
};

const Register = ({ embedded = false }) => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        cus_fName: "",
        cus_lName: "",
        cus_mName: "",
        cus_eMail: "",
        cus_role: "CUSTOMER",
        cus_phoneNum: "",
        cus_address: "",
        cus_username: "",
        password: "",
        confirmPassword: "",
        registeredBy: "CUSTOMER"
    });
    const [selectedShop, setSelectedShop] = useState(null);
    const { slug } = useParams();

    // OTP Modal state
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [sendingOTP, setSendingOTP] = useState(false);
    const [otpResetKey, setOtpResetKey] = useState(0);


    useEffect(() => {
        const verifySlug = async () => {
            try {

                if (!slug) {
                    localStorage.removeItem('selectedShop');
                    localStorage.removeItem('selectedShopId');
                    setSelectedShop(DEFAULT_SHOP);
                    return;
                }

                const response = await fetchApi(`/api/public/shop-slug/${slug}`);

                if (!response.success) {
                    localStorage.removeItem('selectedShop');
                    localStorage.removeItem('selectedShopId');
                    setSelectedShop(DEFAULT_SHOP);
                    return;
                }

                localStorage.setItem('selectedShop', response.data.slug);
                localStorage.setItem('selectedShopId', response.data.shop_id);
                setSelectedShop(response.data);

            } catch (err) {
                console.error("Slug check failed:", err);
                setSelectedShop(DEFAULT_SHOP);
                localStorage.removeItem('selectedShop');
                localStorage.removeItem('selectedShopId');
            }
        };

        verifySlug();
    }, [slug]);

    const currentShop = selectedShop || DEFAULT_SHOP;

    useEffect(() => {
        let interval;

        if (resendDisabled && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        } else if (resendDisabled && resendTimer === 0) {
            setResendDisabled(false); // enable button when timer reaches 0
        }

        return () => clearInterval(interval);
    }, [resendDisabled, resendTimer]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const formattedNumber = formatPHNumber(formData.cus_phoneNum);
        if (!formattedNumber) {
            toast.error("Invalid Philippine phone number!");
            return;
        }

        const sendOtpPromise = async () => {
            setSendingOTP(true);
            return fetchApi("/api/public/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.cus_eMail })
            }).then(response => {

                if (!response.success) {

                    throw new Error(response.message || "Server rejected the request.");
                }
                return response;
            });
        };

        try {
            await toast.promise(
                sendOtpPromise(),
                {
                    loading: 'Sending verification code...',
                    success: (response) => {

                        setShowOTPModal(true);
                        setResendDisabled(true);
                        setResendTimer(30);
                        return 'OTP sent successfully! Check your email.';
                    },
                    error: (err) => {

                        console.error("API error:", err);
                        return err.message || "Failed to send OTP. Please try again.";
                    },
                }
            );


        } catch (err) {
            toast.error(err.message || "Something went wrong");
            console.error("Unexpected error during submission:", err);
        } finally {
            setSendingOTP(false);
        }
    };

    const handleOTPSubmit = async (otp) => {
        const verifyOtpPromise = async () => {
            return fetchApi("/api/public/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.cus_eMail, otp })
            }).then((res) => {
                if (!res.success) throw new Error("Invalid OTP");
                return res;
            });
        };

        try {
            await toast.promise(
                verifyOtpPromise,
                {
                    loading: "Verifying OTP...",
                    success: "OTP verified!",
                    error: (err) => err.message || "Invalid OTP",
                }
            );

            const shopIdToSend = localStorage.getItem("selectedShopId");
            if (!shopIdToSend) {
                setError("Invalid shop. Please go back to home page.");
                return;
            }

            const formattedNumber = formatPHNumber(formData.cus_phoneNum);

            const registerPromise = async () => {
                return fetchApi("/api/public/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        shop_id: shopIdToSend,
                        user_fName: formData.cus_fName,
                        user_lName: formData.cus_lName,
                        user_mName: formData.cus_mName,
                        user_address: formData.cus_address,
                        username:
                            formData.cus_username ||
                            `${formData.cus_lName}.${formData.cus_fName}`.toLowerCase(),
                        contactNum: formattedNumber,
                        email: formData.cus_eMail,
                        role: formData.cus_role,
                        status: "ACTIVE",
                        password: formData.password,
                        registered_by: "CUSTOMER",
                    }),
                }).then((res) => {
                    if (!res.success)
                        throw new Error(res.message || "Failed to register customer");
                    return res;
                });
            };

            await toast.promise(
                registerPromise,
                {
                    loading: "Registering account...",
                    success: "Customer registered successfully!",
                    error: (err) => err.message || "Registration failed",
                }
            );

            setTimeout(() => {
                navigate(currentShop ? `/${currentShop.slug}/login` : "/login");
            }, 1500);

        } catch (error) {
            console.error("API error:", error);
            setOtpResetKey((prev) => prev + 1);
            setShowOTPModal(false);
            toast.error(error.message || "Something went wrong");
        }
    };


    const handleResendOTP = async () => {
        try {
            setResendDisabled(true);
            setResendTimer(30);
            toast("Resending OTP...");

            const response = await fetchApi("/api/public/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.cus_eMail })
            });

            if (!response.success) throw new Error(response.message || "Failed to resend OTP");

            toast.success("OTP resent successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to resend OTP");
            setResendDisabled(false);
        }
    };

    return (
        <div className={embedded ? "w-full" : "min-h-screen bg-cover bg-center"}
            style={embedded ? {} : {
                backgroundImage: "url('/laundry-logo.jpg')",
            }}
        >
            <div className={embedded ? "w-full" : 'bg-[#A4DCF4] bg-opacity-80 min-h-screen md:pt-5 flex items-center justify-center'}>

                {/* Registration Form */}
                <div className={`${embedded ? 'w-full' : 'w-full md:w-1/2'} flex items-center justify-center`}>
                    <div className={`w-full ${embedded ? '' : 'max-w-7xl'}`}>
                        <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 bg-gray-100/80 rounded-lg shadow-lg">
                            <div className="flex items-center justify-center mb-4">
                                <img
                                    src="/user.jpg"
                                    alt="User Icon"
                                    className="w-[60px] h-[60px] rounded-full border-4 border-[#126280]/20"
                                />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-[#126280] text-center mb-4">Register New User Account</h2>

                            {error && (
                                <p className="text-red-500 text-sm text-center font-semibold mb-4">
                                    {error}
                                </p>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* First row - Names */}
                                <div className='flex flex-col md:flex-row items-center justify-center gap-4 mb-4'>
                                    <div className="space-y-2 flex-1 w-full">

                                        <Input
                                            id="cus_fName"
                                            type="text"
                                            placeholder="First name"
                                            value={formData.cus_fName}
                                            onChange={handleChange}
                                            className="w-full bg-gray-300 rounded-full border border-[#126280]/30 focus:outline-none focus:ring-2 focus:ring-[#126280]/50 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1 w-full">

                                        <Input
                                            id="cus_mName"
                                            type="text"
                                            placeholder="Middle name"
                                            value={formData.cus_mName}
                                            onChange={handleChange}
                                            className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1 w-full">

                                        <Input
                                            id="cus_lName"
                                            type="text"
                                            placeholder="Last name"
                                            value={formData.cus_lName}
                                            onChange={handleChange}
                                            className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Address field */}
                                <div className="mb-4">

                                    <Input
                                        id="cus_address"
                                        type="text"
                                        placeholder="Address"
                                        value={formData.cus_address}
                                        onChange={handleChange}
                                        className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>

                                {/* Email and Contact */}
                                <div className='flex flex-col md:flex-row items-center justify-center gap-4 mb-4'>
                                    <div className="space-y-2 w-full">

                                        <Input
                                            id="cus_eMail"
                                            type="email"
                                            placeholder="Email address"
                                            value={formData.cus_eMail}
                                            onChange={handleChange}
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 w-full">

                                        <Input
                                            id="cus_phoneNum"
                                            type="tel"
                                            placeholder="09XXXXXXXXX"
                                            pattern="^09\d{9}$"
                                            inputMode="numeric"
                                            maxLength={11}
                                            value={formData.cus_phoneNum}
                                            onChange={handleChange}
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            onInput={e => {
                                                let value = e.target.value.replace(/[^0-9]/g, '');
                                                if (value.length >= 2 && !value.startsWith('09')) {
                                                    value = '09' + value.slice(2);
                                                }
                                                e.target.value = value;
                                            }}
                                            required
                                            title="Please enter a valid Philippine mobile number (e.g., 09123456789)"
                                        />
                                    </div>
                                </div>

                                {/* Username and Passwords */}
                                <div className='flex flex-col md:flex-row items-center justify-center gap-4 mb-6'>
                                    <div className="space-y-2 w-full">

                                        <Input
                                            id="cus_username"
                                            type="text"
                                            placeholder="Username"
                                            value={formData.cus_username}
                                            onChange={handleChange}
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 w-full">

                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 w-full">

                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full mt-6 bg-[#126280] hover:bg-[#126280]/80 h-10 md:h-12 text-sm md:text-base text-white rounded-full font-semibold"
                                    disabled={sendingOTP}
                                >
                                    {sendingOTP ? "Sending OTP..." : <>Register Customer</>}
                                </Button>
                            </form>

                            {!embedded && (
                                <p className="text-sm md:text-md text-center text-gray-600 mt-2 md:mt-4">
                                    Already have an account?{" "}
                                    <Link to={currentShop ? `/${currentShop.slug}/login` : '/login'} className="text-blue-600 font-semibold hover:underline text-lg">
                                        Login here
                                    </Link>
                                </p>
                            )}
                        </CardContent>
                    </div>
                </div>
            </div>
            {/* OTP Modal */}
            <OTPModal
                open={showOTPModal}
                onClose={() => {
                    setOtpResetKey(prev => prev + 1);
                    setShowOTPModal(false);
                }}
                onSubmit={handleOTPSubmit}
                onResend={handleResendOTP}
                resendDisabled={resendDisabled}
                resendTimer={resendTimer}
                resetTrigger={otpResetKey}
            />
        </div>
    );
};

export default Register;