import { NewSecret } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

export const DateTimeField = () => {
  const form = useFormContext<NewSecret>();
  const [parent] = useAutoAnimate();

  const handleTimeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(form.getValues("revealingDate"));
    const [hours, minutes] = e.target.value.split(":");

    if (!hours || !minutes) return;

    if (isNaN(parseInt(hours)) || isNaN(parseInt(minutes))) return;

    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    form.setValue("revealingDate", date);
  };

  return (
    <FormField
      control={form.control}
      name="revealingDate"
      render={({ field }) => (
        <FormItem ref={parent}>
          <FormLabel>Revealing Date</FormLabel>

          <Popover>
            <PopoverTrigger asChild className="w-full max-w-[320px]">
              <FormControl>
                <Button
                  className={cn(
                    "w-full bg-popover pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  variant={"outline"}
                >
                  {!!field.value ? (
                    <span>{format(field.value, "PPp")}</span>
                  ) : (
                    <span>Pick a date in the future</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="max-w-[320px] p-0" align="start">
              <Calendar
                mode="single"
                onSelect={field.onChange}
                onDayBlur={field.onBlur}
                disabled={(date) => date < subDays(new Date(), 1)}
                selected={field.value && new Date(field.value)}
                defaultMonth={field.value ? new Date(field.value) : new Date()}
              />

              <Separator />

              <div className="flex flex-col gap-2 p-2">
                <Label htmlFor="time">Select time (24h format)</Label>
                <Input
                  type="time"
                  id="time"
                  className="bg-transparent"
                  onBlur={field.onBlur}
                  disabled={!field.value}
                  onChange={handleTimeSelect}
                  value={field.value ? format(field.value, "HH:mm") : ""}
                />
              </div>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
