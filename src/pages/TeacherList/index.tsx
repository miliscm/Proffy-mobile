import React, { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import styles from "./styles";
import PageHeader from "../../componentes/PageHeader";
import TeacherItem, { Teacher } from "../../componentes/TeacherItem";
import {
  ScrollView,
  BorderlessButton,
  RectButton,
} from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [isFiltersVisible, setFiltersVisible] = useState(false);
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [week_day, setWeekDay] = useState("");
  const [favorites, setFavorites] = useState<Number[]>([]);
  function loadFavorites() {
    AsyncStorage.getItem("favorite").then((response) => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map(
          (teacher: Teacher) => {
            return teacher.id;
          },
        );
        setFavorites(favoritedTeachersIds);
      }
    });
  }
  useFocusEffect(() => {
    loadFavorites();
  });

  async function handleFilterSubmit() {
    loadFavorites();
    const response = await api.get("classes", {
      params: {
        subject,
        week_day,
        time,
      },
    });
    setFiltersVisible(false);
    setTeachers(response.data);
  }

  function handleToggleFilterVisible() {
    setFiltersVisible(!isFiltersVisible);
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight={
          <BorderlessButton onPress={handleToggleFilterVisible}>
            <Feather name="filter" size={20} color="#fff" />
          </BorderlessButton>
        }
      >
        {isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              value={subject}
              onChangeText={(text) => setSubject(text)}
              style={styles.input}
              placeholder="Qual a matéria"
              placeholderTextColor="#c1bcc"
            />
            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  value={week_day}
                  onChangeText={(text) => setWeekDay(text)}
                  style={styles.input}
                  placeholder="Qual o dia"
                  placeholderTextColor="#c1bcc"
                />
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  value={time}
                  onChangeText={(text) => setTime(text)}
                  placeholderTextColor="#c1bcc"
                  style={styles.input}
                  placeholder="Qual horários"
                />
              </View>
            </View>
            <RectButton
              onPress={handleFilterSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
        style={styles.teacherList}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
export default TeacherList;
