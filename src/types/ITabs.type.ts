import React from "react"

export type TabItem = {
    id: number
    label: string
}

export type TabGroup = TabItem[]

export type ContentTab = {
    id: number
    element: React.ReactNode
}

export type ContentTabGroup = ContentTab[]

