import { COLORS } from '../../../../constants';
import { StyleSheet } from 'react-native';

const { MAIN_COLOR, LIGHT_COLOR } = COLORS;

const getStyles = (height: number, width: number): StyleSheet.NamedStyles<any> =>
	StyleSheet.create({
		button: {
			width,
			height,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: LIGHT_COLOR,
			borderRadius: 10,
		},
		crossImage: {
			width: width / 2,
			height: height / 2,
			tintColor: MAIN_COLOR,
		},
	});

export default getStyles;
