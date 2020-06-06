import React, { useState, useEffect } from "react";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { Image, Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Linking } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

interface Params {
  pointId: number;
}

interface Item {
  title: string;
}

interface PointDetail {
  name: string;
  image: string;
  image_url: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  items: Item[];
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [pointDetail, setPointDetail] = useState<PointDetail>({} as PointDetail);

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`/point/${routeParams.pointId}`).then(response => {
      setPointDetail(response.data);
    });
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduo',
      recipients: [pointDetail.email]
    })
  }

  function handleWhatsapp() {
    let whatsapp = pointDetail.whatsapp;
    if (!whatsapp.includes('+')) {
      whatsapp = `+55${whatsapp}`;
    }
    Linking.openURL(`whatsapp://send?phone=${whatsapp}&text=Tenho interesse na coleta de resíduos!`);
  }

  if (!pointDetail.name) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon size={28} name="arrow-left" color="#34cb79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{ uri: pointDetail.image_url }}
        />

        <Text style={styles.pointName}>{pointDetail.name}</Text>
        <Text style={styles.pointItems}>{pointDetail.items && pointDetail.items.map(item => item.title).join(', ')}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{pointDetail.city} / {pointDetail.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleWhatsapp}>
            <FontAwesome size={20} name="whatsapp" color="#fff" />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>

          <RectButton style={styles.button} onPress={handleComposeMail}>
            <Icon size={20} name="mail" color="#fff" />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 48,
  },

  pointImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: "#322153",
    fontSize: 28,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  pointItems: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: "#322153",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  addressContent: {
    fontFamily: "Roboto_400Regular",
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#999",
    paddingVertical: 20,
    paddingHorizontal: 32,

    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    width: "48%",
    backgroundColor: "#34CB79",
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 8,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
  },
});
