import { type NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { useMemo } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { LikeableContainer, CustomText, Counter, DetailSections, Line } from '../../components';
import { ImageHandler, findClosestNeighbours } from '../../helpers';
import { type StoreParamList } from '../../navigation/types/store.types';
import { TEXT, BUSINESS, COLORS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import styles from './detail.styles';
import { addItemCart, updateCounterCart } from '../../store/actions';
import type { ReduxStoreState } from '../../store';
import { useCounter } from '../../hooks';
import { type DtItem } from '../../interfaces';

const {
	CURRENCY_SYMBOL,
	ALREADY_ADDED_BUTTON_MESSAGE,
	ADD_TO_CART_BUTTON_MESSAGE,
	RECOMMENDED_TITLE,
	CATEGORIES_TITLE,
} = TEXT;
const { MIN_ITEMS_IN_CART, MAX_ITEMS_IN_CART } = BUSINESS;

type DetailScreenNavigationProp = NativeStackScreenProps<StoreParamList, 'Detail'>;

const DetailScreen: React.FC<DetailScreenNavigationProp> = ({ route, navigation }) => {
	const dispatch = useDispatch();
	const { item } = route.params;
	const storeItems = useSelector((state: ReduxStoreState) => state.store.items);
	const cartItem = useSelector((state: ReduxStoreState) =>
		state.cart.items.find((cartItem) => cartItem.id === item.id),
	);
	const userId = useSelector((state: ReduxStoreState) => state.auth.userId);
	const itemInCart = cartItem !== undefined;
	const { count, resetCounter } = useCounter(
		MIN_ITEMS_IN_CART,
		cartItem?.amount,
		MAX_ITEMS_IN_CART,
	);
	const closestNeigbours = useMemo(
		() =>
			findClosestNeighbours(
				item,
				storeItems.filter((it) => it.id !== item.id),
				4,
			),
		[item, storeItems],
	);

	const handleUpdateCount = (count: number): void => {
		resetCounter(count);
		if (!itemInCart) return;
		count =
			count < MIN_ITEMS_IN_CART
				? MIN_ITEMS_IN_CART
				: count > MAX_ITEMS_IN_CART
				? MAX_ITEMS_IN_CART
				: count;
		dispatch(updateCounterCart(userId, item.id, count) as any);
	};

	const handleAddCount = (): void => {
		handleUpdateCount(cartItem?.amount !== undefined ? cartItem.amount + 1 : count + 1);
	};

	const handleDecCount = (): void => {
		handleUpdateCount(cartItem?.amount !== undefined ? cartItem.amount - 1 : count - 1);
	};

	const handleAddItem = (): void => {
		if (itemInCart) return;
		dispatch(addItemCart(userId, { ...item, amount: count }) as any);
	};

	const handleOnPressItem = (item: DtItem): void => {
		navigation.navigate('Detail', { name: item.title, item });
	};

	const { getItemImage } = ImageHandler;
	const image = getItemImage(item.pictureUrl);
	const { NEUTRAL_COLOR } = COLORS;

	return (
		<>
			<ScrollView style={styles.itemDetailScroll}>
				<View style={styles.itemDetail}>
					<LikeableContainer item={item} width={50}>
						<Image source={image} style={styles.itemImage} />
					</LikeableContainer>
					<View style={styles.itemInfo}>
						<View style={styles.topInfoContainer}>
							<View style={styles.topInfo}>
								<CustomText textType="bold" size="medium" style={styles.category}>
									{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
								</CustomText>
								<CustomText textType="bold" size="big">
									{item.title}
								</CustomText>
								<CustomText size="medium" style={styles.description}>
									{item.description}
								</CustomText>
							</View>
							<View style={styles.countContainer}>
								<Counter
									addCharacter={'+'}
									decCharacter={'-'}
									addToCounter={handleAddCount}
									count={cartItem?.amount ?? count}
									decToCounter={handleDecCount}
								/>
							</View>
						</View>
						<View style={styles.line}>
							<Line color={NEUTRAL_COLOR} />
						</View>
						<View style={styles.sections}>
							<DetailSections
								categoryTitle={CATEGORIES_TITLE}
								recommendedTitle={RECOMMENDED_TITLE}
								categories={item.categories}
								similarItems={closestNeigbours}
								handleOnPressItem={handleOnPressItem}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
			<View style={styles.bottomInfo}>
				<View style={styles.priceContainer}>
					<CustomText size="big" textType="bold" style={styles.price}>
						{item.price * (cartItem?.amount ?? count)}
						{CURRENCY_SYMBOL}
					</CustomText>
				</View>
				<TouchableOpacity
					style={[styles.addButton, itemInCart ? styles.disabledButton : null]}
					onPress={handleAddItem}
					disabled={itemInCart}
				>
					<CustomText size="small" textType="bold" style={styles.addButtonText}>
						{itemInCart ? ALREADY_ADDED_BUTTON_MESSAGE : ADD_TO_CART_BUTTON_MESSAGE}
					</CustomText>
				</TouchableOpacity>
			</View>
		</>
	);
};

export default DetailScreen;
