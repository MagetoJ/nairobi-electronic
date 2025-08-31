import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Clock, Shield, Truck } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Shield,
      title: "Trusted Electronics",
      description: "All products are genuine and come with manufacturer warranties"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Same-day delivery within Nairobi, next-day delivery nationwide"
    },
    {
      icon: Phone,
      title: "Expert Support",
      description: "Our tech experts are here to help you choose the right products"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8" data-testid="about-page">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="page-title">About Nairobi Electronics</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Kenya's premier electronics marketplace, bringing you the latest technology 
          at unbeatable prices with exceptional service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Our Story */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Founded in Nairobi, Nairobi Electronics has been serving Kenya's tech community for years. 
              We started with a simple mission: to make high-quality electronics accessible 
              to everyone across Kenya.
            </p>
            <p className="text-muted-foreground">
              From laptops and smartphones to gaming equipment and audio gear, we curate 
              only the best products from trusted brands. Our team of tech enthusiasts 
              ensures every product meets our high standards for quality and value.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">Est. 2020</Badge>
              <Badge variant="secondary">1000+ Products</Badge>
              <Badge variant="secondary">Kenya-Wide Delivery</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Store Location</p>
                  <p className="text-sm text-muted-foreground">
                    10 Woodvale Grove, Nairobi, Kenya
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    +254 717 888 333
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    info@pctoday.co.ke
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Mon-Sat: 8:00 AM - 8:00 PM<br/>
                    Sunday: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Nairobi Electronics?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            To democratize access to cutting-edge technology across Kenya by providing 
            authentic, affordable electronics with exceptional customer service and 
            convenient cash-on-delivery options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}