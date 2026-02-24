"use client";

import * as React from "react";
import * as yup from "yup";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SEPARATOR = "/";

function formatDateToMask(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}/${mm}/${yyyy}`;
}

function formatDateTimeToMask(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const hh = String(hours).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${minutes} ${ampm}`;
}

function parseMaskedDate(masked: string): Date | null {
  const match = masked.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const m = Number(mm);
  const d = Number(dd);
  const y = Number(yyyy);
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900) return null;
  const date = new Date(y, m - 1, d);
  // Validate the date didn't overflow (e.g. 02/30 → March 02)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  )
    return null;
  return date;
}

function parseMaskedDateTime(masked: string): Date | null {
  const match = masked.match(
    /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) (AM|PM)$/,
  );
  if (!match) return null;
  const [, dd, mm, yyyy, hh, min, ampm] = match;
  const m = Number(mm);
  const d = Number(dd);
  const y = Number(yyyy);
  let h = Number(hh);
  const mins = Number(min);

  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900) return null;
  if (h < 1 || h > 12 || mins < 0 || mins > 59) return null;

  // Convert to 24-hour format
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;

  const date = new Date(y, m - 1, d, h, mins);
  // Validate the date didn't overflow
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  )
    return null;
  return date;
}

const dateSchema = yup
  .string()
  .test(
    "valid-date",
    "Invalid date. Please enter a valid date in DD/MM/YYYY format.",
    (value: string | undefined) => {
      if (!value || value.length === 0) return true;
      if (value.length < 10) return true;
      return parseMaskedDate(value) !== null;
    },
  );

const dateTimeSchema = yup
  .string()
  .test(
    "valid-datetime",
    "Invalid date/time. Please enter in DD/MM/YYYY HH:MM AM/PM format.",
    (value: string | undefined) => {
      if (!value || value.length === 0) return true;
      if (value.length < 22) return true;
      return parseMaskedDateTime(value) !== null;
    },
  );

function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) result += SEPARATOR;
    result += digits[i];
  }
  return result;
}

interface DatePickerInputProps {
  id?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
}

function DatePickerInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  className,
  showTime = false,
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(
    value || new Date(),
  );
  const [inputValue, setInputValue] = React.useState(
    showTime ? formatDateTimeToMask(value) : formatDateToMask(value),
  );
  const [validationError, setValidationError] = React.useState<string | null>(
    null,
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const defaultPlaceholder = showTime ? "DD/MM/YYYY HH:MM AM/PM" : "DD/MM/YYYY";

  React.useEffect(() => {
    setInputValue(
      showTime ? formatDateTimeToMask(value) : formatDateToMask(value),
    );
    setMonth(value || new Date());
    setValidationError(null);
  }, [value, showTime]);

  const validate = (masked: string) => {
    try {
      if (showTime) {
        dateTimeSchema.validateSync(masked);
      } else {
        dateSchema.validateSync(masked);
      }
      setValidationError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setValidationError(err.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const masked = applyMask(rawValue);
    setInputValue(masked);

    validate(masked);

    const parsed = parseMaskedDate(masked);
    if (parsed) {
      onChange?.(parsed);
      setMonth(parsed);
    } else if (masked.length === 0) {
      onChange?.(undefined);
    }

    const cursorPos = masked.length;
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      return;
    }

    const input = e.currentTarget;
    const pos = input.selectionStart ?? 0;

    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "Home" ||
      e.key === "End" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      ((e.ctrlKey || e.metaKey) &&
        ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase()))
    ) {
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (pos === 0) return;

      let newPos = pos - 1;
      if (inputValue[newPos] === SEPARATOR) {
        newPos--;
      }
      if (newPos < 0) return;

      const digits = inputValue.replace(/\D/g, "");
      let digitIndex = 0;
      for (let i = 0; i < newPos; i++) {
        if (inputValue[i] !== SEPARATOR) digitIndex++;
      }

      const newDigits =
        digits.slice(0, digitIndex) + digits.slice(digitIndex + 1);
      const masked = applyMask(newDigits);
      setInputValue(masked);
      validate(masked);

      const parsed = parseMaskedDate(masked);
      if (parsed) {
        onChange?.(parsed);
        setMonth(parsed);
      } else if (masked.length === 0) {
        onChange?.(undefined);
      }

      const cursorTarget = Math.max(0, newPos);
      const adjustedPos =
        masked.length < cursorTarget ? masked.length : cursorTarget;
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(adjustedPos, adjustedPos);
      });
      return;
    }

    if (e.key === "Delete") {
      e.preventDefault();
      let delPos = pos;
      if (inputValue[delPos] === SEPARATOR) {
        delPos++;
      }
      if (delPos >= inputValue.length) return;

      const digits = inputValue.replace(/\D/g, "");
      let digitIndex = 0;
      for (let i = 0; i < delPos; i++) {
        if (inputValue[i] !== SEPARATOR) digitIndex++;
      }

      const newDigits =
        digits.slice(0, digitIndex) + digits.slice(digitIndex + 1);
      const masked = applyMask(newDigits);
      setInputValue(masked);
      validate(masked);

      const parsed = parseMaskedDate(masked);
      if (parsed) {
        onChange?.(parsed);
        setMonth(parsed);
      } else if (masked.length === 0) {
        onChange?.(undefined);
      }

      requestAnimationFrame(() => {
        const adjustedPos = Math.min(pos, masked.length);
        inputRef.current?.setSelectionRange(adjustedPos, adjustedPos);
      });
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    const digits = inputValue.replace(/\D/g, "");
    if (digits.length >= 8) {
      e.preventDefault();
    }
  };

  const handleTimeChange = (type: "hour" | "minute" | "ampm", val: string) => {
    if (value) {
      const newDate = new Date(value);
      if (type === "hour") {
        const currentHours = newDate.getHours();
        const isPM = currentHours >= 12;
        newDate.setHours((parseInt(val) % 12) + (isPM ? 12 : 0));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(val));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        if (val === "PM" && currentHours < 12) {
          newDate.setHours(currentHours + 12);
        } else if (val === "AM" && currentHours >= 12) {
          newDate.setHours(currentHours - 12);
        }
      }
      onChange?.(newDate);
      setInputValue(formatDateTimeToMask(newDate));
    }
  };

  const currentYear = new Date().getFullYear();
  const hasError = !!validationError;
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          value={inputValue}
          placeholder={placeholder || defaultPlaceholder}
          required={required}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          className="pr-10"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
              aria-label="Open calendar"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            sideOffset={8}
          >
            <div className={showTime ? "sm:flex" : ""}>
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={value}
                month={month}
                onMonthChange={setMonth}
                startMonth={new Date(currentYear - 10, 0)}
                endMonth={new Date(currentYear + 10, 11)}
                onSelect={(date: Date | undefined) => {
                  if (date) {
                    // Preserve time if it exists
                    if (value && showTime) {
                      date.setHours(value.getHours());
                      date.setMinutes(value.getMinutes());
                    } else if (showTime) {
                      // Set default time to current time
                      const now = new Date();
                      date.setHours(now.getHours());
                      date.setMinutes(now.getMinutes());
                    }
                  }
                  onChange?.(date);
                  setInputValue(
                    showTime
                      ? formatDateTimeToMask(date)
                      : formatDateToMask(date),
                  );
                  setValidationError(null);
                  if (!showTime) {
                    setOpen(false);
                  }
                }}
              />
              {showTime && (
                <div className="flex flex-col sm:flex-row sm:h-75 divide-y sm:divide-y-0 sm:divide-x">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {hours.reverse().map((hour) => (
                        <Button
                          key={hour}
                          size="icon"
                          variant={
                            value && value.getHours() % 12 === hour % 12
                              ? "default"
                              : "ghost"
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() =>
                            handleTimeChange("hour", hour.toString())
                          }
                        >
                          {hour}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(
                        (minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            variant={
                              value && value.getMinutes() === minute
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() =>
                              handleTimeChange("minute", minute.toString())
                            }
                          >
                            {minute.toString().padStart(2, "0")}
                          </Button>
                        ),
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="">
                    <div className="flex sm:flex-col p-2">
                      {["AM", "PM"].map((ampm) => (
                        <Button
                          key={ampm}
                          size="icon"
                          variant={
                            value &&
                            ((ampm === "AM" && value.getHours() < 12) ||
                              (ampm === "PM" && value.getHours() >= 12))
                              ? "default"
                              : "ghost"
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() => handleTimeChange("ampm", ampm)}
                        >
                          {ampm}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {hasError && (
        <p className="text-xs text-destructive">{validationError}</p>
      )}
    </div>
  );
}

export {
  DatePickerInput,
  // eslint-disable-next-line react-refresh/only-export-components
  parseMaskedDate,
  // eslint-disable-next-line react-refresh/only-export-components
  parseMaskedDateTime,
  // eslint-disable-next-line react-refresh/only-export-components
  formatDateToMask,
  // eslint-disable-next-line react-refresh/only-export-components
  formatDateTimeToMask,
  // eslint-disable-next-line react-refresh/only-export-components
  dateSchema,
  // eslint-disable-next-line react-refresh/only-export-components
  dateTimeSchema,
};
