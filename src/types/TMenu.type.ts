import React from 'react'

export type TMenuItem = {
    name: string
    route: string
    icon?: React.JSX.Element
    page: React.JSX.Element
    permission?: string
}

export type MenuLayout = TMenuItem[]
