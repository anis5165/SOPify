'use client';
import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Users,
  FileText,
  Download,
  Eye,
  Code,
  PenTool,
  Target,
  Image as ImageIcon,
  Sparkles,
  Star,
  HeartHandshake,
  Rocket,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";

const AboutUs = () => {
  const features = [
    {
      icon: <Lightbulb color="#facc15" size={32} />,
      title: "Template Guidance",
      text: "Pre-designed SOP templates with suggestions.",
    },
    {
      icon: <Users color="#10b981" size={32} />,
      title: "Team Collaboration",
      text: "Invite others to view, comment or review SOPs.",
    },
    {
      icon: <FileText color="#3b82f6" size={32} />,
      title: "Content Editing",
      text: "Fully editable sections for personalized inputs.",
    },
    {
      icon: <Download color="#ef4444" size={32} />,
      title: "Multi-format Export",
      text: "Export to PDF, DOCX, JPG, PNG, and more.",
    },
    {
      icon: <Code color="#8b5cf6" size={32} />,
      title: "Automatic Screenshot",
      text: "Captures workflow and highlights actions.",
    },
    {
      icon: <PenTool color="#f472b6" size={32} />,
      title: "Design Tools",
      text: "Use fonts, spacing, and styles for a clean layout.",
    },
  ];

  const team = [
    {
      name: "Anamika Singh",
      role: "Backend Developer",
      image: "girl.jpg",
      tasks: [],
    },
    {
      name: "Yadav Ruchi Tulsiram",
      role: "Frontend Developer",
      image: "girl.jpg",
      tasks: [],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl">SOPify</span>
                </div>
                <Badge variant="secondary">About Us</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Transforming SOP Creation
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  We're on a mission to revolutionize how businesses create and manage their Standard Operating Procedures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="w-full md:16 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Our Vision</CardTitle>
                  <CardDescription>
                    We envision a world where SOP creation is no longer a tedious task but an automated, intuitive process. SOPify empowers educators, businesses, and professionals to document efficiently, boost productivity, and maintain consistency.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Our Mission</CardTitle>
                  <CardDescription>
                    Our mission is to eliminate the manual hassle of SOP documentation by delivering smart, automated tools that streamline the creation, customization, and sharing of process guides – helping teams save time and scale faster.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Key Features
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Discover what makes SOPify the ultimate solution for SOP creation
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {features.map((feature, idx) => (
                <Card key={idx} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.text}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Team</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Meet Our Team
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  The passionate people behind SOPify
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              {team.map((member, idx) => (
                <Card key={idx} className="relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

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
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
