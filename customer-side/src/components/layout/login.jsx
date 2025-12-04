import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link, useParams } from "react-router-dom";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";

const DEFAULT_SHOP = {
    shop_name: 'Wash Wise Intelligence',
    slug: 'wash-wise-intelligence',
    shop_id: 'LMSS-00000'
};

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [selectedShop, setSelectedShop] = useState(null);
    const { slug } = useParams();
    const { login } = useContext(AuthContext);

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

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const shopIdToSend = localStorage.getItem("selectedShopId");

        if (!shopIdToSend) {
            setError("Invalid shop. Please go back to home page.");
            return;
        }
        try {
            const response = await fetchApi('/api/public/user/login', {
                method: 'POST',
                body: JSON.stringify({
                    shop_id: shopIdToSend,
                    emailOrUsername: username,
                    password: password
                })
            });

            if (!response.message || !response.token) {
                throw new Error("Invalid response from server");
            }

            const token = response.token.replace('Bearer ', '');
            login(response.user, token, response.apiKey);

            setTimeout(() => {
                toast.success("Login successfully!");
                navigate("/dashboard");
            }, 2000);

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/laundry-logo.jpg')",
            }}
        >
            <div className='bg-[#A4DCF4] bg-opacity-80 min-h-screen pt-10 md:pt-20'>
                <div className='container flex flex-col md:flex-row items-center justify-center min-h-[500px] gap-4 md:gap-16 mx-auto px-4 md:px-[15%]'>
                    {/* Left Side - Image */}
                    <div className="hidden md:block">
                        <img
                            src="/laundry-logo.jpg"
                            alt="Login Visual"
                            className="w-[200px] md:w-[250px] h-[240px] md:h-[300px] rounded-[20%]"
                            style={{
                                boxShadow: "12px 0 20px -2px rgba(0, 0, 0, 0.6)"
                            }}
                        />
                    </div>

                    <div className="w-full md:w-[440px]">
                        <Card className="w-full shadow-lg bg-[#E4F4FC]/80">
                            <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
                                <div className="flex items-center justify-center mb-2 md:mb-4">
                                    <img
                                        src="/user.jpg"
                                        alt="Login Visual"
                                        className="w-[70px] md:w-[90px] h-[70px] md:h-[90px] rounded-[100%]"
                                    />
                                </div>

                                <h2 className="text-xl md:text-2xl font-bold text-center">Login</h2>

                                {error && (
                                    <p className="text-red-500 text-sm text-center font-semibold">
                                        {error}
                                    </p>
                                )}

                                <form onSubmit={handleLogin}>
                                    <div className="space-y-2">
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Username/Email"
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 mt-2">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base h-10 md:h-12"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <p className="text-sm md:text-md text-gray-600 mt-2 md:mt-4 text-right font-semibold">
                                        <a href="/Forgotpassword" className="text-blue-600 hover:underline">
                                            Forgot password
                                        </a>
                                    </p>

                                    <Button
                                        type="submit"
                                        className="w-full mt-2 md:mt-4 bg-[#126280] hover:bg-[#126280]/80 h-10 md:h-12 text-sm md:text-base text-white"
                                    >
                                        Login
                                    </Button>
                                </form>

                                <div className="space-y-2 text-center">
                                    <p className="text-sm md:text-md text-gray-600">
                                        Don't have an account?{" "}
                                        <Link to={currentShop ? `/${currentShop.slug}/register` : '/register'} className="text-blue-600 font-semibold hover:underline">
                                            Register here
                                        </Link>
                                    </p>
                                    <p className="text-sm md:text-md text-gray-600">
                                        <Link to={`/${currentShop?.slug}`} className="text-blue-600 font-semibold hover:underline">Back to Home</Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;