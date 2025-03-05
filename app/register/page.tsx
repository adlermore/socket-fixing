'use client'

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register, selectStatus } from "@/redux/authSlice";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { registerSchema } from "@/validation/registerSchema";

interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password_confirmation: string;
    password: string;
}

export default function RegisterPage() {
    const ref = useRef<HTMLDivElement>(null);
    const dispatch: AppDispatch = useDispatch();

    const [showPass, setShowPass] = useState(false);

    const status = useSelector(selectStatus)

    // Validation init
    const { register: registerForm, reset, handleSubmit: handleSubmitForm, formState: { errors: errorsRegister } } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    // Submission Data
    const registerSubmit = async (data: RegisterData) => {
        dispatch(register(data));
        reset();
    };

    const passToggle = () => {
        setShowPass(!showPass);
    };

    return (
        <div className="auth_container">
            <div className="auth_inner" ref={ref}>
                <div className="title_line  w-full gap-10">
                    <div className="auth_title text-[25px] uppercase mobile:text-xl ">Registration</div>
                    {status === "failed" && (
                        <div className="text-siteRed text-center">
                            Registration Failed
                        </div>
                    )}
                </div>
                <div className="auth_form mt-[25px]">
                    <form onSubmit={handleSubmitForm(registerSubmit)} className="w-full">
                        <div className={errorsRegister?.name ? "form_block has_error" : "form_block"}>
                            <div className="auth_label">name*</div>
                            <input
                                placeholder="Enter your name"
                                autoComplete="on"
                                className="form-control"
                                {...registerForm("name", {
                                    required: true,
                                    pattern: /^\S+@\S+$/i,
                                })}
                            />
                            <p className="form_error"> {errorsRegister?.name?.message}</p>
                        </div>
                        <div className={errorsRegister?.phone ? "form_block has_error" : "form_block"}>
                            <div className="auth_label">phone*</div>
                            <input
                                placeholder="Enter your phone"
                                autoComplete="on"
                                className="form-control"
                                {...registerForm("phone", {
                                    required: true,
                                    pattern: /^\S+@\S+$/i,
                                })}
                            />
                            <p className="form_error"> {errorsRegister?.phone?.message}</p>
                        </div>
                        <div className={errorsRegister?.email ? "form_block has_error" : "form_block"}>
                            <div className="auth_label">Email*</div>
                            <input
                                placeholder="Enter your email address"
                                autoComplete="on"
                                className="form-control"
                                {...registerForm("email", {
                                    required: true,
                                    pattern: /^\S+@\S+$/i,
                                })}
                            />
                            <p className="form_error"> {errorsRegister?.email?.message}</p>
                        </div>
                        <div className={errorsRegister?.password ? "form_block has_error" : "form_block"}>
                            <div className="auth_label"> Password </div>
                            <input
                                placeholder="Enter password"
                                autoComplete="on"
                                className="form-control"
                                type={showPass ? "text " : "password"}
                                {...registerForm("password", { required: true, minLength: 5 })}
                            />
                            <p className="form_error">{errorsRegister?.password?.message}</p>
                        </div>

                        <div className={errorsRegister?.password_confirmation ? "form_block has_error" : "form_block"}>
                            <div className="auth_label"> Repeat Password </div>
                            <input
                                placeholder="Password"
                                autoComplete="on"
                                className="form-control"
                                type={showPass ? "text " : "password"}
                                {...registerForm("password_confirmation", { required: true, minLength: 5 })}
                            />
                            <p className="form_error">{errorsRegister?.password_confirmation?.message}</p>
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
