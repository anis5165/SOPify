import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  FileText,
  Share2,
  Download,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Shield,
  Workflow,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/Footer"

export default function SOPifyLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="w-fit bg-blue-100 text-blue-700 hover:bg-blue-200">
                    🚀 Now Available as Browser Extension
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Automate Your SOP Creation in <span className="text-blue-600">Minutes</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Transform any workflow into professional Standard Operating Procedures. SOPify records your actions,
                    captures screenshots, and generates structured documentation automatically.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Play className="mr-2 h-4 w-4" />
                    Start Free Trial
                  </Button>
                  <Button variant="outline" size="lg">
                    Watch Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    No credit card required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    14-day free trial
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070"
                    width="500"
                    height="400"
                    alt="SOPify Dashboard"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need for Perfect SOPs
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive platform handles every aspect of SOP creation, from capture to distribution.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Play className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Automatic Recording</CardTitle>
                  <CardDescription>
                    Capture every click, keystroke, and screen interaction automatically as you perform your workflow.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Smart Documentation</CardTitle>
                  <CardDescription>
                    AI-powered text generation creates clear, professional descriptions for each step in your process.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Workflow className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Visual Step Breakdown</CardTitle>
                  <CardDescription>
                    Automatically captures screenshots and annotations to create visual, easy-to-follow instructions.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Share2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Easy Sharing</CardTitle>
                  <CardDescription>
                    Share SOPs instantly with team members via links, email, or integrate with your existing tools.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Download className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Multiple Export Formats</CardTitle>
                  <CardDescription>
                    Export your SOPs as PDF, Word documents, HTML, or integrate with popular documentation platforms.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>Team Collaboration</CardTitle>
                  <CardDescription>
                    Enable team members to review, edit, and approve SOPs with built-in collaboration features.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">How It Works</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Create SOPs in 3 Simple Steps</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From workflow capture to polished documentation in minutes, not hours.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold">Record Your Process</h3>
                <p className="text-gray-500">
                  Install our browser extension and click record. Perform your workflow normally while SOPify captures
                  every action.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070"
                  width="300"
                  height="200"
                  alt="Recording Process"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold">AI Generates Documentation</h3>
                <p className="text-gray-500">
                  Our AI analyzes your actions and automatically creates clear, step-by-step instructions with
                  screenshots.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070"
                  width="300"
                  height="200"
                  alt="AI Documentation"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold">Edit & Share</h3>
                <p className="text-gray-500">
                  Review, edit, and customize your SOP. Then share it with your team or export in your preferred format.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
                  width="300"
                  height="200"
                  alt="Edit and Share"
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full md:px-16 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <Badge variant="secondary">Benefits</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Save 90% of Your Documentation Time</h2>
                <p className="text-gray-500 md:text-lg">
                  Stop spending hours creating documentation manually. SOPify transforms what used to take days into a
                  process that takes minutes.
                </p>
                <div className="grid gap-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">10x Faster Creation</h4>
                      <p className="text-sm text-gray-500">Create comprehensive SOPs in minutes instead of hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">100% Accuracy</h4>
                      <p className="text-sm text-gray-500">Never miss a step with automatic action capture</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Consistent Quality</h4>
                      <p className="text-sm text-gray-500">Standardized formatting and professional presentation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Instant Updates</h4>
                      <p className="text-sm text-gray-500">Easily update SOPs when processes change</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070"
                  width="500"
                  height="400"
                  alt="Benefits Illustration"
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section
        // <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        //   <div className="container px-4 md:px-6">
        //     <div className="flex flex-col items-center justify-center space-y-4 text-center">
        //       <div className="space-y-2">
        //         <Badge variant="secondary">Pricing</Badge>
        //         <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Plan</h2>
        //         <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
        //           Start free and scale as your documentation needs grow.
        //         </p>
        //       </div>
        //     </div>
        //     <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-8">
        //       <Card className="relative">
        //         <CardHeader>
        //           <CardTitle>Starter</CardTitle>
        //           <CardDescription>Perfect for individuals and small teams</CardDescription>
        //           <div className="text-3xl font-bold">Free</div>
        //         </CardHeader>
        //         <CardContent className="space-y-4">
        //           <ul className="space-y-2 text-sm">
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Up to 5 SOPs per month
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Basic recording features
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               PDF export
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Email support
        //             </li>
        //           </ul>
        //           <Button className="w-full" variant="outline">
        //             Get Started Free
        //           </Button>
        //         </CardContent>
        //       </Card>
        //       <Card className="relative border-blue-200 shadow-lg">
        //         <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        //           <Badge className="bg-blue-600 text-white">Most Popular</Badge>
        //         </div>
        //         <CardHeader>
        //           <CardTitle>Professional</CardTitle>
        //           <CardDescription>For growing teams and businesses</CardDescription>
        //           <div className="text-3xl font-bold">
        //             $29
        //             <span className="text-lg font-normal text-gray-500">/month</span>
        //           </div>
        //         </CardHeader>
        //         <CardContent className="space-y-4">
        //           <ul className="space-y-2 text-sm">
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Unlimited SOPs
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Advanced AI features
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Multiple export formats
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Team collaboration
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Priority support
        //             </li>
        //           </ul>
        //           <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
        //         </CardContent>
        //       </Card>
        //       <Card className="relative">
        //         <CardHeader>
        //           <CardTitle>Enterprise</CardTitle>
        //           <CardDescription>For large organizations</CardDescription>
        //           <div className="text-3xl font-bold">Custom</div>
        //         </CardHeader>
        //         <CardContent className="space-y-4">
        //           <ul className="space-y-2 text-sm">
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Everything in Professional
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Custom integrations
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Advanced security
        //             </li>
        //             <li className="flex items-center">
        //               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        //               Dedicated support
        //             </li>
        //           </ul>
        //           <Button className="w-full" variant="outline">
        //             Contact Sales
        //           </Button>
        //         </CardContent>
        //       </Card>
        //     </div>
        //   </div>
        // </section> */}

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                  Ready to Transform Your Documentation?
                </h2>
                <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of teams who have already streamlined their SOP creation process with SOPify.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input type="email" placeholder="Enter your work email" className="max-w-lg flex-1 bg-white" />
                  <Button type="submit" variant="secondary">
                    Start Free Trial
                  </Button>
                </form>
                <p className="text-xs text-blue-100">14-day free trial. No credit card required.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer/>
      
    </div>
  )
}
