'use client'

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/loginSchema";
import { login, selectStatus } from "@/redux/authSlice";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();

  const [showPass, setShowPass] = useState(false);

  const status = useSelector(selectStatus)

  // Validation init
  const {
    register: loginForm, reset, handleSubmit: handleSubmitForm, formState: { errors: errorsLogin } } = useForm<LoginData>({
      resolver: zodResolver(loginSchema),
    });

  // Submission Data
  const loginSubmit = async (data: LoginData) => {
    dispatch(login(data));
    reset();
  };

  const passToggle = () => {
    setShowPass(!showPass);
  };

  return (
    <div className="auth_container">
      <div className="auth_inner" ref={ref}>
        <div className="title_line  w-full gap-10">
          <div className="auth_title text-[25px] uppercase mobile:text-xl ">Sign in</div>
          {status === "failed" && (
            <div className="text-siteRed text-center">
              Incorrect Email or Password
            </div>
          )}
        </div>
        <div className="auth_form mt-[25px]">
          <form onSubmit={handleSubmitForm(loginSubmit)} className="w-full">
            <div className={errorsLogin?.email ? "form_block has_error" : "form_block"}>
              <div className="auth_label">Email*</div>
              <input
                placeholder="Enter your email address"
                autoComplete="on"
                className="form-control"
                {...loginForm("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
              />
              <p className="form_error"> {errorsLogin?.email?.message}</p>
            </div>
            <div className={errorsLogin?.password ? "form_block has_error" : "form_block"}>
              <div className="auth_label"> Password </div>
              <input
                placeholder="Enter password"
                autoComplete="on"
                className="form-control"
                type={showPass ? "text " : "password"}
                {...loginForm("password", { required: true, minLength: 5 })}
              />
              <p className="form_error">{errorsLogin?.password?.message}</p>
            </div>
            <div className="checkbox_line mt-[26px]">
              <label htmlFor="checkbox1">
                <input type="checkbox" id="checkbox1" onChange={passToggle} />
                <span className="square_block"></span>
                <span className="check_label">Show Password</span>
              </label>
            </div>
            <button type="submit" className="login_submit">Login</button>
            <Link href='/register'>Registr Now</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
