import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import PageHeader from "../../componentes/PageHeader";
import { ScrollView } from "react-native-gesture-handler";
import TeacherItem, { Teacher } from "../../componentes/TeacherItem";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  function loadFavorites() {
    AsyncStorage.getItem("favorite").then((response) => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);

        setFavorites(favoritedTeachers);
      }
    });
  }
  useFocusEffect(() => {
    loadFavorites();
  });
  return (
    <View style={styles.container}>
      <PageHeader
        title="Meus proffys
          Favoritos"
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
        style={styles.teacherList}
      >
        {favorites.map((teacher: Teacher) => {
          return (
            <TeacherItem key={teacher.id} teacher={teacher} favorited={true} />
          );
        })}
      </ScrollView>
    </View>
  );
}
export default Favorites;
