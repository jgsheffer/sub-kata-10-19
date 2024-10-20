import { styled } from '@mui/material/styles';
import { Paper, Card } from '@mui/material';

export const VisualizationContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: 'calc(100vh - 250px)',
  maxHeight: '600px',
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
}));

export const ControlCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

export const CommandList = styled('ul')(({ theme }) => ({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  maxHeight: '200px',
  overflowY: 'auto',
  '& li': {
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
}));

export const ControlButton = styled('button')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    cursor: 'not-allowed',
  },
}));

export const PositionDisplay = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(2),
}));

export const CommandInput = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& > *:not(:last-child)': {
    marginRight: theme.spacing(1),
  },
}));

export const VisualizationTitle = styled('h2')(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));
