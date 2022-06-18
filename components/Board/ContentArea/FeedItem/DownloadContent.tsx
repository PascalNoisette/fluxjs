import { useEffect, useState } from 'react';
import { Entry } from '../../../../model/Entry';
import { apiCall } from '../../../../services/util';
import LoadingSpinner from './LoadingSpinner';

export default function DownloadContent({
    inView,
    item
}: {
    readableContent: HTMLElement | undefined;
    inView: boolean;
    wasInView: boolean;
    item: Entry;
}) {
    const [content, setContent] = useState(item.content);
    const [downloaded, setDownloaded] = useState(false);
    const [loading, isLoading] = useState(false);

    useEffect(() => {
        if (inView && !downloaded && !loading) {
            isLoading(true);
            (async () => {
                const downloadedContent = await apiCall(`entries/${item.id}/fetch-content`, () => {
                    // do not report error
                });
                if (downloadedContent.content.length > content.length) {
                    setContent(downloadedContent.content);
                }
                setDownloaded(true);
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
        <>
            <div
                id={`itemcontent-${item.id}`}
                dangerouslySetInnerHTML={{ __html: content }}
                className="downloadable"
            />
            {!downloaded && (
                <div>
                    <LoadingSpinner />
                </div>
            )}
        </>
    );
}
