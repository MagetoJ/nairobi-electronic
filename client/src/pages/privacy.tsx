import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, Phone } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: [
        "Personal identification information (name, email address, phone number)",
        "Shipping and billing addresses for order processing",
        "Payment preferences and order history",
        "Website usage data and preferences",
        "Device information and IP address for security purposes"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders efficiently",
        "Communicate about your orders and delivery status",
        "Provide customer support and respond to inquiries",
        "Improve our website and services based on usage patterns",
        "Send promotional offers and updates (with your consent)"
      ]
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        "We do not sell or rent your personal information to third parties",
        "Information may be shared with delivery partners for order fulfillment",
        "We may share aggregated, non-personal data for business analysis",
        "Legal disclosure may occur if required by law or court order",
        "Service providers may access data to help us operate our business"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8" data-testid="privacy-page">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="page-title">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your privacy is important to us. Learn how we collect, use, and protect your information.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Last updated: August 31, 2025
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Introduction */}
        <Card>
          <CardContent className="p-8">
            <p className="text-muted-foreground leading-relaxed">
              Nairobi Electronics ("we," "our," or "us") is committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, disclose, and 
              safeguard your information when you use our website and services. By using our website, you 
              consent to the data practices described in this policy.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <section.icon className="w-6 h-6 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• SSL encryption for data transmission</li>
                  <li>• Secure database storage</li>
                  <li>• Regular security audits</li>
                  <li>• Access controls and monitoring</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Organizational Measures</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Staff training on data protection</li>
                  <li>• Limited access on need-to-know basis</li>
                  <li>• Data retention policies</li>
                  <li>• Incident response procedures</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You have the following rights regarding your personal information:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Access & Portability</h4>
                <p className="text-sm text-muted-foreground">
                  Request access to your personal data and receive a copy in a portable format.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Correction</h4>
                <p className="text-sm text-muted-foreground">
                  Request correction of inaccurate or incomplete personal information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Deletion</h4>
                <p className="text-sm text-muted-foreground">
                  Request deletion of your personal data, subject to legal requirements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Opt-out</h4>
                <p className="text-sm text-muted-foreground">
                  Unsubscribe from marketing communications at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your experience, analyze website traffic, 
              and remember your preferences.
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Essential Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Required for basic website functionality and cannot be disabled.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Preference Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Remember your settings and preferences for a better experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Contact Information */}
        <Card className="bg-muted/50">
          <CardContent className="p-8">
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-4">Questions About Privacy?</h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy or our data practices, 
                please don't hesitate to contact us.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@pctoday.co.ke</p>
                <p><strong>Phone:</strong> +254 717 888 333</p>
                <p><strong>Address:</strong> 10 Woodvale Grove, Nairobi, Kenya</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                <strong>Policy Updates:</strong> We may update this Privacy Policy from time to time. 
                We will notify you of any material changes by posting the new policy on this page 
                and updating the "Last updated" date.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}