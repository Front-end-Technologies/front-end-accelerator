import {
  MapPin,
  Calendar,
  DollarSign,
  Compass,
  Clock,
  Home,
  Coffee,
  Utensils,
  Camera,
  LightbulbIcon,
  Loader2,
  Plane,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itinerarySchema } from "@/app/api/chat/structured-outputs/schema";
import { z } from "zod";
import { DeepPartial } from "ai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";

interface TravelItineraryViewerProps {
  readonly itinerary: DeepPartial<z.infer<typeof itinerarySchema>>;
  readonly isLoading: boolean;
}

export default function TravelItineraryViewer({
  itinerary,
  isLoading,
}: TravelItineraryViewerProps) {
  // Helper function to get activity icon based on activity text
  const getActivityIcon = (activity = "") => {
    const lowerActivity = activity.toLowerCase();
    if (
      lowerActivity.includes("breakfast") ||
      lowerActivity.includes("coffee")
    ) {
      return <Coffee className="h-4 w-4" />;
    } else if (
      lowerActivity.includes("lunch") ||
      lowerActivity.includes("dinner") ||
      lowerActivity.includes("eat")
    ) {
      return <Utensils className="h-4 w-4" />;
    } else if (
      lowerActivity.includes("tour") ||
      lowerActivity.includes("visit") ||
      lowerActivity.includes("explore")
    ) {
      return <Compass className="h-4 w-4" />;
    } else if (
      lowerActivity.includes("photo") ||
      lowerActivity.includes("view")
    ) {
      return <Camera className="h-4 w-4" />;
    } else {
      return <Briefcase className="h-4 w-4" />;
    }
  };

  if (isLoading && !itinerary.destination?.city) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Crafting your perfect itinerary...</p>
          <p className="text-sm text-muted-foreground mt-2">
            This may take a moment as we plan your dream trip
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Destination Header */}
      {itinerary.destination && (
        <Card className="gradient-lr border-0 text-white">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {itinerary.destination.city ?? "Your Destination"}
                </h3>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{itinerary.destination.country ?? "Loading..."}</span>
                </div>
              </div>
              <Plane className="h-10 w-10 rotate-45" />
            </div>

            {itinerary.destination.bestTimeToVisit && (
              <div className="mt-4 text-sm">
                <span className="font-semibold">Best time to visit:</span>{" "}
                {itinerary.destination.bestTimeToVisit}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Trip Details */}
      {itinerary.tripDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg ">Trip Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 border border-purple-300 rounded-lg">
                <Calendar className="h-5 w-5 mb-2 text-purple-300" />
                <span className="text-xs text-gray-500">Duration</span>
                <span className="font-medium text-center text-white">
                  {itinerary.tripDetails.duration ?? "TBD"}
                </span>
              </div>
              <div className="flex flex-col items-center p-3  border border-purple-300 rounded-lg">
                <DollarSign className="h-5 w-5 mb-2 text-purple-300" />
                <span className="text-xs text-gray-500">Budget</span>
                <span className="font-medium text-center text-white">
                  {itinerary.tripDetails.budget ?? "TBD"}
                </span>
              </div>
              <div className="flex flex-col items-center p-3  border border-purple-300 rounded-lg">
                <Compass className="h-5 w-5 mb-2 text-purple-300" />
                <span className="text-xs text-gray-500">Style</span>
                <span className="font-medium text-center text-white">
                  {itinerary.tripDetails.travelStyle ?? "TBD"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Plans */}
      {itinerary.dailyPlans && itinerary.dailyPlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Itinerary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {itinerary.dailyPlans.map(
                (day, index) =>
                  day && (
                    <AccordionItem
                      key={"accordion-item-" + index}
                      value={`day-${index}`}
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:cursor-pointer">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            Day {day.day}
                          </Badge>
                          <span className="font-medium">
                            {day.activities
                              ? day.activities[0]?.location
                              : "Activities planned"}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="space-y-4">
                          {/* Activities */}
                          {day.activities?.map(
                            (activity, actIndex) =>
                              activity && (
                                <div
                                  key={"activity-" + actIndex}
                                  className="flex items-start space-x-3 p-3 rounded-lg border"
                                >
                                  {getActivityIcon(activity.activity)}
                                  <div className="flex-1">
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1 text-gray-500" />
                                      <span className="text-xs text-gray-500">
                                        {activity.time}
                                      </span>
                                    </div>
                                    {activity.location && (
                                      <div className="flex items-center mt-1 text-sm text-white">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span>{activity.location}</span>
                                      </div>
                                    )}
                                    <div className="font-medium mt-1">
                                      {activity.activity}
                                    </div>

                                    {activity.notes && (
                                      <div className="mt-2 text-sm text-white italic">
                                        {activity.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                          )}

                          {/* Accommodation */}
                          {day.accommodation && (
                            <div className="flex items-start space-x-3 p-3 rounded-lg border mt-4">
                              <Home className="h-4 w-4 mt-0.5 text-purple-600" />
                              <div>
                                <div className="font-medium">
                                  {day.accommodation.name}
                                </div>
                                <div className="text-sm text-white mt-1">
                                  {day.accommodation.type}
                                </div>
                                {day.accommodation.address && (
                                  <div className="text-sm text-white mt-1">
                                    {day.accommodation.address}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
              )}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Travel Tips */}
      {itinerary.tips && itinerary.tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Local Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {itinerary.tips.map((tip, index) => (
                <li key={"tip-" + index} className="flex items-start space-x-2">
                  <LightbulbIcon className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Loading State for Partial Data */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center p-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Generating more details...</span>
        </div>
      )}
    </div>
  );
}
