'use client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required')
});

const Login = () => {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: (values, { resetForm, setSubmitting }) => {
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/authenticate`, values)
                .then((result) => {
                    toast.success('Login successfully');
                    localStorage.setItem('token', result.data.token);
                    router.push('/');
                    resetForm();
                }).catch((err) => {
                    setSubmitting(false);
                    console.log(err);
                    toast.error('Login failed');
                });
        },
        validationSchema: validationSchema
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
                <div className="mx-auto max-w-md">
                    <div className="flex flex-col items-center space-y-4 text-center mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl">SOPify</span>
                        </div>
                        <Badge variant="secondary" className="w-fit">Welcome Back</Badge>
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Sign in to your account</h1>
                        <p className="text-gray-500 md:text-lg">
                            Enter your credentials to access your SOPify dashboard
                        </p>
                    </div>

                    <Card className="w-full">
                        <CardContent className="pt-6">
                            <form onSubmit={formik.handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                            className={`pl-9 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="text-sm text-red-500">{formik.errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.password}
                                            className={`pl-9 ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                    {formik.touched.password && formik.errors.password && (
                                        <p className="text-sm text-red-500">{formik.errors.password}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </form>

                            <div className="mt-4 text-center text-sm">
                                <p className="text-gray-500">
                                    Don't have an account?{' '}
                                    <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;