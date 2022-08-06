import MenuIcon from '@mui/icons-material/Menu';
import MuiAlert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Toolbar from '@mui/material/Toolbar';
import { useRouter } from 'next/router';
import * as React from 'react';
import { Entry } from '../model/Entry';
import { Feed } from '../model/Feed';
import useFeed from '../services/Feed';
import { markRead } from '../services/util';
import ContentArea from './Board/ContentArea';
import LeftMenu from './Board/LeftMenu';
import TopBar from './Board/TopBar';
import ScrollToTop from './Board/ScrollToTop';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

export default function Board(props: Props) {
    const drawerWidth = 300;
    const shrinkWidth = 130;

    const { window } = props;
    const [isMobile, setIsMobile] = React.useState(global.innerWidth <= 768);
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [feeds, setFeeds] = useFeed(setErrorMessage);
    const [currentFeed, setCurrentFeed] = React.useState<Feed>();
    const router = useRouter();
    React.useEffect(() => {
        const hash = router.asPath.match(/#feed\/([0-9]+)/);
        if (hash) {
            setCurrentFeed(
                feeds
                    .filter((f: Feed): boolean => f.id == +hash[1])
                    .slice(-1)
                    .pop()
            );
            setDrawerOpen(false);
        }
    }, [feeds, router]);

    function updateMenu(item: Entry) {
        markRead([item], item.status, setErrorMessage);
        const update = item.status === 'unread' || item.status === undefined ? 1 : -1;
        const newFeedList = feeds.map((f: Feed) => {
            if (
                currentFeed &&
                (currentFeed.id == f.id ||
                    (currentFeed.category && currentFeed.category.id == f.id))
            ) {
                f['unreads'] += update;
            }
            return f;
        });
        setFeeds(newFeedList);
    }

    function handleDrawerToggle() {
        setDrawerOpen(!drawerOpen);
    }

    function refreshDrawer() {
        setIsMobile(global.innerWidth <= 768);
    }
    React.useEffect(() => {
        global.addEventListener('resize', refreshDrawer);
        return () => {
            global.removeEventListener('resize', refreshDrawer);
        };
    }, []);

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, left: drawerOpen ? drawerWidth : isMobile ? 0 : shrinkWidth }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <TopBar
                        currentFeed={currentFeed}
                        left={drawerOpen ? drawerWidth : isMobile ? 0 : shrinkWidth}
                    />
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: drawerOpen ? drawerWidth : shrinkWidth, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerOpen ? drawerWidth : shrinkWidth
                        }
                    }}
                >
                    <Toolbar />
                    <Divider />
                    <LeftMenu
                        setCurrentFeed={(f: Feed | undefined) => {
                            setDrawerOpen(false);
                            setCurrentFeed(f);
                        }}
                        leftMenuShrinked={!isMobile && !drawerOpen}
                        feeds={feeds}
                    />
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: drawerOpen ? drawerWidth : isMobile ? 0 : shrinkWidth
                }}
            >
                <Toolbar />
                <ScrollToTop/>
                {currentFeed && (
                    <ContentArea
                        currentFeed={currentFeed}
                        updateMenu={updateMenu}
                        setErrorMessage={setErrorMessage}
                    />
                )}

                {errorMessage && (
                    <Snackbar
                        open={errorMessage != ''}
                        autoHideDuration={4000}
                        onClose={() => setErrorMessage('')}
                    >
                        <MuiAlert severity="error">{errorMessage}</MuiAlert>
                    </Snackbar>
                )}
            </Box>
        </Box>
    );
}
