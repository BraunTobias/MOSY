import React from 'react';
import  {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/InputScreen';
import CourseScreen from '../screens/CourseScreen';
import ProjectScreen from '../screens/ProjectScreen';

const HomeStack = createStackNavigator();

export default HomeNavigator = () => {
    return (
        <HomeStack.Navigator initialRouteName="Home" screenOptions={{
            headerStyle: {height: 130},
            headerTitleStyle: {
                fontSize: 32,
                fontWeight: 'bold',
                color: 'tomato'
            }
        }}>
            <HomeStack.Screen name = "Home" component= {HomeScreen} options={{headerTitle: 'Meine Kurse'}}/>
            <HomeStack.Screen name = "AddCourse" component = {InputScreen} options={{headerTitle: 'Kurs hinzufügen'}}/>
            <HomeStack.Screen name = "AddProject" component = {InputScreen} options={{headerTitle: 'Projekt hinzufügen'}}/>
            <HomeStack.Screen name = "Course" component = {CourseScreen}/>
            <HomeStack.Screen name = "Project" component= {ProjectScreen}/>
        </HomeStack.Navigator>
    );
};