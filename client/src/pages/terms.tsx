import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Scale, ShoppingCart, Truck, RefreshCw, Phone } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      icon: ShoppingCart,
      title: "Orders and Payments",
      content: [
        "All orders are subject to availability and confirmation",
        "Prices are listed in Kenyan Shillings (KSh) and include applicable taxes",
        "We currently accept cash-on-delivery (COD) payments only",
        "Payment must be made in full upon delivery of the products",
        "We reserve the right to refuse or cancel orders for any reason"
      ]
    },
    {
      icon: Truck,
      title: "Shipping and Delivery",
      content: [
        "Same-day delivery available within Nairobi for orders placed before 2 PM",
        "Next-day delivery available for other parts of Kenya",
        "Delivery charges may apply based on location and order value",
        "You must be available to receive your order at the specified address",
        "Delivery times are estimates and may vary due to unforeseen circumstances"
      ]
    },
    {
      icon: RefreshCw,
      title: "Returns and Refunds",
      content: [
        "Products may be returned within 7 days if unopened and in original packaging",
        "Electronics must be returned with all original accessories and documentation",
        "Defective products will be replaced or refunded at our discretion",
        "Return shipping costs are the responsibility of the customer unless product is defective",
        "Refunds will be processed within 7-14 business days"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8" data-testid="terms-page">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="page-title">Terms of Service</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Please read these terms carefully before using our services.
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
              Welcome to PC Today. These Terms of Service ("Terms") govern your use of our website 
              and services. By accessing or using our website, you agree to be bound by these Terms. 
              If you disagree with any part of these terms, you may not access our service.
            </p>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-primary" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              By using PC Today's website and services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Important Notes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You must be at least 18 years old to make purchases</li>
                <li>• These terms may be updated periodically</li>
                <li>• Continued use of our services constitutes acceptance of updated terms</li>
              </ul>
            </div>
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

        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information and Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We strive to provide accurate product information, but we cannot guarantee that all 
              product descriptions, prices, and availability are completely accurate, complete, 
              reliable, current, or error-free.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Product Images</h4>
                <p className="text-sm text-muted-foreground">
                  Product images are for illustration purposes. Actual products may vary slightly 
                  in appearance due to monitor settings and manufacturing variations.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Pricing</h4>
                <p className="text-sm text-muted-foreground">
                  Prices are subject to change without notice. We reserve the right to modify 
                  prices and correct pricing errors on our website.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              As a user of our services, you agree to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-green-700">You May:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Browse and purchase products for personal use</li>
                  <li>• Create an account with accurate information</li>
                  <li>• Contact us for support and inquiries</li>
                  <li>• Leave honest reviews and feedback</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-700">You May Not:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use our services for illegal purposes</li>
                  <li>• Attempt to hack or compromise our systems</li>
                  <li>• Share false or misleading information</li>
                  <li>• Resell products for commercial purposes without permission</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              PC Today shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including loss of profits, data, use, goodwill, or other 
              intangible losses resulting from your use of our services.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Disclaimer:</h4>
              <p className="text-sm text-yellow-700">
                Our liability is limited to the maximum extent permitted by applicable law. 
                In no event shall our total liability exceed the amount paid by you for the 
                specific product or service that gave rise to the claim.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The content on this website, including text, graphics, logos, images, and software, 
              is the property of PC Today or its content suppliers and is protected by copyright 
              and other intellectual property laws.
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Trademarks</h4>
                <p className="text-sm text-muted-foreground">
                  PC Today and our logo are trademarks of our company. All other trademarks 
                  are the property of their respective owners.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Usage Rights</h4>
                <p className="text-sm text-muted-foreground">
                  You may not reproduce, distribute, or create derivative works from our content 
                  without explicit written permission.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of Kenya. 
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction 
              of the courts in Nairobi, Kenya.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Contact Information */}
        <Card className="bg-muted/50">
          <CardContent className="p-8">
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-4">Questions About These Terms?</h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@pctoday.co.ke</p>
                <p><strong>Phone:</strong> +254 717 888 333</p>
                <p><strong>Address:</strong> 10 Woodvale Grove, Nairobi, Kenya</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                <strong>Changes to Terms:</strong> We reserve the right to modify these Terms of Service 
                at any time. Changes will be effective immediately upon posting on this page. 
                Your continued use of our services after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}