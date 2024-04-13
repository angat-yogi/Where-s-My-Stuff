import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Modal, Button, TouchableOpacity, Image, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import Colors from "../../Utils/Colors";
import PieChart from 'react-native-pie-chart'
import Header from "../HomeScreen/Header";

export default function FavoriteScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setTimeout(() => {
      setModalVisible(true);
    }, 100); // Adjust the delay time if needed
  };
  const widthAndHeight = 250
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']

  return (
    <>
          <Header  shouldDisplayProfile={false}/>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Calendar
        style={styles.calendar}
        theme={calendarTheme}
        monthFormat={"yyyy MM"}
        firstDay={1}
        hideArrows={false}
        hideExtraDays={false}
        onDayPress={handleDayPress}
        disableMonthChange={false}
        hideDayNames={false}
        showWeekNumbers={false}
        hideWeekNumbers={false}
        enableSwipeMonths={true}
        dayComponent={({ date, state }) => (
          <TouchableOpacity onPress={() => handleDayPress(date)}>
            <View
              style={[
                styles.dayContainer,
                {
                  borderColor: state === "selected" ? "blue" : "black",
                  opacity: state === "disabled" ? 0.4 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: state === "today" ? Colors.BEIGE : Colors.BLACK,
                  fontSize: state === "today" ?30 : 15,
                }}
              >
                {date.day}
              </Text>
            </View>
          </TouchableOpacity>)}
      />
      <View style={styles.chartContainer}>
        <PieChart widthAndHeight={widthAndHeight} series={series} sliceColor={sliceColor} coverFill={null} coverRadius={0.5}/>
        
      </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Selected Date: {selectedDate}</Text>
            <View style={styles.imageContainer}>
            <Image source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpmMPTYtNLykFqyC151Lbr0xzn8Z2PYwGbVg&usqp=CAU'}} style={styles.image} />
          </View>            
          <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
    </>

  );
}

const calendarTheme = {
  backgroundColor: "#ffffff",
  calendarBackground: "#ffffff",
  textSectionTitleColor: "#b6c1cd",
  selectedDayBackgroundColor: "#00adf5",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#00adf5",
  dayTextColor: "#2d4150",
  textDisabledColor: "#d9e1e8",
  dotColor: "#00adf5",
  selectedDotColor: "#ffffff",
  arrowColor: "orange",
  disabledArrowColor: "#d9e1e8",
  monthTextColor: "blue",
  indicatorColor: "blue",
  textDayFontFamily: "monospace",
  textMonthFontFamily: "monospace",
  textDayHeaderFontFamily: "monospace",
  textDayFontWeight: "300",
  textMonthFontWeight: "bold",
  textDayHeaderFontWeight: "300",
  textDayFontSize: 20,
  textMonthFontSize: 20,
  textDayHeaderFontSize: 20,
};

const styles = StyleSheet.create({
  container: {
    paddingTop:20,
    flex: 1,
    backgroundColor: "#fff",
  },
  calendar: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height*0.5,
    borderWidth: 1,
    borderColor: "gray",
  },
  dayContainer: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius:5
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  imageContainer: {
    flexDirection: 'row', // Arrange children horizontally
    justifyContent: 'center', // Center children horizontally
    alignItems: 'center', // Center children vertically
  },
  image: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
    margin: 10, // Adjust margin as needed
    resizeMode: 'cover', // Adjust resizeMode as needed
    borderRadius: 10, // Adjust borderRadius as needed
  },
  chartContainer: {
    marginTop:10,
    marginBottom:50,
    paddingTop:10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});
