export interface Feed {
    id: number;
    unreads:number;
    title:string;
    fetch_url:string;

    icon_data?:string;
    icon?:string;
    children?:Feed[];
    category?:Feed;
}