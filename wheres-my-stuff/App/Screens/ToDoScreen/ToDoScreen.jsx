import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from "react-native";
import Header from "../HomeScreen/Header";
import Slider from "../HomeScreen/Slider";
import { SwipeListView } from "react-native-swipe-list-view";
import { FontAwesome } from "@expo/vector-icons";

export default function ToDoScreen() {
  // Sample data for demonstration
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([
    { id: 1, title: "Task 123", completed: false, dueDate: new Date() },
    {
      id: 2,
      title: "Task 2",
      completed: true,
      dueDate: new Date("2024-04-15"),
    },
    {
      id: 3,
      title: "Task 3",
      completed: false,
      dueDate: new Date("2024-05-27"),
    },
    {
      id: 4,
      title: "Task 4",
      completed: false,
      dueDate: new Date("2024-02-28"),
    },
    {
      id: 5,
      title: "Task 5",
      completed: false,
      dueDate: new Date("2024-03-01"),
    },
  ]);

  // Function to check if two dates are on the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Function to categorize tasks into Today, Upcoming, and Past Due
  const categorizeTasks = (todos) => {
    const today = new Date();
    const todayTasks = [];
    const pastTasks = [];
    const futureTasks = [];

    todos.forEach((todo) => {
      if (isSameDay(todo.dueDate, today)) {
        todayTasks.push(todo);
      } else if (todo.dueDate < today) {
        pastTasks.push(todo);
      } else {
        futureTasks.push(todo);
      }
    });

    return { todayTasks, pastTasks, futureTasks };
  };

  const { todayTasks, pastTasks, futureTasks } = categorizeTasks(todos);

  // Function to format the date
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Function to render hidden items for swipe actions
const renderHiddenItem = (data, rowMap, swipedRight) => (
  <View style={styles.hiddenContainer}>
    {swipedRight ? (
      <TouchableOpacity
        onPress={() => handleMarkAsDone(data.item.id)}
        style={[styles.hiddenButton, styles.doneButton]}
      >
        <FontAwesome name="check" size={24} color="green" />
      </TouchableOpacity>
    ) : (
      <FontAwesome name="times" size={24} color="red" />
    )}
  </View>
);

// Function to handle marking a to-do as done
const handleMarkAsDone = (id) => {
  const updatedTodos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: true } : todo
  );
  setTodos(updatedTodos);
};

  // Function to handle adding new to-do item
  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      const newTodoItem = {
        id: todos.length + 1,
        title: newTodo,
        completed: false,
        dueDate: new Date(),
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
    }
  };

  return (
    <View style={styles.container}>
      <Header icon="plus" action="addToDo" shouldDisplayProfile={true}/>
      <View style={styles.sliderContainer}>
        <Slider />
      </View>
      {/* Input field to add new to-do */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new to-do"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <Button title="Add" onPress={handleAddTodo} />
      </View>
      {/* Today tasks */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Today:</Text>
        <SwipeListView
          data={todayTasks}
          renderItem={(data, rowMap) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{data.item.title}</Text>
            </View>
          )}
          renderHiddenItem={(data, rowMap) =>
            renderHiddenItem(data, rowMap, false)
          }
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      </View>
      {/* Upcoming tasks */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Upcoming:</Text>
        <SwipeListView
          data={futureTasks}
          renderItem={(data, rowMap) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{data.item.title}</Text>
            </View>
          )}
          renderHiddenItem={(data, rowMap) =>
            renderHiddenItem(data, rowMap, false)
          }
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      </View>
      {/* Past due tasks */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Past Due:</Text>
        <SwipeListView
          data={pastTasks}
          renderItem={(data, rowMap) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{data.item.title}</Text>
            </View>
          )}
          renderHiddenItem={(data, rowMap) =>
            renderHiddenItem(data, rowMap, true)
          }
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sliderContainer: {
    padding: 15,
  },
  sectionContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  itemText: {
    fontSize: 16,
  },
  hiddenContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
  },
});
