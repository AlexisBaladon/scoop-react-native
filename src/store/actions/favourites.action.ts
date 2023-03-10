import { type DtItem } from '../../interfaces';
import { type FavouritesActions } from '../types/favourites.types';
import {
	addItemFavourites as _addItemFavourites,
	removeItemFavourites as _removeItemFavourites,
	removeAllItemsFavourites as _removeAllItemsFavourites,
	getAllItemsFavourites,
} from '../../firebase/services/favourites.services';
import type { User } from '../../firebase/models/user';
import {
	deleteAllFavourites,
	deleteFavourite,
	fetchFavourites,
	persistFavourites,
} from '../../db/favourites';
import { hasConnection } from '../../helpers';

export const addItemFavourites = (userId: User['userId'] | null, item: DtItem) => {
	return async (dispatch: (action: FavouritesActions) => void) => {
		dispatch({ type: 'ADD_ITEM_FAVOURITES', item });
		try {
			await persistFavourites([item]);
			if (userId === null) return;
			const data = await _addItemFavourites(userId, item);
			if (data === undefined) {
				dispatch({ type: 'ADD_ITEM_FAVOURITES', error: new Error('Something went wrong') });
				return;
			}
			if (data instanceof Error) {
				dispatch({ type: 'ERROR_FAVOURITES', error: data });
				return;
			}
		} catch (error) {
			dispatch({ type: 'ERROR_FAVOURITES', error: error as Error });
		}
	};
};

export const removeItemFavourites = (userId: User['userId'] | null, itemId: DtItem['id']) => {
	return async (dispatch: (action: FavouritesActions) => void) => {
		dispatch({ type: 'REMOVE_ITEM_FAVOURITES', itemId });
		try {
			await deleteFavourite(itemId);
			if (userId === null) return;
			const data = await _removeItemFavourites(userId, itemId);
			if (data === undefined) {
				dispatch({
					type: 'ERROR_FAVOURITES',
					error: new Error('Something went wrong'),
				});
				return;
			}
			if (data instanceof Error) {
				dispatch({ type: 'ERROR_FAVOURITES', error: data });
				return;
			}
		} catch (error) {
			dispatch({ type: 'ERROR_FAVOURITES', error: error as Error });
		}
	};
};

export const removeAllItemsFavourites = (userId: User['userId'] | null) => {
	return async (dispatch: (action: FavouritesActions) => void) => {
		dispatch({ type: 'LOADING_FAVOURITES' });
		dispatch({ type: 'REMOVE_ALL_ITEMS_FAVOURITES' });
		try {
			await deleteAllFavourites();
			if (userId === null) return;
			const data = await _removeAllItemsFavourites(userId);
			if (data === undefined) {
				dispatch({
					type: 'ERROR_FAVOURITES',
					error: new Error('Something went wrong'),
				});
				return;
			}
			if (data instanceof Error) {
				dispatch({ type: 'ERROR_FAVOURITES', error: data });
				return;
			}
		} catch (error) {
			dispatch({ type: 'ERROR_FAVOURITES', error: error as Error });
		}
	};
};

export const fetchFavouriteItems = (userId: User['userId'] | null) => {
	return async (dispatch: (action: FavouritesActions) => void) => {
		dispatch({ type: 'LOADING_FAVOURITES' });
		try {
			const hasInternet = await hasConnection();
			const data =
				hasInternet && userId !== null
					? await getAllItemsFavourites(userId)
					: await fetchFavourites();
			if (data === undefined) {
				dispatch({
					type: 'ERROR_FAVOURITES',
					error: new Error('Something went wrong'),
				});
				return;
			}
			if (data instanceof Error) {
				dispatch({ type: 'ERROR_FAVOURITES', error: data });
				return;
			}
			dispatch({ type: 'FETCH_ITEMS_FAVOURITES', items: data });
		} catch (error) {
			dispatch({ type: 'ERROR_FAVOURITES', error: error as Error });
		}
	};
};
