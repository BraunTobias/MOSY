import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { BackHandler } from 'react-native';
import { LogInContext } from '../data/LogInContext';
import { USERS } from '../data/dummy-data'

export default LoginScreen = ({navigation}) => {
    const [authentication, setAuthentication, user, setUser] = useContext(LogInContext);
    const [currentMail, setCurrentMail] = useState("");
    const [currentPW, setCurrentPW] = useState("");
    const [errorVisibility, setErrorVisibility] = useState(false);

    // Benutzereingaben
    const changeMailHandler = (enteredText) => {
        setCurrentMail(enteredText);
      };
    const changePWHandler = (enteredText) => {
        setCurrentPW(enteredText);
    };
    
    // Authentifizierung
    const checkAuth = () => {
        const user = USERS.find(user => user.mail === currentMail && user.pw === currentPW);
        if (user) {
            setUser(user);
            console.log("User: " + user.username);
            setAuthentication(true);
            console.log("authenticated true");
        }
        else {
            setErrorVisibility(true);
        }
    }

    return(
        <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'center'}}>
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Modal visible={errorVisibility} animationType='slide'>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                        <Text>Falsche Mail oder PW.</Text>
                        <Button title='OK'onPress={() => setErrorVisibility(false)}/>
                    </View>
                </Modal>
                
                <Text>E-Mail</Text>
                <TextInput 
                    placeholder="student@example.com"
                    onChangeText={changeMailHandler}
                />
                <Text>Passwort</Text>
                <TextInput
                    placeholder="####"
                    onChangeText={changePWHandler}
                />
                <Button 
                    title= "Login"
                    onPress={checkAuth}
                />
                <Button 
                    title= "Registrieren"
                    onPress={() =>navigation.navigate("Registration")}
                />
                <Button 
                    title= "Beenden"
                    onPress={() =>BackHandler.exitApp()}
                />
            </View>
        </View>
    );
}