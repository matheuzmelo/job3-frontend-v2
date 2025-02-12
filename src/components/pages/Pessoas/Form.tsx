import { ClearRounded, SaveAltRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { usePessoaContext } from '../../../context/pessoas.context';
import { PessoasService } from '../../../services/api/Pessoas/pessoas.service';
import ToastMessage from '../../organisms/ToastMessage';

export const Form = () => {
  const { pessoaAtual }: any = usePessoaContext();
  const [openToast, setOpenToast] = useState(false);
  const [toastStatus, setToastStatus] = useState<"success" | "alert" | "warn">(
    "success"
  );
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cpfCnpj: '',
    rgInscricao: '',
    email: '',
    phone: '',
    zip: '',
    address: '',
    neighborhood: '',
    city: '',
    uf: '',
  });

  const [cpfCnpjMask, setCpfCnpjMask] = useState('999.999.999-99');
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading

  useEffect(() => {
    if (pessoaAtual) {
      setFormData(pessoaAtual);
      const onlyNumbers = pessoaAtual.cpfCnpj.replace(/\D/g, '');
      setCpfCnpjMask(onlyNumbers.length > 11 ? '99.999.999/9999-99' : '999.999.999-99');
    }
  }, [pessoaAtual]);

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

  const handleOpenToast = (
    status: "success" | "alert" | "warn",
    msg: string
  ) => {
    setToastStatus(status);
    setMessage(msg);
    setOpenToast(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!formData.address ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.cpfCnpj ||
      !formData.zip ||
      !formData.neighborhood ||
      !formData.city ||
      !formData.uf) {
      handleOpenToast("alert", "Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      const data = {
        primeiro_nome: formData.firstName,
        segundo_nome: formData.lastName,
        cpf_cnpj: formData.cpfCnpj.replace(/\D/g, ''),
        rg_inscricao: formData.rgInscricao,
        email: formData.email,
        telefone: formData.phone.replace(/\D/g, ''),
        cep: formData.zip.replace(/\D/g, ''),
        endereco: formData.address,
        bairro: formData.neighborhood,
        cidade: formData.city,
        uf: formData.uf,
      };
      const criaPessoa = await PessoasService.create(data)
      if (criaPessoa) {
        handleOpenToast("success", "Pessoa salva com sucesso!");
        handleClear();
      } else {
        handleOpenToast("warn", "Erro ao salvar pessoa!");
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      alert('Erro ao salvar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      firstName: '',
      lastName: '',
      cpfCnpj: '',
      rgInscricao: '',
      email: '',
      phone: '',
      zip: '',
      address: '',
      neighborhood: '',
      city: '',
      uf: '',
    });
    setCpfCnpjMask('999.999.999-99');
  };

  return (
    <Container maxWidth="xl">
      <Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Cadastro de Pessoa
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
              label="Primeiro Nome *"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="Segundo Nome *"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <InputMask
              mask={cpfCnpjMask}
              value={formData.cpfCnpj}
              onChange={handleChange}
              maskChar=""
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label="CPF/CNPJ *"
                  name="cpfCnpj"
                  fullWidth
                />
              )}
            </InputMask>
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <TextField
              label="RG/Inscrição"
              name="rgInscricao"
              value={formData.rgInscricao}
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
            <InputMask
              mask="(99) 99999-9999"
              value={formData.phone}
              onChange={handleChange}
              maskChar=""
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label="Telefone"
                  name="phone"
                  fullWidth
                />
              )}
            </InputMask>
          </Box>
          <Box sx={{ flex: '1 1 calc(33.33% - 1rem)', minWidth: '300px' }}>
            <InputMask
              mask="99999-999"
              value={formData.zip}
              onChange={handleChange}
              maskChar=""
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label="CEP *"
                  name="zip"
                  fullWidth
                />
              )}
            </InputMask>
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
              name="uf"
              value={formData.uf}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </Box>

        <Box mt={4} display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveAltRounded />
              )
            }
            onClick={handleSubmit}
            disabled={isLoading ||
              !formData.address ||
              !formData.firstName ||
              !formData.lastName ||
              !formData.cpfCnpj ||
              !formData.zip ||
              !formData.neighborhood ||
              !formData.city ||
              !formData.uf
            } // Desabilita o botão durante o loading
            sx={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "progress" : "pointer",
            }}
          >
            {isLoading ? "Salvando..." : "Salvar Pessoa"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearRounded />}
            onClick={handleClear}
            disabled={isLoading} // Desabilita o botão durante o loading
          >
            Limpar Tudo
          </Button>
        </Box>
      </Box>
      <ToastMessage
        status={toastStatus}
        message={message}
        open={openToast}
        onClose={() => setOpenToast(false)}
      />
    </Container>
  );
};