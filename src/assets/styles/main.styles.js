import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    containerFront: {
        padding: 10
    },
    containerHome: {
        padding: 0
    },
    eConnContainer: {
        flex: 1,
        padding: 10
    },
    eConnSubContainer: {
        backgroundColor: '#ff3333',
        padding: 8,
        borderRadius: 5,
        marginTop: 200
    },
    eConnText: {
        fontWeight: 'bold',
        // fontSize: 20
        alignSelf: 'center',
        color: '#fff'
    },
    eConnSubText: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'justify',
        color: '#fff'
    },
    eConnDialogBtn: {
        flexDirection: 'row',
        marginVertical: 15,
        alignSelf: 'center'
    },
    dialogBtn: {
        flex: 1,
        marginHorizontal: 5
    },
    exitBtn: {

    },
    tryAgainBtn: {
        backgroundColor: '#17751e',
        borderColor: '#17751e'
    },
    frontHeader: {
        backgroundColor: 'rgba(0,0,0,0)',
        marginTop: 70
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
        textAlign: 'center',
        // paddingLeft: 24
    },
    formContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#dfdfdf',
        borderRadius: 4,
        marginTop: 20
    },
    signUp: {
        marginTop: 30
    },
    ydhaaText: {
        textAlign: 'center',
        margin: 5
    },
    searchBar: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        padding: 6
    },
    toastStyle: {
        marginHorizontal: 5, 
        marginBottom: 70, 
        borderRadius: 5
    },
    errorToast: {
        backgroundColor: '#ff3333'
    },
    successToast: {
        backgroundColor: '#2ab325'
    },
    signIntoastError: {
        backgroundColor: '#ff3333', 
        marginHorizontal: 5, 
        marginBottom: 5, 
        borderRadius: 5
    },

    // Checkin
    checkinGrid: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 5,
        width: 100,
        height: 80,
        backgroundColor: '#284de0'
        // paddingVertical: 80 / 3,
        // paddingHorizontal: 40
    },
    gridTextName: {
        backgroundColor: '#15551e',
        // flex: 1,
        width: '80%',
        padding: 2, 
        // height: '100%',
        alignSelf: 'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        textAlign: 'center', 
        textAlignVertical: 'center',
        color: "#fff",
        fontWeight: 'bold'
    },
    gridText: {
        width: '100%',
        height: '100%',
        textAlign: 'center', 
        textAlignVertical: 'center',
        fontSize: 12,
        color: "#fff",
        fontWeight: 'bold'
    },
    gridRoomText: {
        fontSize: 15,
        backgroundColor: '#233da6',
        alignSelf: 'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        padding: 2,
        width: '80%',
        height: '31%'
    },
    gridTextNameIsBookedTrue: {
        backgroundColor: '#444',
    },
    gridTextNameIsBookedFalse: {
        backgroundColor: '#15551e',
    },
    isBookedTrue: {
        backgroundColor: '#656e65',
    },
    isBookedFalse: {
        backgroundColor: '#17751e',
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
        height: 550
    },
    customerListAvatar: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    customerListInfo: {
        marginLeft: 10,
        marginVertical: 10
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
        marginTop: 30,
        marginHorizontal: 7
    },
    editProfile: {
        width: '100%',
        height: 400,
        backgroundColor: '#fff',
        borderRadius: 5
    },
    editProfileExitBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        fontSize: 28,
        margin: 5
    },
    customerEditAvatar: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 10
    },
    editProfileCamera: {
        position: 'absolute',
        top: 87,
        left: width/2 + 10,
        fontSize: 30
    },
    editProfileInput: {
        marginHorizontal: 10
    },
    editSaveBtn: {
        marginTop: 40,
        marginHorizontal: 10
    }
});
