import {
  Autocomplete,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { useClienteContext } from '../../../contexts/clientes.context';

export const Form = () => {
  const { clienteAtual }: any = useClienteContext();

  const [formData, setFormData] = useState({
    name: '',
    fantasia: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    ieRg: '',
    cpfCnpj: '',
    phone: '',
    types: [],
  });

  const [cpfCnpjMask, setCpfCnpjMask] = useState('999.999.999-99');

  useEffect(() => {
    if (clienteAtual) {
      setFormData(clienteAtual);
      const onlyNumbers = clienteAtual.cpfCnpj.replace(/\D/g, '');
      setCpfCnpjMask(onlyNumbers.length > 11 ? '99.999.999/9999-99' : '999.999.999-99');
    }
  }, [clienteAtual]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cpfCnpj') {
      const onlyNumbers = value.replace(/\D/g, '');
      setCpfCnpjMask(
        onlyNumbers.length > 11
          ? '99.999.999/9999-99'
          : '999.999.999-99'
      );
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTypesChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      types: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Dados do cliente:', formData);
  };

  const handleClear = () => {
    setFormData({
      name: '',
      fantasia: '',
      address: '',
      neighborhood: '',
      city: '',
      state: '',
      zip: '',
      email: '',
      ieRg: '',
      cpfCnpj: '',
      phone: '',
      types: [],
    });
    setCpfCnpjMask('999.999.999-99'); // Restabelece a máscara inicial de CPF
  };

  return (
    <Container maxWidth="xl">
      <Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Cadastro de Cliente
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="Nome *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="Fantasia"
              name="fantasia"
              value={formData.fantasia}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="Endereço *"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="Bairro *"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="Cidade *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="UF *"
              name="state"
              value={formData.state}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="CEP *"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="E-mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="Inscrição Estadual/RG"
              name="ieRg"
              value={formData.ieRg}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="CPF/CNPJ *"
              name="cpfCnpj"
              fullWidth
              value={formData.cpfCnpj}
              onChange={handleChange}
              InputProps={{
                inputComponent: InputMask as any,
              }}
              inputProps={{
                mask: cpfCnpjMask,
                maskChar: "",
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 100%' }}>
            <Autocomplete
              multiple
              options={['Fornecedor', 'Cliente', 'Parceiro']}
              value={formData.types}
              onChange={handleTypesChange}
              renderInput={(params) => (
                <TextField {...params} label="Tipos" placeholder="Selecione" fullWidth />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: '1rem', mt: 3, justifyContent: 'flex-start' }}>
          <Button variant="contained" color="warning" onClick={handleSubmit}>
            Salvar
          </Button>
          <Button variant="contained" color="error" onClick={handleClear}>
            Limpar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
;