import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import * as React from 'react';
import { Feed as FeedModel } from '../../model/Feed';
import Feed from './LeftMenu/Feed';

export default function LeftMenu({
    setCurrentFeed,
    feeds,
    leftMenuShrinked
}: {
    setCurrentFeed: (f: FeedModel | undefined) => void;
    feeds: FeedModel[];
    leftMenuShrinked: boolean;
}) {
    const router = useRouter();
    const renderTree = (node: FeedModel) => (
        <TreeItem
            key={`${node.id}`}
            nodeId={`${node.id}`}
            ContentComponent={Feed}
            ContentProps={
                {
                    onPick: (nodeId: number) => {
                        setCurrentFeed(
                            feeds
                                .filter((f) => f.id == nodeId)
                                .slice(-1)
                                .pop()
                        );
                        router.push(`#feed/${nodeId}`);
                    },
                    node: node,
                    leftMenuShrinked: leftMenuShrinked
                    // eslint-disable-next-line
                } as any
            }
        >
            {Array.isArray(node.children) ? node.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );
    return (
        <>
            {feeds.length ? (
                <TreeView
                    aria-label="gmail"
                    defaultExpanded={['3']}
                    defaultCollapseIcon={<ArrowDropDownIcon />}
                    defaultExpandIcon={<ArrowRightIcon />}
                    defaultEndIcon={<div style={{ width: 24 }} />}
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                >
                    {feeds.filter((f) => f.children).map((f) => renderTree(f))}
                </TreeView>
            ) : (
                <CircularProgress sx={{ margin: 'auto' }} />
            )}
        </>
    );
}
