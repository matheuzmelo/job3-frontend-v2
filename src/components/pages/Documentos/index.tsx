import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { DocumentosProvider } from "../../../contexts/documentos.context";
import { PessoaProvider } from "../../../contexts/pessoas.context";
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

export const DocumentosIndex = () => {
  const [abaAtual, setAbaAtual] = useState(0);

  const handleChange = (_, newValue: number) => {
    setAbaAtual(newValue);
  };

  const ContentTabs = [
    {
      id: 0,
      label: "Cadastrar",
    },
    {
      id: 1,
      label: "Listar Documentos",
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
            <Tab key={tab.id} label={`${tab.label}`} />
          ))}
        </Tabs>
      </Box>

      <CustomTabPanel value={abaAtual} index={0}>
        <Form />
      </CustomTabPanel>
      <CustomTabPanel value={abaAtual} index={1}>
        <List setAbaAtual={setAbaAtual} />
      </CustomTabPanel>
    </Box>
  );
};

export const Documentos = () => {
  return (
    <DocumentosProvider>
      <PessoaProvider>
        <DocumentosIndex />
      </PessoaProvider>
    </DocumentosProvider>
  );
};
