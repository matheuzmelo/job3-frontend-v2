import { LocalAtmRounded, Note } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import GroupIcon from "@mui/icons-material/Group";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Documentos } from "../components/pages/Documentos";
import { Empresas } from "../components/pages/Empresas";
import Home from "../components/pages/Home";
import { NotasFiscais } from "../components/pages/nfe";
import Pessoas from "../components/pages/Pessoas";
import Produtos from "../components/pages/Produtos";
import Proposta from "../components/pages/Proposal/Index";
import CfopCrud from "../components/pages/Tabelas/cfop";
import { Classes } from "../components/pages/Tabelas/classes";
import Usuario from "../components/pages/Usuarios";
import { MenuLayout } from "../types/TMenu.type";

export const menuLayout: MenuLayout = [
  {
    name: "Home",
    route: "/",
    page: <Home />,
    icon: <HomeRoundedIcon />,
    permission: undefined,
  },
  {
    name: "Documentos",
    route: "/documentos",
    page: <Documentos />,
    icon: <ConfirmationNumberIcon />,
    permission: undefined,
    subMenu: [
      {
        name: "Proposta",
        route: "/proposta",
        page: <Proposta />,
        icon: <Note />,
      },
      {
        name: "Notas Fiscais",
        route: "/notas-fiscais",
        page: <NotasFiscais />,
        icon: <LocalAtmRounded />,
      },
    ],
  },
  {
    name: "Tabelas",
    permission: undefined,
    route: "/tabelas/classes",
    page:<Classes />,
    icon: <TableChartIcon />,
    subMenu: [
      {
        name: "Classes",
        route: "/tabelas/classes",
        page: <Classes />,
        icon: <HistoryEduIcon />
      },
      {
        name: "CFOP",
        route: "/tabelas/cfop",
        page: <CfopCrud />,
        icon: <ReceiptLongIcon />
      },
    ]
  },
  {
    name: "Produtos",
    route: "/produtos",
    page: <Produtos />,
    icon: <InventoryIcon />,
    permission: undefined,
  },

  {
    name: "Pessoas",
    route: "/pessoas",
    page: <Pessoas />,
    icon: <GroupIcon />,
    permission: undefined,
  },
  {
    name: "Usuários",
    route: "/usuarios",
    page: <Usuario />,
    icon: <PersonIcon />,
    permission: undefined,
  },
  {
    name: "Empresas",
    route: "/empresas",
    page: <Empresas />,
    icon: <BusinessIcon />,
    permission: undefined,
  },
];
