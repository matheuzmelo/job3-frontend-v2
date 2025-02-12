
export type TBotaoGenerico = {
    icon: React.JSX.Element,
    handle?: () => void,
    label?: string,
    variant?: 'black' | 'white',
    size?: 'small' | 'medium' | 'large',
}