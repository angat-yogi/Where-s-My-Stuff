import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import { Formik } from "formik";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import GlobalApi from "../../API/GlobalApi";

export default function AddToDoScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [toDoInfo, setToDoInfo] = useState({});

  const { user, isLoading } = useUser();

  const addToDo = (values) => {
    setSelectedDate(values.date);
    setDescription(values.description);
    const data = {
      userId: user?.emailAddresses[0]?.emailAddress,
      description: description,
      dueDate: selectedDate,
    };

    GlobalApi.addToDos(data).then((resp) => {
      ToastAndroid.show("To Do added successfully", ToastAndroid.LONG);
    });
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ description: "", date: new Date() }}
        onSubmit={addToDo}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={values?.description?.toString()}
              onChangeText={handleChange("description")}
            />
            <TextInput
              style={styles.input}
              placeholder="Due Date"
              value={values?.date?.toString()}
              keyboardType="default"
              onChangeText={handleChange("date")}
            />

            <Button
              onPress={() => handleSubmit(values)}
              title="Submit"
              color="green"
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 17,
    fontFamily: "ProtestRiot",
    fontSize: 15,
    marginBottom: 10,
  },
  container: {
    justifyContent: "center",
    marginTop: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
});
