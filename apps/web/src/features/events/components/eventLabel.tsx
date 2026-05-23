import { IconShieldCheck, IconTag, IconUsersGroup } from "@tabler/icons-react"
import type { EventLabelData } from "../types"

type EventLabelProps = EventLabelData

const labelIconByType: Record<string, typeof IconTag> = {
  verified: IconShieldCheck,
  community: IconUsersGroup,
  tag: IconTag,
}

const labelClassNameByType: Record<string, string> = {
  verified: "border-[#e7dbff] bg-white text-[#6a35d6] shadow-[0_10px_24px_-18px_rgba(106,53,214,0.65)]",
  community: "border-[#dcefe0] bg-white text-[#2f7a4f] shadow-[0_10px_24px_-18px_rgba(47,122,79,0.65)]",
  tag: "border-[#ede2c5] bg-white text-[#9a6716] shadow-[0_10px_24px_-18px_rgba(154,103,22,0.65)]",
}

export function EventLabel({ type, text }: EventLabelProps) {
  const Icon = labelIconByType[type] ?? IconTag
  const className = labelClassNameByType[type] ?? labelClassNameByType.tag

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${className}`}>
      <Icon size={16} stroke={2} />
      <span>{text}</span>
    </div>
  )
}
