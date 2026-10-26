import Alert from '@mui/material/Alert';

interface LoadErrorProps {
	error: Error | null;
	message?: string;
}

const DEFAULT_MESSAGE = 'Não foi possível carregar os dados. Atualize a página para tentar novamente.';

export function LoadError(props: LoadErrorProps) {
	const { error, message = DEFAULT_MESSAGE } = props;

	if (!error) return null;

	return <Alert severity="error">{message}</Alert>;
}
