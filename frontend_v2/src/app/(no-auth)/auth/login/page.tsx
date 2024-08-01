'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import background from "@/assets/images/background.jpg";
import logo from "@/assets/images/logo.png";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const attemptLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(formValues.username, formValues.password);
      router.push("/");
    } catch (error: any) {
      setError(error?.response?.data?.message || "An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative h-screen w-full flex flex-col">
      <Image
        alt="image background"
        src={background}
        quality={100}
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />

      <div className="w-[90%] p-6 m-auto bg-white rounded-[10px] lg:max-w-lg z-10">
        <div className="w-full text-center">
          <Image
            alt="logo"
            src={logo}
            width={1000}
            className="w-40 m-auto"
          />
          <h1 className="text-2xl font-medium mt-5">LogIn</h1>
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mt-4">
              {error}
              </div>
          )}
        </div>
        <div className="w-[90%] md:w-[80%] m-auto mt-4 md:mt-6">
          <div className="flex mt-6 items-center">
            <hr className="w-[100%] mr-3 border-[1px]" />
          </div>
          <div>
            <form onSubmit={attemptLogin} className="mt-4">
              <div className="mb-6">
                <label
                  htmlFor="username"
                  className="text-[#666666] text-md font-normal"
                >
                  Your Username
                </label>
                <input
                  className="appearance-none border rounded-lg w-full py-3 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="username"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <label
                    htmlFor="password"
                    className="text-[#666666] text-md font-normal"
                  >
                    Your Password
                  </label>

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="focus:outline-none flex items-center"
                  >
                    <Icon
                      icon={showPassword ? "ri:eye-off-fill" : "ri:eye-fill"}
                      className="text-[#666666] mr-1"
                    />
                    <p className="text-[#666666]">
                      {showPassword ? "Hide" : "Show"}
                    </p>
                  </button>
                </div>
                <input
                  className="appearance-none border rounded-lg w-full py-3 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                />
              </div>
              <Link
                href="#"
                className="flex justify-end text-[14px] mt-2 underline"
              >
                Forget your password
              </Link>
              <button
                type="submit"
                className="w-full flex justify-center bg-[#B2B2B2] hover:bg-[#666666] text-white rounded-[40px] py-3 mt-6"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
