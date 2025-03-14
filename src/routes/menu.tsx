import { LocalAtmRounded } from '@mui/icons-material';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import { Empresas } from '../components/pages/Empresas';
import Home from '../components/pages/Home';
import Pessoas from '../components/pages/Pessoas';
import Produtos from '../components/pages/Produtos';
import Usuario from '../components/pages/Usuarios';
import { MenuLayout } from '../types/TMenu.type';
import { NotasFiscais } from '../components/pages/nfe';

export const menuLayout: MenuLayout = [
    {
        name: "Home",
        route: "/",
        page: <Home />,
        icon: <HomeRoundedIcon />,
        permission: undefined,
    },
    // {
    //     name: "Proposta",
    //     route: "/proposta",
    //     page: <Proposta />,
    //     icon: <NoteAltRoundedIcon />,
    //     permission: 'PROPOSTAS',
    // },
    // {
    //     name: "Clientes",
    //     route: "/clientes",
    //     page: <Clientes />,
    //     icon: <GroupRoundedIcon />,
    //     permission: 'CLIENTES',
    // },
    {
        name: "Produtos",
        route: "/produtos",
        page: <Produtos />,
        icon: <InventoryIcon />,
        permission: undefined,
    },
    {
        name: "Notas Fiscais",
        route: "/notas-fiscais",
        page: <NotasFiscais />,
        icon: <LocalAtmRounded />,
        permission: undefined,
    },
    {
        name: "Pessoas",
        route: "/pessoas",
        page: <Pessoas />,
        icon: <GroupIcon />,
        permission: undefined
    },
    {
        name: "Usuários",
        route: "/usuarios",
        page: <Usuario />,
        icon: <PersonIcon />,
        permission: undefined
    },
    {
        name: "Empresas",
        route: "/empresas",
        page: <Empresas />,
        icon: <BusinessIcon />,
        permission: undefined
    }
]
