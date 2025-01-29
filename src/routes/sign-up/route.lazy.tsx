import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import logo from "../../assests/Technia_Main logo-01.png";

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email"),
  firstname: z.string(),
    lastname: z.string(),
    phone: z.string(),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type SignUpFormInputs = z.infer<typeof signUpSchema>;

export const Route = createLazyFileRoute("/sign-up")({
  component: SignUp,
});

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormInputs) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Signup failed");
      }

      setSuccessMessage("Signup successful! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "http://localhost:5173/sign-in";
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-6 bg-white border border-black shadow-xl rounded-lg w-full max-w-md transform transition-transform duration-300 hover:scale-105">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Technia Logo" className="h-40 object-contain" />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {errorMessage}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <input
              id="First Name"
              type="text"
              {...register("firstname")}
              placeholder="First name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <input
              id="Last Name"
              type="text"
              {...register("lastname")}
              placeholder="Last name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <input
              id="username"
              type="text"
              {...register("username")}
              placeholder="Username"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
            </div>
            <div className="relative">
            <input
              id="Phone Number"
              type="text"
              {...register("phone")}
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
