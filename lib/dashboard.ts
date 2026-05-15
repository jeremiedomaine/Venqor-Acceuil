export type EventIcon = "heart" | "building" | "stars"

export type EventItem = {
  id: string
  title: string
  date: string
  badge: string
  badgeColor: string
  icon: EventIcon
  iconColor: string
  dotColor: string
  guests: string
}
