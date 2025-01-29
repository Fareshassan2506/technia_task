import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../assests/Technia_Main logo-01.png";
import { useState } from "react";

const signInSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

type SignInFormInputs = z.infer<typeof signInSchema>;

export const Route = createLazyFileRoute("/sign-in")({
  component: SignIn,
});

function SignIn() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormInputs) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();
      console.log(result);
      console.log(response);

      if (!response.ok) {
        throw new Error(result.detail || "Login failed");
      }
      localStorage.setItem("user", JSON.stringify(result));

      // ✅ Redirect user to dashboard after login
      window.location.href = "http://localhost:5173/dashboard";

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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
