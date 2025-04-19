import { LocalAtmRounded } from "@mui/icons-material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Documentos } from "../components/pages/Documentos";
import Home from "../components/pages/Home";
import { MenuLayout } from "../types/TMenu.type";

export const menuLayout: MenuLayout = [
  {
    name: "Home",
    route: "/",
    page: <Home />,
    icon: <HomeRoundedIcon />,
    permission: undefined,
  },
  // crate a route to documentos
  {
    name: "Documentos",
    route: "/documentos",
    page: <Documentos />,
    icon: <LocalAtmRounded />,
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
  // {
  //     name: "Produtos",
  //     route: "/produtos",
  //     page: <Produtos />,
  //     icon: <InventoryIcon />,
  //     permission: undefined,
  // },
  // {
  //     name: "Notas Fiscais",
  //     route: "/notas-fiscais",
  //     page: <NotasFiscais />,
  //     icon: <LocalAtmRounded />,
  //     permission: undefined,
  // },
  // {
  //     name: "Pessoas",
  //     route: "/pessoas",
  //     page: <Pessoas />,
  //     icon: <GroupIcon />,
  //     permission: undefined
  // },
  // {
  //     name: "Usuários",
  //     route: "/usuarios",
  //     page: <Usuario />,
  //     icon: <PersonIcon />,
  //     permission: undefined
  // },
  // {
  //     name: "Empresas",
  //     route: "/empresas",
  //     page: <Empresas />,
  //     icon: <BusinessIcon />,
  //     permission: undefined
  // }
];
