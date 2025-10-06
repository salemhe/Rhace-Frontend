import { Button } from '@/components/ui/button'
import React from 'react'

const DashboardButton = ({ text, icon, variant, className, onClick, disabled }) => {
  return (
    <Button onClick={onClick} disabled={disabled} className={`py-2 h-10 px-3 gap-2 flex items-center rounded-lg ${className} ${variant === "primary" ? "bg-[#0A6C6D] hover:bg-[#0A6C5D] text-white" : "border bg-white hover:bg-gray-100 border-[#E5E7EB] text-[#111827]"}`}> 
        {icon && <span className='size-5'>{icon}</span>}
        {text && <span className='font-medium'>{text}</span>}
    </Button>
  )
}

export default DashboardButton