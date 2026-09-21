import { Box, Typography } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';

export const AuthBrand = () => (
  <Box className="mb-6 flex flex-col items-center gap-2">
    <Box
      className="flex h-12 w-12 items-center justify-center rounded-xl"
      sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
    >
      <CampaignIcon />
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      Broadcast
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Disparo de mensagens
    </Typography>
  </Box>
);
