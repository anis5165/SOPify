'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Mail, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";

const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Minimum 8 characters')
        .matches(/[a-z]/, 'Lowercase letter is required')
        .matches(/[A-Z]/, 'Uppercase letter is required')
        .matches(/[0-9]/, 'Number is required')
        .matches(/\W/, 'Special character is required'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const Signup = () => {
    const router = useRouter();

    const signupForm = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        onSubmit: async (values) => {
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/add`, values);
                console.log(res.status);
                console.log(res.data);
                toast.success('Account created successfully');
                router.push('/login');
            } catch (error) {
                console.log(error);
                toast.error('Something went wrong');
            }
        },
        validationSchema: SignupSchema
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
                        <Badge variant="secondary" className="w-fit">Create Account</Badge>
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join SOPify Today</h1>
                        <p className="text-gray-500 md:text-lg">
                            Create your account and start automating your SOP creation
                        </p>
                    </div>

                    <Card className="w-full">
                        <CardContent className="pt-6">
                            <form onSubmit={signupForm.handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium leading-none">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            onChange={signupForm.handleChange}
                                            value={signupForm.values.name}
                                            className={`pl-9 ${signupForm.touched.name && signupForm.errors.name ? 'border-red-500' : ''}`}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    {signupForm.touched.name && signupForm.errors.name && (
                                        <p className="text-sm text-red-500">{signupForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            onChange={signupForm.handleChange}
                                            value={signupForm.values.email}
                                            className={`pl-9 ${signupForm.touched.email && signupForm.errors.email ? 'border-red-500' : ''}`}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {signupForm.touched.email && signupForm.errors.email && (
                                        <p className="text-sm text-red-500">{signupForm.errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium leading-none">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            onChange={signupForm.handleChange}
                                            value={signupForm.values.password}
                                            className={`pl-9 ${signupForm.touched.password && signupForm.errors.password ? 'border-red-500' : ''}`}
                                            placeholder="Create a password"
                                        />
                                    </div>
                                    {signupForm.touched.password && signupForm.errors.password && (
                                        <p className="text-sm text-red-500">{signupForm.errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            onChange={signupForm.handleChange}
                                            value={signupForm.values.confirmPassword}
                                            className={`pl-9 ${signupForm.touched.confirmPassword && signupForm.errors.confirmPassword ? 'border-red-500' : ''}`}
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                    {signupForm.touched.confirmPassword && signupForm.errors.confirmPassword && (
                                        <p className="text-sm text-red-500">{signupForm.errors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-start space-x-2">
                                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <p className="text-sm text-gray-500">
                                            By signing up, you agree to our{' '}
                                            <Link href="#" className="text-blue-600 hover:text-blue-700">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link href="#" className="text-blue-600 hover:text-blue-700">
                                                Privacy Policy
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    Create Account
                                </Button>
                            </form>

                            <div className="mt-4 text-center text-sm">
                                <p className="text-gray-500">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Sign in
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

export default Signup;