import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { EmpresaProvider } from "../../../contexts/empresas.context";
import { UserProvider } from "../../../contexts/usuario.context";
import { isSuperAdmin } from "../../../Utils";
import { Form } from "./Form";
import { List } from "./List";

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const EmpresasIndex = () => {
  const [abaAtual, setAbaAtual] = useState(0);
  const [superAdm, setSuperAdm] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const handleChange = (_, newValue: number) => {
    setAbaAtual(newValue);
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    setSuperAdm(isSuperAdmin(token));
    setLoading(false);
  }, []);

  const ContentTabs = [
    {
      id: 0,
      label: "Cadastrar",
    },
    {
      id: 1,
      label: "Listar Empresas",
    },
  ];

  if (loading) {
    return <Box>Carregando...</Box>; // Ou algum componente de loading
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tabs value={abaAtual} onChange={handleChange} aria-label="tabs">
          {ContentTabs.map((tab) => (
            <Tab
              key={tab.id}
              label={`${tab.label}`}
              sx={{
                display: !superAdm && tab.id == 1 ? "none" : "block",
              }}
            />
          ))}
        </Tabs>
      </Box>

      <CustomTabPanel value={abaAtual} index={0}>
        <Form />
      </CustomTabPanel>
      {superAdm && (
        <CustomTabPanel value={abaAtual} index={1}>
          <List setAbaAtual={setAbaAtual} />
        </CustomTabPanel>
      )}
    </Box>
  );
};

export const Empresas = () => {
  return (
    <EmpresaProvider>
      <UserProvider>
        <EmpresasIndex />
      </UserProvider>
    </EmpresaProvider>
  );
};
