import { CalendarIcon, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { APPROVAL } from "@/lib/utils"

interface CalendarMeetingProps {
  title: string
  startDate: Date
  endDate: Date
  attendees?: string[]
  description?: string
  location?: string
  toolCallId: string
  onConfirm: ({ toolCallId, result, }: {
    toolCallId: string;
    result: unknown;
}) => void;
}

export function CalendarConfirmation({
  title,
  startDate,
  endDate,
  attendees,
  description,
  location,
  toolCallId,
  onConfirm,
}: CalendarMeetingProps) {
  const handleConfirm = () => {
    onConfirm({toolCallId, result: APPROVAL.YES})
  }

  const handleDeny = () => {
    onConfirm({toolCallId, result: APPROVAL.NO})
  }
  console.log("CalendarConfirmation component rendered: ", startDate)

  // Format dates for display
  const formattedStartDate = startDate.toLocaleDateString();
  const formattedStartTime = startDate.toLocaleTimeString();
  const formattedEndTime = endDate.toLocaleTimeString();

  return (
    <Card className="w-full border border-muted-foreground/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Would you like to add this meeting to your calendar?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div className="font-medium">{title}</div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4 mt-0.5" />
          <div>{formattedStartDate}</div>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mt-0.5" />
          <div>
            {formattedStartTime} - {formattedEndTime}
          </div>
        </div>
        {location && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5" />
            <div>{location}</div>
          </div>
        )}
        {attendees && attendees.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 mt-0.5" />
            <div className="flex flex-col">
              {attendees.map((attendee, i) => (
                <span key={i}>{attendee}</span>
              ))}
            </div>
          </div>
        )}
        {description && (
          <div className="text-sm text-muted-foreground">
            <div className="font-medium mb-1">Description:</div>
            <div>{description}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button variant="outline" size="sm" onClick={handleDeny}>
          Decline
        </Button>
        <Button size="sm" onClick={handleConfirm}>
          Add to Calendar
        </Button>
      </CardFooter>
    </Card>
  )
}
