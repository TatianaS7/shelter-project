import { color } from "react-native-elements/dist/helpers";

export const Spacing = {
    mainContainer: {
        padding: 20
    },
    widgetContainerText: {
        padding: 15,
        color: 'white' as color
    },
    elementBorder: {
        borderRadius: 10,
    },
    roundedContainer: {
        height: '100%' as any,
        padding: 20,
        gap: 15,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
    },
    searchBarContainer: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
    },
    searchBarInputContainer: {
        height: '100%' as any,
        backgroundColor: 'white' as color,
        borderRadius: 10,
        padding: 0,
    }
}