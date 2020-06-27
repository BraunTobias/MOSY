import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import DB from '../api/DB_API';

export default ProfileImageTile = props => {

  const imageUrl = props.imageUrl;

  return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => props.onClick()} >
        <Image style={styles.profileImage}
          source={{ uri: imageUrl}} 
        />
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingLeft: 15,
    paddingVertical: 10,
  },
  profileImage: {
    borderRadius: 100,
    aspectRatio: 1, 
    height: 70,
    backgroundColor: "#aeb8c3"
  },
});