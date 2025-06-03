import React from 'react'
import { FileText } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
    return (
        <div>
            <footer
                id="contact"
                className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50"
            >
                <div className="container mx-auto">
                    <div className="grid gap-8 lg:grid-cols-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-bold text-xl">SOPify</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Automate your SOP creation and streamline your documentation process.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Integrations
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        API
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Status
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-900">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-xs text-gray-500">© 2024 SOPify. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 sm:mt-0">
                            <Link href="#" className="text-xs text-gray-500 hover:text-gray-900">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-xs text-gray-500 hover:text-gray-900">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
