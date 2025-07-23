import { useState } from "react";
import { Loader2, Plus, MapPin, Calendar, Link as LinkIcon, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEventForm } from "../hooks/useEventForm";
import { useCategories } from "@/hooks/use-categories";
import { EventFormData } from "@/types";
import locations from "@/lib/locations.json";

interface CreateEventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  defaultValues?: Partial<EventFormData>;
  fromDashboard?: boolean;
  buttonText?: string;
  title?: string;
}

export function CreateEventForm({ 
  onSubmit, 
  defaultValues, 
  fromDashboard = false,
  buttonText = "Submit Event",
  title = "Create New Event"
}: CreateEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, processFormData } = useEventForm(defaultValues);
  const { data: categories = [] } = useCategories();

  const watchedContinent = form.watch("continent");
  const watchedCountry = form.watch("country");

  const continents = Object.keys(locations);
  const countries = watchedContinent 
    ? Object.keys(locations[watchedContinent as keyof typeof locations] || {})
    : [];
  const cities = (watchedContinent && watchedCountry)
    ? (locations[watchedContinent as keyof typeof locations]?.[watchedCountry as keyof typeof locations[keyof typeof locations]] || [])
    : [];

  const genreCategories = categories.filter(cat => cat.type === 'genre');
  const settingCategories = categories.filter(cat => cat.type === 'setting');
  const eventTypeCategories = categories.filter(cat => cat.type === 'eventType');

  const handleSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      const processedData = processFormData({
        ...data,
        fromDashboard,
        formType: fromDashboard ? 'dashboard_form' : 'home_page_public_form'
      });
      
      console.log('📝 Form submission payload:', processedData);
      await onSubmit(processedData);
      console.log('✅ Form submission success');
      
      // Reset form on success
      form.reset();
    } catch (error) {
      console.error('❌ Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Hero Image URL *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the event..." 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description *</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Provide detailed information about the event..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Event Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Instagram Link
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="continent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Continent *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("country", "");
                          form.setValue("city", "");
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select continent" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {continents.map((continent) => (
                            <SelectItem key={continent} value={continent}>
                              {continent}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("city", "");
                        }} 
                        value={field.value}
                        disabled={!watchedContinent}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!watchedCountry}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Categories */}
            {(genreCategories.length > 0 || settingCategories.length > 0 || eventTypeCategories.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {genreCategories.length > 0 && (
                    <FormField
                      control={form.control}
                      name="genreIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genres</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              const currentValues = field.value || [];
                              if (!currentValues.includes(value)) {
                                field.onChange([...currentValues, value]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select genres" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genreCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {settingCategories.length > 0 && (
                    <FormField
                      control={form.control}
                      name="settingIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Settings</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              const currentValues = field.value || [];
                              if (!currentValues.includes(value)) {
                                field.onChange([...currentValues, value]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select settings" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {settingCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {eventTypeCategories.length > 0 && (
                    <FormField
                      control={form.control}
                      name="eventTypeIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Types</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              const currentValues = field.value || [];
                              if (!currentValues.includes(value)) {
                                field.onChange([...currentValues, value]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select event types" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eventTypeCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 px-8"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {buttonText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}