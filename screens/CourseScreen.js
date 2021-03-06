import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, FlatList, Modal, ActivityIndicator } from "react-native";
import ListTile from '../components/ListTile';
import Button from '../components/Button';
import ButtonSimple from '../components/ButtonSimple';
import { SwipeListView } from 'react-native-swipe-list-view';
import AttributeSelect from '../components/AttributeSelect';
import DB from '../api/DB_API';
import ProfileImageTile from '../components/ProfileImageTile';
import FavButton from '../components/FavButton';
import NogoButton from '../components/NogoButton';
import { styles, buttons, texts, white, lightGrey, lightBlue, darkBlue } from '../Styles';
import ProFiFunction from '../api/ProFiFunction';

export default CourseScreen = ({route, navigation}) => {
    const {itemId} = route.params;
    const {itemTitle} = route.params;
    const {isMember} = route.params;
    const currentUserId = DB.getCurrentUserId();
    const [swipeListView, setSwipeListView] = useState();

    // States für Auswertungs-Ansicht
    const [evaluating, setEvaluating] = useState(false);
    const [evaluated, setEvaluated] = useState(true);

    // States für Profil-Ansicht
    const [viewedUserId, setViewedUserId] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(false);
    
    // States für Idea-Eingabe
    const [errorVisibility, setErrorVisibility] = useState(false);
    const [addIdeaVisibility, setAddIdeaVisibility] = useState(false);
    const [skillsVisibility, setSkillsVisibility] = useState(false);
    const [currentIdeaName, setCurrentIdeaName] = useState("");
    const [currentIdeaDescription, setCurrentIdeaDescription] = useState("");
    const [selectedSkillsList, setSelectedSkillsList] = useState([]);
    const [selectedPrefsList, setSelectedPrefsList] = useState([]);
    
    // Später noch getrennte Warnungsfelder anlegen
    const [ideaError, setIdeaError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [currentWarning, setCurrentWarning] = useState("");
    
    // States für Kursinfo
    const [founderId, setFounderId] = useState("");
    const [founder, setFounder] = useState("");
    const [currentIdeas, setCurrentIdeas] = useState([]);
    const [members, setMembers] = useState([]);
    const [minMembers, setMinMembers] = useState(0);
    const [maxMembers, setMaxMembers] = useState(0);
    const [date, setDate] = useState("");
    const [userIsMember, setUserIsMember] = useState(isMember);
    
    const [currentFav, setCurrentFav] = useState();
    const [currentNogo, setCurrentNogo] = useState();

    // Wird nur beim Laden der Seite einmalig ausgeführt
    useEffect(() => {
        getIdeasData();
        getCourseData();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: itemId,
        });
    }, [navigation]);

    const getIdeasData = () => {
        DB.getIdeasList(itemId, (ideasList) => {
            setCurrentIdeas(ideasList);
            // console.log(ideasList);
            for (const idea in ideasList) {
                if (ideasList[idea].favourites != null && ideasList[idea].favourites.indexOf(currentUserId) >= 0) {
                    setCurrentFav(ideasList[idea].id);
                } else if (ideasList[idea].nogos != null && ideasList[idea].nogos.indexOf(currentUserId) >= 0) {
                    setCurrentNogo(ideasList[idea].id);
                }
            }
        });
    }

    const getCourseData = () => {
        DB.getCourseData(itemId, (data) => {

            setFounderId(data.founder);
            setDate(data.date);
            setMinMembers(data.minMembers);
            setMaxMembers(data.maxMembers);
            if (!data.evaluated) {
                setEvaluated(false);
            }

            if (data.members && data.members.length > 0) {
                const memberUidList = data.members;
                var newMembersList = [];
                for (const member in memberUidList) {
                    const uid = memberUidList[member];
                    DB.getUserInfoById(uid, (name, url) => {
                        newMembersList.push({
                            "userId": uid,
                            "username": name,
                            "imageUrl": url
                        });
                        setMembers(newMembersList);
                    });
                }
            } else {
                setMembers([]);
            }
            DB.getUserInfoById (data.founder, (userName, userImage, bio, email) => {
                setFounder(userName);
            });
        });
    }

    const setEvaluationHandler = () => {
        setEvaluating(true);
        ProFiFunction(itemId, () => {

            getIdeasData();
            setTimeout(() => {       
                setCurrentFav("");
                setCurrentNogo("");
                setEvaluating(false);
                setEvaluated(true);
            }, 1000);
        });
    }

    const clickIdeaHandler = (id, title, subtitle, skills) => {
        swipeListView.safeCloseOpenRow();
        navigation.navigate("Project", {itemId: id, itemTitle: title, itemSubtitle: subtitle, skillsList: skills, courseId: itemId});
    };

    const clickProfileHandler = (userId) => {
        setProfileVisibility(true);
        setViewedUserId(userId);
        // console.log("User ID: " + viewedUserId);
    };

    const addIdeaHandler = () => {
        if (currentIdeaName != "" && currentIdeaDescription != "" && selectedSkillsList.length > 1) {
            // console.log ('OK')
            DB.addIdea(itemId, currentIdeaName, currentIdeaDescription, selectedSkillsList, [], () => {
                setAddIdeaVisibility(false);
                setCurrentIdeaName("");
                setCurrentIdeaDescription("");
                setSelectedSkillsList([]);
                DB.getIdeasList(itemId, (ideasList) => {
                    setCurrentIdeas(ideasList);
                });
            });
        } else {
            // console.log ('Error')
            setCurrentWarning("Eingabe nicht vollständig");
            setErrorVisibility(true);
        }
    };
    
    const setIdeaNameHandler = (enteredText) => {
        if (enteredText) {
            setCurrentIdeaName(enteredText);
            setIdeaError("")
        } else {
            setCurrentIdeaName("")
            setIdeaError("Bitte einen Ideenamen eingeben")
        }
    };

    const setIdeaDesriptionHandler = (enteredText) => {
        if (enteredText) {
            setCurrentIdeaDescription(enteredText);
            setDescriptionError("")
        } else {
            setCurrentIdeaDescription("")
            setDescriptionError("Bitte eine Kurzbeschreibung eingeben")
        }
    };

    const addSelectedSkillHandler = (skill) => {
        var oldList = selectedSkillsList;
        if (oldList.indexOf(skill) < 0) {
            oldList.push(skill);
        } else {
            var newList = oldList.filter(item => item !== skill);
            setSelectedSkillsList(newList);
        }
        if (selectedSkillsList.length > 0) {
            setCurrentWarning("");
        }
    };
    const addFavHandler = (ideaId) => {
        swipeListView.safeCloseOpenRow();
        if (currentFav == ideaId) {
            DB.deletePref("favourites", itemId, () => {
                setCurrentFav("");
            });
        } else {
            DB.addPref("favourites", itemId, ideaId, () => {
                setCurrentFav(ideaId);
                if (currentNogo == ideaId) {
                    setCurrentNogo("");
                }
            });
        }
    }
    const addNogoHandler = (ideaId) => {
        swipeListView.safeCloseOpenRow();
        if (currentNogo == ideaId) {
            DB.deletePref("nogos", itemId, () => {
                setCurrentNogo("");
            });
        } else {
            DB.addPref("nogos", itemId, ideaId, () => {
                setCurrentNogo(ideaId);
                if (currentFav == ideaId) {
                    setCurrentFav("");
                }
            });
        }
    }
    const joinCourseHandler = () => {
        if (!userIsMember) {
            DB.joinCourse(itemId, () => {
                // console.log("Joined");
                setUserIsMember(true);
                getCourseData();
            }, () => {console.log("error")})
        } else {
            DB.exitCourse(itemId, () => {
                // console.log("Ausgetreten");
                setUserIsMember(false);
                getCourseData();
            })
        }
    }

    const EvaluateButton = () => {
        if (founderId === currentUserId && !evaluated) {
            return (
                <View style= { styles.center } >
                    <ButtonSimple 
                        title= { "Teams einteilen" }
                        onClick= {setEvaluationHandler}
                        style= { buttons.buttonEvaluate }
                    />
                </View>
            )
        } else { return null }
    }

    const PreEvaluateButtons = () => {
        if (!evaluated) {
            return (
                <View style= { styles.paddedRow } >
                    <Button 
                        buttonStyle= { buttons.buttonRowGrey }
                        titleStyle= { texts.buttonGrey }
                        title= {userIsMember ? "Mitglied" : "Beitreten" }
                        icon= {userIsMember ? "checkTrue" : "checkFalse"}
                        onClick= {joinCourseHandler}
                        disabled= {evaluated}
                    />
                    <Button 
                        buttonStyle= { buttons.buttonRow }
                        titleStyle= { texts.buttonBlue }
                        title= "Neue Idee"
                        icon= "plus"
                        onClick= { () => { setAddIdeaVisibility(true) } }
                        disabled= {evaluated}
                    />
                </View>
            )
        } else { return null }
    }

    return(
        <View style={{flex: 1}}>

            {/* // Idee hinzufügen: Fähigkeiten auswählen */}
            <Modal visible={evaluating} animationType='fade'>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <ActivityIndicator size="large" color={darkBlue} style={{paddingBottom: 20}}/>
                    <Text style= { texts.headlineCenter }>Berechne Teams…</Text>

                </View>
            </Modal>
            
            {/* // Idee hinzufügen */}
            <Modal visible={addIdeaVisibility} animationType='slide'>
                <ModalComponent
                    title= 'Idee hinzufügen'
                    subheader= { () => {}}
                    content= { () => {
                        return(
                            <View style= {{ backgroundColor: lightGrey }}>
                                <View style= { styles.content }>
                                <Text></Text>{/* // Text-Absatz */}
                                    <View style= { [styles.center, {width: "100%"}] }>
                                        <InputTile 
                                            title= "Idee-Name"
                                            placeholderText= "Idee"
                                            value= { currentIdeaName }
                                            onChangeText= { setIdeaNameHandler }
                                        />
                                        <Text>
                                            { ideaError }
                                        </Text>
                                        <InputTile 
                                            title= "Kurzbeschreibung"
                                            placeholderText= "Eine kurze Beschreibung der Idee"
                                            value= { currentIdeaDescription }
                                            onChangeText= { setIdeaDesriptionHandler }
                                            />
                                        <Text>
                                            { descriptionError }
                                        </Text>
                                    </View>
                                </View>
                                
                                <View>
                                    <ListTile
                                        title= { "Fähigkeiten auswählen" }
                                        subtitle= { selectedSkillsList.join(", ") }
                                        onClick= { () => setSkillsVisibility(true) } 
                                    />
                                </View>

                                <View style= { styles.paddedRow } >
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'OK' 
                                        onClick= { () => { addIdeaHandler() } }
                                    />
                                    <Button 
                                        buttonStyle= { buttons.buttonRow }
                                        titleStyle= { texts.buttonBlueCenter }
                                        title= 'Abbrechen'
                                        onClick= { () => { 
                                            console.log ('Error');
                                            setAddIdeaVisibility(false); } }
                                    />
                                </View>

                                {/* // Error Popup */}
                                <Modal visible={errorVisibility} transparent = {true}>
                                    <View style={styles.errorView}>
                                        <View style={styles.errorContainer}>
                                            <Text style= { texts.headlineCenter } >
                                                {currentWarning}
                                            </Text>
                                            <ButtonSimple
                                                title='OK'
                                                onClick={() => setErrorVisibility(false)}
                                                style= { buttons.buttonSimple }
                                            />
                                        </View>
                                    </View>
                                </Modal>

                            </View>
                        )
                    }}
                />
                {/* // Idee hinzufügen: Fähigkeiten auswählen */}
                <Modal visible={skillsVisibility} animationType='slide'>
                    <View style={{flex: 1}}>
                        <View style= { styles.headerFake }>
                            <Text style= { texts.header }>Fähigkeiten auswählen</Text>
                        </View>

                        <View style={{flex: 1}}>
                            <View style={{height: "85%"}}>
                                <AttributeSelect 
                                    
                                    attributeType={"skills"} 
                                    selectedAttributesList={selectedSkillsList} 
                                    addSelectedAttribute={addSelectedSkillHandler} 
                                >
                                </AttributeSelect>
                            </View>
                            <View style={{height: "15%", justifyContent:"center", alignItems: "center", backgroundColor: lightGrey}}>
                                <Button 
                                    buttonStyle= { buttons.buttonRow }
                                    titleStyle= { texts.buttonBlueCenter }
                                    title='OK' 
                                    onClick={() => {setSkillsVisibility(false)}}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </Modal>
            
            {/* // User-Profil ansehen */}
            <Modal visible={profileVisibility} animationType='slide'>
                <View style={{flex: 1}}>
                    <View style= { styles.headerFake }>
                        <Text style= { texts.header }>Profil</Text>
                    </View>

                    <View style={{flex: 1}}>
                        <View style={{height: "85%"}}>
                            <ProfileView userId={viewedUserId}/>
                        </View>
                        <View style={{height: "15%", justifyContent:"center", alignItems: "center", backgroundColor: lightGrey}}>
                            <Button 
                                buttonStyle= { buttons.buttonRow }
                                titleStyle= { texts.buttonBlueCenter }
                                title='OK' 
                                onClick={() => {setProfileVisibility(false)}}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Kursansicht */}
            <View style= { styles.subHeader } >
                <View style= { styles.headerRow } >
                    <Text style= { texts.headlineCenter }>{itemTitle}</Text>
                    <Text style= { texts.headlineCenter }>{founderId === currentUserId ? "Mein Kurs" : founder}</Text>
                </View>
                <View style= { styles.headerRow } >
                    <Text style= { texts.headlineCenter }>{date}</Text>
                    <Text style= { texts.headlineCenter }>{minMembers}–{maxMembers} Personen</Text>
                </View>

                {/* Membericons */}
                <View style= { styles.membersRow } >
                    <FlatList style={{paddingLeft: 5}}
                        data={members}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(itemData) => { 
                            return (
                                <ProfileImageTile
                                    onClick={() => {clickProfileHandler(itemData.item.userId)}} 
                                    imageUrl={itemData.item.imageUrl}
                                    isLast={itemData.index == members.length - 1 ? true : false}
                                />
                            );
                        }}
                    >
                    </FlatList>
                </View>
                {/* Buttons */}
                <PreEvaluateButtons/>

                {/* Auswerten-Button */}
                <EvaluateButton />
            </View>
            <SwipeListView
                style={{flexGrow: 1}}
                ref = {ref => setSwipeListView(ref)}
                data={currentIdeas}
                disableLeftSwipe = {true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(itemData) => { 
                    return (
                        <ListTile
                            onClick={clickIdeaHandler} 
                            id={itemData.item.id}
                            title={itemData.item.title}
                            subtitle={itemData.item.description}
                            skills={itemData.item.skills}
                            isFavourite={itemData.item.id == currentFav}
                            isNogo={itemData.item.id == currentNogo}
                            backgroundColor = {itemData.item.myTeam ? darkBlue : itemData.index % 2 === 0 ? white : lightGrey}
                            myTeam = {itemData.item.myTeam}
                        />
                    );
                }}
                renderHiddenItem={ (itemData) => {
                    return (
                        <View style={{width: "90%", backgroundColor: "#640023"}}>
                            <View style={{height: "100%", width: 120, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                <FavButton 
                                    ideaId={itemData.item.id} 
                                    courseId={itemId} 
                                    backgroundColor={itemData.item.id == currentFav ? lightGrey : "#222f56"}
                                    iconColor={itemData.item.id == currentFav ? lightBlue : "white"}
                                    onClick={() => {addFavHandler(itemData.item.id)}}
                                />
                                <NogoButton 
                                    ideaId={itemData.item.id} 
                                    courseId={itemId} 
                                    backgroundColor={itemData.item.id == currentNogo ? lightGrey : "#640023"}
                                    iconColor={itemData.item.id == currentNogo ? lightBlue : "white"}
                                    onClick={() => {addNogoHandler(itemData.item.id)}}
                                />
                            </View>
                        </View>
                    )
                }}
                leftOpenValue={120}
            />
        </View>
  );

}