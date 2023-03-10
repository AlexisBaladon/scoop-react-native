import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartScreen, CheckoutScreen } from '../../views';
import { type CartParamList } from '../types/cart.types';

const Stack = createNativeStackNavigator<CartParamList>();

const StoreNavigator: React.FC = () => {
	return (
		<Stack.Navigator
			initialRouteName="Cart"
			screenOptions={{
				headerStyle: { backgroundColor: 'white' },
				headerTitleAlign: 'center',
				headerTitleStyle: { fontWeight: 'bold' },
			}}
		>
			<Stack.Screen
				name="Cart"
				component={CartScreen}
				options={{
					title: 'Carrito',
				}}
			/>
			<Stack.Screen
				name="Checkout"
				component={CheckoutScreen}
				options={{
					title: 'Confirmar compra',
				}}
			/>
		</Stack.Navigator>
	);
};

export default StoreNavigator;
