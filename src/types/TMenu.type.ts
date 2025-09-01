import React from 'react'

export type TMenuItem = {
    name: string
    route?: string
    icon?: React.ReactNode
    page?: React.ReactNode
    permission?: string
    subMenu?: {
        name: string
        route: string,
        icon?: React.ReactNode
        page: React.ReactNode
    }[]
}

export type MenuLayout = TMenuItem[]
