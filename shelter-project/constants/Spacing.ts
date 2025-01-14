import { color } from "react-native-elements/dist/helpers";

export const Spacing = {
    mainContainer: {
        margin: 20
    },
    widgetContainerText: {
        padding: 15,
        color: 'white' as color
    },
    elementBorder: {
        borderRadius: 10,
    },
    roundedContainer: {
        height: '100%',
        padding: 20,
        gap: 15,
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
    },
    searchBarContainer: {
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    searchBarInputContainer: {
        height: '100%' as any,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 0,
    },
}