import InfoIcon from '@mui/icons-material/Info';
import { TreeItemContentProps, useTreeItem } from '@mui/lab/TreeItem';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import * as React from 'react';
import { Feed } from '../../../model/Feed';

declare module '@mui/lab/TreeItem' {
    interface TreeItemContentProps {
        onPick: (nodeId: number) => void;
        node: Feed;
        leftMenuShrinked: boolean;
    }
}

const Feed = React.forwardRef(function CustomContent(props: TreeItemContentProps, ref) {
    const {
        classes,
        nodeId,
        icon: iconProp,
        expansionIcon,
        displayIcon,
        onPick,
        node,
        leftMenuShrinked
    } = props;

    const { disabled, expanded, selected, focused, handleExpansion, preventSelection } =
        useTreeItem(nodeId);

    const icon = iconProp || expansionIcon || displayIcon;
    const handleSelection = () => onPick(+nodeId);

    return (
        <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            title={node.title}
            className={clsx(classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled
            })}
            onMouseDown={preventSelection}
            ref={ref}
        >
            <Box component="span" onClick={handleExpansion} color="inherit" sx={{ mr: 1 }}>
                {icon}
            </Box>
            <Box
                component="span"
                onClick={handleSelection}
                sx={{ fontWeight: 'inherit', flexGrow: 1, display: 'flex', alignItems: 'center' }}
            >
                {node.icon_data ? (
                    <CardMedia
                        sx={{ width: '18px', height: '18px', display: 'inline-block', mr: 1 }}
                        component="img"
                        src={node.icon_data}
                    />
                ) : (
                    <InfoIcon />
                )}
                {!leftMenuShrinked && (
                    <Typography
                        component="span"
                        variant="body2"
                        sx={{ fontWeight: 'inherit', flexGrow: 1 }}
                    >
                        {node.title}
                    </Typography>
                )}
                <Typography variant="caption" color="inherit" sx={{ float: 'right', mr: 1 }}>
                    {node.unreads}
                </Typography>
            </Box>
        </Box>
    );
});

export default Feed;
