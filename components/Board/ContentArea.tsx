import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import * as React from 'react';
import { Entry } from '../../model/Entry';
import { Feed } from '../../model/Feed';
import { apiCall } from '../../services/util';
import FeedItem from './ContentArea/FeedItem';

export default function ContentArea({
    currentFeed,
    setErrorMessage,
    updateMenu
}: {
    currentFeed: Feed;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    updateMenu: (i: Entry) => void;
}) {
    const [rows, setRows] = React.useState<Entry[]>([]);
    const sortOldFirst = false;
    const showRead = false;
    const [lastScrollTop, setLastScrollTop] = React.useState(0);
    const [scrollDirection, setScrollDirection] = React.useState('');

    React.useEffect(() => {
        function refreshScrollTop() {
            const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
            if (st > lastScrollTop) {
                // down
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
            setLastScrollTop(st);
        }
        global.addEventListener('scroll', refreshScrollTop);
        return () => {
            global.removeEventListener('scroll', refreshScrollTop);
        };
    }, [lastScrollTop]);

    React.useEffect(() => {
        const limit = parseInt(localStorage.getItem('fetch_limit') || '100');
        const fetchItems = async () => {
            if (currentFeed) {
                setRows(
                    (
                        await apiCall(
                            `${
                                currentFeed.fetch_url +
                                (currentFeed.fetch_url.includes('?') ? '&' : '?')
                            }limit=${limit}&order=published_at&direction=${
                                sortOldFirst ? 'asc' : 'desc'
                            }${showRead ? '' : '&status=unread'}`,
                            setErrorMessage
                        )
                    ).entries
                );
            }
        };
        fetchItems();
        // eslint-disable-next-line
    }, [currentFeed]);
    return (
        <Table>
            <TableBody>
                {rows.map((item) => (
                    <FeedItem
                        key={item.id as React.Key}
                        item={item}
                        updateMenu={updateMenu}
                        scrollDirection={scrollDirection}
                    />
                ))}
            </TableBody>
        </Table>
    );
}
