import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Form } from './Form';
import { PessoaProvider, usePessoaContext } from '../../../context/pessoas.context';
import { List } from './List';

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

function handleNavigateProposal(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function PessoasTabs() {
  const { abaAtual, setAbaAtual } = usePessoaContext();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setAbaAtual(newValue);
  };

  const ContentTabs = [
    {
      id: 0,
      label: 'Cadastro'
    },
    {
      id: 1,
      label: 'Pessoas'
    }
  ];

  return (
    <>
      <Box sx={{ width: '100%', minHeight: '100dvh' }}>
        <Box sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Tabs value={abaAtual} onChange={handleChange}>
            {ContentTabs.map(tab => (
              <Tab
                sx={{
                  mr: 1,
                  minWidth: 150,
                  textTransform: 'capitalize',
                }}
                key={tab.id}
                label={tab.label}
                {...handleNavigateProposal(tab.id)}
              />
            ))}
          </Tabs>
        </Box>
        <CustomTabPanel value={abaAtual} index={0}>
          <Form />
        </CustomTabPanel>
        <CustomTabPanel value={abaAtual} index={1}>
          <List />
        </CustomTabPanel>
      </Box>
    </>
  );
}

export default function Pessoas() {
  return (
    <PessoaProvider>
      <PessoasTabs />
    </PessoaProvider>
  );
}