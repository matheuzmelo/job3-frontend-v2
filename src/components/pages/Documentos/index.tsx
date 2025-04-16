// pages/documentos/index.tsx
import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { DocumentoProvider } from "../../../contexts/documentos.context";
import { Form } from "./Form";
import { List } from "./List";

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: ITabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const DocumentosIndex = () => {


  const [abaAtual, setAbaAtual] = useState(0);

  const handleChange = (_, newValue: number) => {
    setAbaAtual(newValue);
  };

  const ContentTabs = [
    { id: 0, label: "Novo Documento" },
    { id: 1, label: "Listar Documentos" },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "center" }}>
        <Tabs value={abaAtual} onChange={handleChange} aria-label="tabs">
          {ContentTabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} />
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
    <DocumentoProvider>
      <DocumentosIndex />
    </DocumentoProvider>
  );
};