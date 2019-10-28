import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    containerHome: {
        padding: 0
    },
    frontHeader: {
        backgroundColor: 'rgba(0,0,0,0)',
        marginTop: 40
    },
    ssHeader: {
        marginBottom: 12
    },
    absolute: {
        position: 'absolute'
    },
    signInAppTitle: {
        textAlign: 'center'
    },
    signInAppSubtitle: {
        textAlign: 'center'
    },
    formContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#dfdfdf',
        borderRadius: 4,
        marginTop: 50
    },
    signUp: {
        marginTop: 30
    },
    ydhaaText: {
        textAlign: 'center',
        margin: 5
    },

    // Checkin
    checkinGrid: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 3,
        paddingVertical: 80 / 3,
        paddingHorizontal: 40
    },
    isBookedTrue: {
        backgroundColor: 'grey',
        width: 100,
        height: 80
    },
    isBookedFalse: {
        backgroundColor: 'green',
        width: 100,
        height: 80
    },
    modalBox: {
        width: '100%',
        height: '70%',
        backgroundColor: '#fff',
        position: 'absolute',
        top: 0,
        borderRadius: 5
    },
    modalTrashBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderWidth: 0,
        margin: 5,
        zIndex: 99
    },
    modalBoxTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#eee'
    },
    modalLabel: {
        marginHorizontal: 10
    },
    modalInput: {
        marginHorizontal: 10,
        marginVertical: 10
    },
    modalPicker: {
        borderWidth: 1,
        borderColor: '#eee',
        marginHorizontal: 10
    },
    pickerItem: {
        height: 50,
        width: '100%'
    },
    modalBoxBtnContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20
    },
    modalBoxBtn: {
        flex: 1,
        margin: 6
    },

    // Room
    roomModal: {
        height: '40%'
    },

    // Customer
    customerCard: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    customerModal: {
        height: 500
    },

    // Settings
    profileTextContainer: {
        marginVertical: 12,
        marginHorizontal: 10
    },
    profileEmail: {
        fontWeight: 'bold'
    },
    profileItem: {
        marginTop: 15
    }
});
