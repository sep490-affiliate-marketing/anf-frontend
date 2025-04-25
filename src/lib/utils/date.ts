import { format } from "date-fns"
import { vi } from "date-fns/locale"

export const formatDate = (
  date: Date | string,
  pattern: string = "dd/MM/yyyy"
) => {
  if (!date) return ""
  return format(new Date(date), pattern, { locale: vi })
}

export const formatDateTime = (date: Date | string) => {
  if (!date) return ""
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi })
}
