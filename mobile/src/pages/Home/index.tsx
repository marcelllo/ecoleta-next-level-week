import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  ImageBackground,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

import ibge from "../../services/ibge";

interface DropdownItem {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const [ufs, setUfs] = useState<DropdownItem[]>([]);
  const [cities, setCities] = useState<DropdownItem[]>([]);

  useEffect(() => {
    setUf('');

    ibge.get<any[]>("/localidades/estados").then((response) => {
      const ufList = response.data.map((uf) => {
        return {
          label: uf.sigla,
          value: uf.sigla,
        };
      });

      setUfs(ufList);
    });
  }, []);

  useEffect(() => {
    setCity('');
    
    if (uf === "0") {
      setCities([]);
      return;
    }

    ibge.get<any[]>(`/localidades/estados/${uf}/distritos`).then((response) => {
      const cities = response.data.map((city) => {
        return {
          label: city.nome,
          value: city.nome,
        };
      });

      setCities(cities);
    });
  }, [uf]);

  function handleNavigateToPoints() {
    if (!uf || !city) {
      Alert.alert('Selecione o Estado e a Cidade!');
    } else {
      navigation.navigate("Points", {
        uf,
        city
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={styles.containerImage}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace para coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
        
          <RNPickerSelect
            placeholder={{label: 'Selecione um estado', value:'0'}}
            onValueChange={value => setUf(value)}
            value={uf}
            items={ufs}
          />
          
          <RNPickerSelect
            placeholder={{label: 'Selecione uma cidade', value:'0'}}
            onValueChange={value => setCity(value)}
            value={city}
            items={cities}
          />
          
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>            
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  containerImage: {
    width: 270,
    height: 368,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});
