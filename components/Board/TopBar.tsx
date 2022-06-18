import Logout from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Feed } from '../../model/Feed';
import useAuthentification from '../../services/Authentification';

export default function TopBar({
    currentFeed,
    left
}: {
    currentFeed: Feed | undefined;
    left: number;
}) {
    const user = useAuthentification();
    return (
        <>
            <Box display="flex" flexGrow={1} sx={{ position: 'relative', left: left }}>
                <Typography variant="h6" noWrap component="div">
                    {currentFeed && currentFeed.title}
                </Typography>
            </Box>
            <IconButton
                color="inherit"
                aria-label="Logout"
                edge="start"
                onClick={() => user.logout()}
                sx={{ ml: 2 }}
            >
                <Logout />
            </IconButton>
        </>
    );
}
