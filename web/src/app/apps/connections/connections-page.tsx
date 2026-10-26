import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ConfirmDialog } from 'app/components/confirm-dialog';
import { LoadError } from 'app/components/load-error';
import { ConnectionFormDialog } from 'app/apps/connections/connection-form-dialog';
import { useConnectionsPage } from 'app/apps/connections/connections.facade';

export function ConnectionsPage() {
	const {
		connections,
		isLoading,
		loadError,
		formOpen,
		editing,
		removing,
		removeError,
		openCreate,
		openEdit,
		closeForm,
		submit,
		askRemove,
		cancelRemove,
		confirmRemove,
		openDetail,
	} = useConnectionsPage();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<Typography variant="h5">Conexões</Typography>
				<Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
					Nova conexão
				</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center p-8">
					<CircularProgress />
				</div>
			) : loadError ? (
				<LoadError
					error={loadError}
					message="Não foi possível carregar as conexões. Atualize a página para tentar novamente."
				/>
			) : connections.length === 0 ? (
				<Typography color="text.secondary">Nenhuma conexão ainda. Crie a primeira.</Typography>
			) : (
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
					{connections.map(connection => (
						<Card key={connection.id} className="relative">
							<CardActionArea onClick={() => openDetail(connection)}>
								<CardContent>
									<Typography variant="h6" className="pr-16">
										{connection.name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Abrir contatos e mensagens
									</Typography>
								</CardContent>
							</CardActionArea>
							<div className="absolute right-2 top-2 flex">
								<IconButton size="small" onClick={() => openEdit(connection)} aria-label="Editar">
									<EditIcon fontSize="small" />
								</IconButton>
								<IconButton size="small" onClick={() => askRemove(connection)} aria-label="Excluir">
									<DeleteIcon fontSize="small" />
								</IconButton>
							</div>
						</Card>
					))}
				</div>
			)}

			<ConnectionFormDialog open={formOpen} connection={editing} onSubmit={submit} onClose={closeForm} />

			<ConfirmDialog
				open={Boolean(removing)}
				title="Excluir conexão"
				description={`Tem certeza que deseja excluir "${removing?.name}"? Esta ação não pode ser desfeita.`}
				error={removeError}
				onConfirm={confirmRemove}
				onCancel={cancelRemove}
			/>
		</div>
	);
}
