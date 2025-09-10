import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageMetadata } from "@/hooks/use-page-metadata";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  usePageMetadata("contact");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
  });

  const createContactMessageMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return apiRequest("POST", "/api/contact-messages", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertContactMessage) => {
    setIsSubmitting(true);
    try {
      await createContactMessageMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const heroRef = useScrollAnimation();
  const formRef = useScrollAnimation();
  const infoRef = useScrollAnimation();

  return (
    <Layout>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative h-[60vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cg fill-opacity=%22.1%22%3E%3Cpolygon fill=%22%23000%22 points=%2250,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40%22/%3E%3C/g%3E%3C/svg%3E')] bg-[length:60px_60px]"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Get in Touch
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
                Have questions about Sonic Paths? Share a music discovery? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div ref={formRef} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Send us a message
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Whether you're a venue owner, artist, or music lover, we're here to help connect the world through extraordinary musical experiences.
                  </p>
                </div>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl">Contact Form</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          data-testid="input-name"
                          {...register("name")}
                          placeholder="Your full name"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          data-testid="input-email"
                          {...register("email")}
                          placeholder="your.email@example.com"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          data-testid="textarea-message"
                          {...register("message")}
                          placeholder="Tell us about your music discovery, venue, or any questions you have..."
                          rows={6}
                          className={errors.message ? "border-red-500" : ""}
                        />
                        {errors.message && (
                          <p className="text-sm text-red-500">{errors.message.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        data-testid="button-send-message"
                        disabled={isSubmitting || createContactMessageMutation.isPending}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-600 hover:border-orange-700 transition-all duration-200"
                        size="lg"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting || createContactMessageMutation.isPending
                          ? "Sending..."
                          : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div ref={infoRef} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Connect with us
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Join our community of music explorers and help us map the world's most extraordinary musical experiences.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-l-4 border-l-orange-500 border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                          <Mail className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">Email Us</h3>
                          <p className="text-slate-600">
                            General inquiries and music submissions
                          </p>
                          <p className="text-orange-600 font-medium mt-1">
                            hello@sonicpaths.com
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-orange-500 border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                          <MapPin className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">Our Mission</h3>
                          <p className="text-slate-600">
                            Discovering and sharing extraordinary musical experiences from every corner of the globe
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-orange-500 border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                          <Phone className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">Join the Community</h3>
                          <p className="text-slate-600">
                            Share your discoveries, connect with fellow music lovers, and explore new sonic territories
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Submit a Musical Discovery
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Know an incredible musical experience that should be on our map? Tell us about it!
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-orange-600 text-orange-700 hover:bg-orange-600 hover:text-white transition-all duration-200"
                  >
                    <a href="/">Submit an Event</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}