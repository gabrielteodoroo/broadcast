import { useState, type FormEvent } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from './auth-context';
import { signIn } from './auth-service';
import { AuthBrand } from '../../components/AuthBrand';

export const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/', { replace: true });
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <AuthBrand />
        <Card>
        <CardContent className="!p-6">
          <Typography variant="h6" className="!mb-1">
            Acesso ao sistema
          </Typography>
          <Typography variant="body2" color="text.secondary" className="!mb-4">
            Digite suas credenciais para acessar.
          </Typography>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              fullWidth
            >
              Entrar
            </Button>
          </form>

          <Typography variant="body2" className="!mt-4">
            Não tem conta?{' '}
            <Link component={RouterLink} to="/register">
              Cadastre-se
            </Link>
          </Typography>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};
