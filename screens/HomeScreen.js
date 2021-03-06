import React, {useState, useLayoutEffect, useEffect}from "react";
import { Modal, View, Text } from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
import NumericInput from 'react-native-numeric-input'
import { Ionicons } from '@expo/vector-icons';
import DB from '../api/DB_API';
import ModalComponent from "../components/ModalComponent";
import InputTile from "../components/InputTile";
import ListTile from "../components/ListTile";
import Button from '../components/Button';
import DeleteCourseButton from "../components/DeleteCourseButton";
import { styles, buttons, texts, white, lightGrey, darkBlue, iconsizeAdd, lightBlue } from "../Styles"
import DatePicker from "react-native-datepicker";

export default HomeScreen = ({navigation}) => {
    const currentUserId = DB.getCurrentUserId();

    const [currentCourses, setCurrentCourses] = useState([]);
    const [joinedCourses, setJoinedCourses] = useState([]);
    const [swipeListView, setSwipeListView] = useState();

    const [findVisibility, setFindVisibility] = useState(false);
    const [currentFindName, setCurrentFindName] = useState("");
    const [addCourseVisibility, setAddCourseVisibility] = useState(false);
    const [currentCourseName, setCurrentCourseName] = useState("");
    const [currentCourseId, setCurrentCourseId] = useState("");
    const [currentMinMembers, setCurrentMinMembers] = useState();
    const [currentMaxMembers, setCurrentMaxMembers] = useState();
    const [currentDate, setCurrentDate] = useState("");
    // Warnungsfelder
    const [findCourseWarning, setFindCurseWarning] = useState("");
    const [currentWarning, setCurrentWarning] = useState("");
    const [nameError, setNameError] = useState("");
    const [idError, setIdError] = useState("");
    const [minMembersError, setMinMemebersError] = useState("");
    const [maxMembersError, setMaxMembersError] = useState("");
    const [dateError, setDateError] = useState("");
  
    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        console.ignoredYellowBox = ['Setting a timer'];
        const unsubscribe = navigation.addListener('focus', () => {
            DB.getCourseList((courseList) => {
                // console.log(courseList);
                setCurrentCourses(courseList);
                var joined = [];
                for (const course in courseList) {
                    if (courseList[course].members.indexOf(currentUserId) >= 0) {
                        joined.push(courseList[course].id);
                    }
                }
                setJoinedCourses(joined);
            });
        });
        // DB.createTestCourse();
        // DB.fillAttributesList();
        DB.updateAttributesList();
    }, []);

    // Button fürs Hinzufügen neuer Kurse
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight : () => (
                <Button 
                    type ='clear'
                    icon={<Ionicons name='ios-add' size={iconsizeAdd} color={white}/>}
                    onPress={() => {setAddCourseVisibility(true)}}
                />)
        });
    }, [navigation]);
    
    const clickHandler = (id, title) => {
        swipeListView.safeCloseOpenRow();
        const isMember = joinedCourses.indexOf(id) >= 0
        navigation.navigate("Course", {itemId: id, itemTitle: title, isMember: isMember});
    };

    const addCourseHandler = () => {
        if (currentCourseName != "" && currentMaxMembers > 1 && currentCourseId != "") {
            if (currentMinMembers <= currentMaxMembers) {
                // console.log("add");
                DB.addCourse(currentCourseName, currentCourseId, currentDate, currentMinMembers, currentMaxMembers, () => {
                    setAddCourseVisibility(false);
                    setCurrentCourseName("");
                    setCurrentCourseId("");
                    setCurrentMinMembers("");
                    setCurrentMaxMembers("");
                    setCurrentDate("");
                    setNameError("");
                    setIdError("");
                    setMinMemebersError("");
                    setMaxMembersError("");
                    setDateError("");
                    DB.getCourseList((courseList) => {
                        // console.log(courseList);
                        setCurrentCourses(courseList);
                    });
                }, (error) => {setCurrentWarning(error)});
            } else {
                setMaxMembersError("Maximum muss größer sein als das Minimum");
            }
        } else {
            setCurrentWarning("Eingabe nicht vollständig");
        }
    };

    const setCourseNameHandler = (enteredText) => {
        if (enteredText) {
            setCurrentCourseName(enteredText);
            setNameError("");
        } else {
            setCurrentCourseName("");
            setNameError("Bitte einen Kursnamen eingeben");
        }
    };

    const setCourseIdHandler = (enteredText) => {
        if (enteredText) {
            if (true) {
                // CHECK name-scheme
                setCurrentCourseId(enteredText);
                setIdError("")
            } else {
                setIdError("Bitte ans Kürzel-Schema halten");
            }
        } else {
            setCurrentCourseId("");
            setIdError("Bitte ein Kürzel eingeben");
        }
    };

    const setMinMaxMembersHandler = (enteredNumber, isMin) => {
        setCurrentWarning("");

        if (enteredNumber < 1) {
            if (isMin) setCurrentMinMembers(1);
            else setCurrentMaxMembers(1);
        } else if (enteredNumber > 20) {
            if (isMin) setCurrentMinMembers(20);
            else setCurrentMaxMembers(20);
        } else {
            if (isMin) setCurrentMinMembers(enteredNumber);
            else setCurrentMaxMembers(enteredNumber);
        }
        if (currentMaxMembers >= currentMinMembers) setMaxMembersError("");
    }

    const setDateHandler = (enteredDate) => {
        if (enteredDate) {
            setCurrentDate(enteredDate);
            setDateError("");
            // parse enteredDate
        } else {
            setDateError("Offenes Projekt ohne Datumsangabe");
        }
    }

    const setFindCourseHandler = (enteredId) => {
        setCurrentFindName(enteredId);
    }
    
    const findCourseHandler = () => {
        if (currentFindName != "") {
            DB.addCourseToList(currentFindName, (addedCourse) => {
                setCurrentFindName("");
                var courseList = currentCourses;
                courseList.push(addedCourse);
                setCurrentCourses(courseList);
                setFindVisibility(false);
            }, (error) => {
                console.log(error);
            })
        }
    }

    const deleteCourseHandler = (id) => {
        swipeListView.safeCloseOpenRow();
        
        DB.removeCourseFromList(id, () => {
            DB.getCourseList((courseList) => {
                // console.log(courseList);
                setCurrentCourses(courseList);
                var joined = [];
                for (const course in courseList) {
                    if (courseList[course].members.indexOf(currentUserId) >= 0) {
                        joined.push(courseList[course].id);
                    }
                }
                setJoinedCourses(joined);
            });
        });
    };

    return (
        <View style={{flex: 1}}>
            {/* Kurs erstellen */}
            <Modal visible= { addCourseVisibility } animationType= 'slide'>
                <ModalComponent
                    title= 'Kurs erstellen'
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View>
                                <Text></Text>{/* Text-Absatz */}
                                <View style= { [styles.center, {width: "90%"}] }>
                                    <InputTile 
                                        title= "Kursname"
                                        placeholderText= "Kursname"
                                        value= { currentCourseName }
                                        onChangeText= { setCourseNameHandler }
                                    />
                                    <Text>
                                        { nameError }
                                    </Text>
                                    <InputTile 
                                        title= "Kurs-ID"
                                        placeholderText= "KürzelSemesterJahr"
                                        value= { currentCourseId }
                                        onChangeText= { setCourseIdHandler }
                                    />
                                    <Text>
                                        { idError }
                                    </Text>
                                    <View style={styles.row}>
                                        <View >
                                            <Text style= { [texts.buttonGrey, {paddingBottom: 5}] } >Mitglieder min.</Text>
                                            <NumericInput 
                                                onChange={(text) => { setMinMaxMembersHandler(text, true) }} 
                                                minValue = { 0 }
                                                maxValue= { 20 }
                                                rounded
                                                totalHeight={45} 
                                                containerStyle={{borderWidth: 0, backgroundColor: white}}
                                                separatorWidth={0}
                                                rightButtonBackgroundColor={lightBlue}
                                                leftButtonBackgroundColor={lightBlue}
                                                inputStyle={{fontWeight: "bold"}}
                                            />
                                            <Text>
                                                { minMembersError }
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style= { [texts.buttonGrey, {paddingBottom: 5}] }  >Mitglieder max.</Text>
                                            <NumericInput 
                                                onChange={(text) => { setMinMaxMembersHandler(text, false) }} 
                                                minValue = { 0 }
                                                maxValue= { 20 }
                                                rounded
                                                totalHeight={45} 
                                                containerStyle={{borderWidth: 0, backgroundColor: white}}
                                                separatorWidth={0}
                                                rightButtonBackgroundColor={lightBlue}
                                                leftButtonBackgroundColor={lightBlue}
                                                inputStyle={{fontWeight: "bold"}}
                                            />
                                            <Text>
                                                { maxMembersError }
                                            </Text>
                                        </View>
                                    </View>

                                    <View >
                                        <Text style= { texts.buttonGrey } >Enddatum (optional)</Text>
                                            <DatePicker
                                                style={{width: "100%"}}
                                                date={currentDate}
                                                format="DD.MM.YYYY"
                                                minDate="07.07.2020"
                                                maxDate="07.07.2021"
                                                confirmBtnText="OK"
                                                cancelBtnText="Abbrechen"
                                                showIcon={false}
                                                customStyles={{
                                                    dateInput: {
                                                        borderRadius: 10,
                                                        borderWidth: 0,
                                                        backgroundColor: white,
                                                        height: 45,
                                                        marginTop:15,
                                                    },
                                                    dateText : {
                                                        fontFamily: 'Inter_700Bold',
                                                        fontSize: 22
                                                    }
                                                }}
                                                onDateChange={(date) => { setDateHandler(date)}}
                                            />
                                        <Text>
                                            { dateError }
                                        </Text>
                                    </View>
                                </View>
                                <View style= { styles.paddedRow } >
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'OK' 
                                        onClick= {addCourseHandler}
                                    />
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'Abbrechen'
                                        onClick= { () => { setAddCourseVisibility(false); setCurrentWarning(""); } }
                                    />
                                </View>
                            </View>
                        )
                    }}
                />
            </Modal>

            {/* Kurs finden */}
            <Modal visible= { findVisibility } animationType= 'slide'>
                <ModalComponent
                    title= 'Kurs finden'
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View >
                                <Text></Text>{/* Text-Absatz */}
                                <View style= { [styles.center, {width: "90%"}] }>
                                    <InputTile 
                                        title= "Kurs-ID"
                                        placeholderText= "KürzelSemesterJahr"
                                        value= { currentFindName }
                                        onChangeText= { setFindCourseHandler }
                                    />
                                    <Text>
                                        { findCourseWarning }
                                    </Text>
                                </View>
                                <View style= { styles.paddedRow } >
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'OK' 
                                        onClick= {findCourseHandler}
                                    />
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'Abbrechen'
                                        onClick= { () => { setFindVisibility(false) } }
                                    />
                                </View>
                            </View>
                        )
                    }}
                />
            </Modal>

            {/* Meine Kurse */}
            <View style= {styles.subHeader} >
                <View style= { styles.paddedRow } >
                    <Button 
                        buttonStyle= { buttons.buttonRowGrey }
                        titleStyle= { texts.buttonGrey }
                        title= 'Kurs finden' 
                        icon= "find"
                        onClick= { () => { setFindVisibility(true) } }
                    />
                    <Button 
                        buttonStyle= { buttons.buttonRow }
                        titleStyle= { texts.buttonBlue }
                        title= 'Neuer Kurs'
                        icon= "plus"
                        onClick= { () => { setAddCourseVisibility(true) } }
                    />
                </View>
            </View>

            <SwipeListView
                style={{flexGrow: 1}}
                ref = {ref => setSwipeListView(ref)}
                data={currentCourses}
                disableLeftSwipe = {true}
                keyExtractor={(item, index) => index.toString()}

                renderItem={(itemData) => { 
                    return (
                        <ListTile
                            onClick={() => {clickHandler(itemData.item.id, itemData.item.title)}} 
                            id={itemData.item.id}
                            title={itemData.item.title}
                            subtitle={"Gruppengröße: " + itemData.item.minMembers + " – " + itemData.item.maxMembers + " Personen\n"+ itemData.item.date}
                            backgroundColor = {itemData.index % 2 === 0 ? white : lightGrey}
                            isMember = {joinedCourses.indexOf(itemData.item.id) >= 0}
                        />
                    )
                }}
                renderHiddenItem={ (itemData) => {
                    return (
                        <View style={{height: "100%", width: 500}}>
                                <DeleteCourseButton
                                    onClick={(ref) => {deleteCourseHandler(itemData.item.id)}}
                                />
                        </View>
                    )
                }}
                leftOpenValue={75}
            />
        </View>
  );
};


