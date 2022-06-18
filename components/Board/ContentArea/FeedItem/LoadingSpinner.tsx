import { keyframes } from '@emotion/react';
import Box from '@mui/material/Box';

const SpinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
export default function LoadingSpinner() {
    return (
        <Box
            sx={{
                width: '50px',
                height: '50px',
                border: '10px solid #f3f3f3;',
                borderTop: '10px solid #383636;',
                borderRadius: '50%',
                animation: `${SpinnerAnimation} 1.5s linear infinite;`
            }}
        />
    );
}
