import { LocalAtmRounded } from '@mui/icons-material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InventoryIcon from '@mui/icons-material/Inventory';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Clientes from '../components/pages/Clientes';
import Home from '../components/pages/Home';
import Nfe from '../components/pages/nfe';
import Produtos from '../components/pages/Produtos';
import Proposta from '../components/pages/Proposal/Index';
import { MenuLayout } from '../types/TMenu.type';
import Pessoas from '../components/pages/Pessoas';
import GroupIcon from '@mui/icons-material/Group';
import Usuario from '../components/pages/Usuarios';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { Empresas } from '../components/pages/Empresas';

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
        permission: 'PRODUTOS',
    },
    {
        name: "Notas Fiscais",
        route: "/notas-fiscais",
        page: <Nfe />,
        icon: <LocalAtmRounded />,
        permission: 'NOTAS_FISCAIS',
    },
    {
        name: "Pessoas",
        route: "/pessoas",
        page: <Pessoas />,
        icon: <GroupIcon />,
        permission: 'PESSOAS'
    },
    {
        name: "Usuários",
        route: "/usuarios",
        page: <Usuario />,
        icon: <PersonIcon />,
        permission: undefined // adicionar a chave USUARIOS no enum de permissões 
    },
    {
        name: "Empresas",
        route: "/empresas",
        page: <Empresas />,
        icon: <BusinessIcon />,
        permission: undefined
    }
]