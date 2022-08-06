import Circle from '@mui/icons-material/Circle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PanoramaFishEye from '@mui/icons-material/PanoramaFishEye';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useInView } from 'react-intersection-observer';
import { Entry } from '../../../model/Entry';
import ViewMoreContent from './FeedItem/ViewMoreContent';

function usePrevious(value: boolean): boolean {
    const ref = React.useRef<boolean>(false);
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default function FeedItem({
    item,
    updateMenu,
    scrollDirection
}: {
    item: Entry;
    updateMenu: (i: Entry) => void;
    scrollDirection: string;
}) {
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState(false);

    const markReadAndUpdateMenu = () => {
        item.status ??= 'unread';
        item.status = item.status === 'unread' ? 'read' : 'unread';
        setStatus(item.status !== 'unread');
        updateMenu(item);
    };
    const { ref, inView } = useInView();
    const wasInView = usePrevious(inView);

    React.useEffect(() => {
        if (!inView && wasInView && item.status === 'unread' && scrollDirection == 'down') {
            markReadAndUpdateMenu();
        }
        // eslint-disable-next-line
    }, [inView]);

    return (
        <React.Fragment>
            <TableRow sx={{ borderBottom: 'none' }}>
                <TableCell sx={{ padding: 0, borderBottom: 'none' }}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ padding: 0, borderBottom: 'none' }}>
                    <IconButton onClick={markReadAndUpdateMenu}>
                        {status ? <PanoramaFishEye /> : <Circle />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{ padding: 0, borderBottom: 'none' }}>
                    <h2 style={{ marginBlockStart: '0.5rem', marginBlockEnd: 0 }} ref={ref}>
                        <a target="_blank" href={item.url} rel="noreferrer">
                            {item.title}
                        </a>
                    </h2>
                </TableCell>
            </TableRow>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell colSpan={3}>
                    <ViewMoreContent
                        open={open}
                        setOpen={setOpen}
                        inView={inView}
                        wasInView={wasInView}
                        item={item}
                    />
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
