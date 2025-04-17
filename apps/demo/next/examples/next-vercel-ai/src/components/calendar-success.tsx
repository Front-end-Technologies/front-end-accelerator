import { CheckCircle, CalendarIcon, Clock, Users, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CalendarApprovalProps {
  title: string
  startDate: Date
  endDate: Date
  attendees?: string[]
  state: "success" | "denied"
}

export function CalendarApproval({ title, startDate, endDate, attendees, state }: CalendarApprovalProps) {
  console.log("CalendarApproval component rendered: ", startDate)
  // Format dates for display
  const formattedStartDate = startDate.toLocaleDateString();
  const formattedStartTime = startDate.toLocaleTimeString();
  const formattedEndTime = endDate.toLocaleTimeString();

  // Determine colors and icon based on state
  const isSuccess = state === "success";
  const borderColor = isSuccess ? "border-green-200" : "border-red-200";
  const bgColor = isSuccess ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950";
  const textColor = isSuccess ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300";
  const iconColor = isSuccess ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <Card className={`border ${borderColor} ${bgColor}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <CardTitle className={`text-lg font-semibold ${textColor}`}>
            {isSuccess ? "Meeting Added to Calendar" : "Meeting Denied"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="font-medium">{title}</div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{formattedStartDate}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {formattedStartTime} - {formattedEndTime}
          </span>
        </div>
        {attendees && attendees.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{attendees.length} attendees</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}