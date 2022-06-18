import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Entry } from '../../../../model/Entry';
import DownloadContent from './DownloadContent';

export default function ViewMoreContent(props: {
    open: boolean;
    setOpen: (o: boolean) => void;
    inView: boolean;
    wasInView: boolean;
    item: Entry;
}) {
    const defaultSize = 180;
    const { inView, open, setOpen } = props;
    const readableContent = useRef<HTMLElement>();
    const [customHeight, setCustomHeight] = useState({});
    const [firstInit, setFirstInit] = useState(true);

    useHotkeys(
        'esc',
        () => {
            if (inView && open && readableContent.current) {
                setOpen(false);
            }
        },
        [inView, open, readableContent]
    );

    useEffect(() => {
        if (open) {
            setCustomHeight({});
        } else if (firstInit) {
            setCustomHeight({ maxHeight: `${defaultSize}px` });
            setFirstInit(false);
        } else if (readableContent.current) {
            let seaLevel =
                global.innerHeight - readableContent.current.getBoundingClientRect().y - 100;
            if (seaLevel < defaultSize) {
                seaLevel = defaultSize;
            } else if (
                seaLevel >
                readableContent.current.getBoundingClientRect().bottom -
                    readableContent.current.getBoundingClientRect().top
            ) {
                return setCustomHeight({});
            }
            setCustomHeight({ height: `${seaLevel}px` });
        } else {
            console.log(readableContent);
        }
        // eslint-disable-next-line
    }, [open, readableContent]);

    return (
        <Box
            onClick={() => {
                !open && setOpen(true);
            }}
            sx={{
                overflow: 'hidden',
                '&:hover': {
                    cursor: `${!open ? 'pointer' : 'inherit'}`
                },
                ...customHeight
            }}
            className="test"
            ref={readableContent}
        >
            <DownloadContent readableContent={readableContent.current} {...props} />
        </Box>
    );
}
