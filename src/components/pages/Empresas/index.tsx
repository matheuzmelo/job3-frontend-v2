import { Box, Container, Tab, Tabs } from "@mui/material";
import { EmpresaProvider } from "../../../context/empresas.context";
import { Form } from "./Form";
import { List } from "./List";
import { useState } from "react";

interface TabPanelProps {
    children: React.ReactNode;
    value: number;
    index: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
    const { children, value, index } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export const EmpresasIndex = () => {
  const [abaAtual, setAbaAtual] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setAbaAtual(newValue);
  };

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
                label={tab.label}
                id={`tab-${tab.id}`}
                aria-controls={`tabpanel-${tab.id}`}
              />
            ))}
          </Tabs>
        </Box>

        <CustomTabPanel value={abaAtual} index={0}>
          <Form />
        </CustomTabPanel>
        <CustomTabPanel value={abaAtual} index={1}>
          <List setAbaAtual={setAbaAtual} />
          {/* <List /> */}
        </CustomTabPanel>
      </Box>
  );
};

export const Empresas = () => {
  return (
    <EmpresaProvider>
      <EmpresasIndex />
    </EmpresaProvider>
  );
};
