import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const localIsraelPhoneFormat = (internationalNumber: string) => {
  return internationalNumber.replace("+972", "0");
};