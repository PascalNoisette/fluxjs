import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Feed } from '../model/Feed';
import { apiCall, createFeedIcon } from './util';

export default function useFeed(setError:Dispatch<SetStateAction<string>>):[Feed[], Dispatch<SetStateAction<Feed[]>>] {
    const [feeds, setFeeds] = useState<Feed[]>([]);
	
    useEffect(() => {
		const fetchFeeds = async () => {
			const cache = JSON.parse(localStorage.getItem('favicons')||'{}');
			const f = await apiCall('feeds', setError)
			let categories:Feed[] = []
			f.forEach((x:Feed) => {
				if (x.category && !categories.find((c) => x.category && c.id === x.category.id)) {
					categories.push(x.category)
				}
			})

			const feedTree:Feed[] = [
				{ id: -1, title: 'All', fetch_url: 'entries', unreads: 0, children:[] },
				{
					id: -2,
					title: 'Starred',
					fetch_url: 'entries?starred=true',
					unreads: 0,
					children:[]
				},
			]

			categories
				.filter((f) => f)
				.sort((a:Feed, b:Feed) => a.title.localeCompare(b.title))
				.forEach((c) => {
					feedTree.push(c)
					feedTree.push(
						...f
							.filter((f:Feed) => f.category && f.category.id === c.id)
							.sort((a:Feed, b:Feed) => a.title.localeCompare(b.title))
							.map((f:Feed) =>
								Object.assign(f, {
									fetch_url: 'feeds/' + f.id + '/entries',
									is_feed: true,
								})
							)
					)
				})

			

			feedTree.forEach(async (f:Feed) => {
				f.icon_data = createFeedIcon(f.title)
				if (f.icon && f.id in cache) {
					f.icon_data = cache[f.id]
				} else if (f.icon) {
					try {
						const icon = await apiCall(
							'feeds/' + f.id + '/icon',
							setError
						)
						f.icon_data = 'data:' + icon.data
					} catch {}

					localStorage.setItem(
						'favicons',
						JSON.stringify({
							...JSON.parse(localStorage.getItem('favicons')||"{}"),
							[f.id]: f.icon_data,
						})
					)
				}
			});
            const fetchUnreadForFeed = async (f:Feed) => {
				if (!f.fetch_url) {
					return 0
				}
				const unread = await apiCall(
					f.fetch_url +
						(f.fetch_url.includes('?') ? '&' : '?') +
						'status=unread&limit=1',
					setError
				)
				f['unreads'] = unread.total
				return unread.total
			}
			const { unreads } = await apiCall('feeds/counters', () => {}).catch(
				async () => {
					// catch for version of miniflux older than PR https://github.com/miniflux/miniflux/pull/1431
					const tasks = feedTree.slice()
					while (tasks.length) {
						await Promise.all(
							tasks.splice(-10).map(fetchUnreadForFeed)
						)
					}
					return {
						unreads: feedTree.reduce<any>((result, f:Feed) => {
							result[f.id] = f.unreads;
							return result
						}, {}),
					}
				}
			)

			unreads[-1] =
				unreads[-1] ??
				Object.values(unreads).reduce<number>((total, i:any) => total + i, 0)
			const star = feedTree.find((x) => x.id === -2);
			if (star) {
			unreads[-2] = unreads[-2] ?? (await fetchUnreadForFeed(star))
			}
			feedTree
				.map((f:any) => {
					if (parseInt(f)) {
						f = feedTree.find((x:Feed) => x.id === f && x.fetch_url)
					}
					return f
				})
				.filter((f) => f.fetch_url)
				.map((f) => (f['unreads'] = unreads[f.id] || 0))

				categories
				.forEach((c) => {
					if (c.id>1) {
						c.children = feedTree.filter((f) => f.fetch_url && f.category && f.category.id === c.id);
						c.unreads = feedTree.filter((f) => f.fetch_url && f.category && f.category.id === c.id).reduce((res, f)=> res+f.unreads, 0);
					}
				})

                
			setFeeds(feedTree)
		}
		(async () => {
			await fetchFeeds();
		})();
	}, [])
    return [feeds, setFeeds];
}