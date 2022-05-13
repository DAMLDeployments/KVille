import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
} from "react-native";
import zion from "../assets/zion.png";
import { Picker } from "@react-native-picker/picker";

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1f509a",
  },
  backgroundImage: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    height: "70%",
    width: "80%",
    marginVertical: 50,
    //justifyContent: "space-between"
  },
  text: {
    color: "#fff",
    //fontFamily: "Open Sans",
    fontSize: 22,
    fontWeight: "700",
  },
  centerText: {
    color: "#fff",
    //fontFamily: "Open Sans",
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },
  textInput: {
    height: "5%",
    textAlign: "center",
    backgroundColor: "#FFFAFACC",
    borderRadius: 15,
    placeholderTextColor: "#897F7FCC",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  cancelBtn: {
    borderRadius: 30,
    backgroundColor: "#000",
    padding: 15,
    width: "45%",
  },
  createBtn: {
    borderRadius: 30,
    backgroundColor: "#1F509A",
    padding: 15,
    width: "45%",
  },
  btnTxt: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 36,
    textAlign: "center",
  },
});

export class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      tentType: "",
      groupCode: "",
    };
  }
  render() {
    return (
      <View style={styles.groupContainer}>
        <ImageBackground source={zion} style={styles.backgroundImage}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Group Name:</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Enter Group Name"
              onChangeText={(name) => this.setState({ name })}
            />

            <Text style={styles.centerText}>Group Code</Text>
            <View style={{ backgroundColor: "#FFFAFA90", height: "15%", alignContent: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 48,
                  fontWeight: "bold",
                }}
              >
                FKD31F
              </Text>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={styles.btnTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => this.props.navigation.navigate("GroupNavigator")}
            >
              <Text style={styles.btnTxt}>Create</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default Group;
