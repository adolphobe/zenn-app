
import { parseDate, isDateValid } from './dateParser';
import { 
  formatDisplayDate,
  formatRelativeDate,
  formatDateDistance,
  formatToISOString,
  formatForDateTimeInput,
  formatWithOptions,
  setDefaultFormatLocale,
  setDefaultFormats
} from './dateFormatter';
import {
  formatInTimeZone,
  toZonedTime,
  fromZonedTime,
  getTimezoneOffsetMinutes,
  getDefaultTimeZone,
  setDefaultTimeZone
} from './dateTimezone';
import {
  addDaysToDate,
  getDaysDifference,
  isSameDate,
  isToday,
  isYesterday,
  startOfDay,
  endOfDay,
  isDateBefore,
  isDateAfter,
  isTaskOverdue
} from './dateOperations';
import { DateFormatConfig } from '@/types/dates';

// Export all date modules
export {
  // Parser
  parseDate,
  isDateValid,
  
  // Formatter
  formatDisplayDate,
  formatRelativeDate,
  formatDateDistance,
  formatToISOString,
  formatForDateTimeInput,
  formatWithOptions,
  setDefaultFormatLocale,
  setDefaultFormats,
  
  // Timezone
  formatInTimeZone,
  toZonedTime,
  fromZonedTime,
  getTimezoneOffsetMinutes,
  getDefaultTimeZone,
  setDefaultTimeZone,
  
  // Operations
  addDaysToDate,
  getDaysDifference,
  isSameDate,
  isToday,
  isYesterday,
  startOfDay,
  endOfDay,
  isDateBefore,
  isDateAfter,
  isTaskOverdue
};

// Configuration type
export type { DateFormatConfig };
