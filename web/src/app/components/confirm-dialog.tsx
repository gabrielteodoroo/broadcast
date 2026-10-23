import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface ConfirmDialogProps {
	open: boolean;
	title: string;
	description: string;
	confirmLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
	const { open, title, description, confirmLabel = 'Excluir', onConfirm, onCancel } = props;

	return (
		<Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
			<DialogContent sx={{ textAlign: 'center', pt: 4, px: 3 }}>
				<Box
					sx={{
						mx: 'auto',
						mb: 2,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 56,
						height: 56,
						borderRadius: '50%',
						bgcolor: t => alpha(t.palette.error.main, 0.12),
						color: 'error.main',
					}}
				>
					<WarningAmberRoundedIcon />
				</Box>
				<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
					{title}
				</Typography>
				<DialogContentText>{description}</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
				<Button onClick={onCancel} fullWidth variant="outlined">
					Cancelar
				</Button>
				<Button onClick={onConfirm} fullWidth color="error" variant="contained">
					{confirmLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
