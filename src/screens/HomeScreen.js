import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const tools = [
    {
      name: 'Identidad',
      desc: 'Predicciones de género y edad por nombre',
      icon: 'person-outline',
      color: '#4f46e5',
      screen: 'Identidad'
    },
    {
      name: 'Mundo',
      desc: 'Buscador de universidades y clima en tiempo real',
      icon: 'globe-outline',
      color: '#0891b2',
      screen: 'Mundo'
    },
    {
      name: 'Media',
      desc: 'Habilidades de Pokémon y noticias de WordPress',
      icon: 'play-circle-outline',
      color: '#db2777',
      screen: 'Media'
    },
    {
      name: 'Acerca de',
      desc: 'Contacto y perfil del desarrollador',
      icon: 'information-circle-outline',
      color: '#059669',
      screen: 'Acerca de'
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Caja de Herramientas</Text>
        <Text style={styles.subtitle}>Una aplicación multitarea para tu día a día</Text>
      </View>

      <Image 
        source={require('../../assets/toolbox.png')} 
        style={styles.heroImage} 
        resizeMode="contain"
      />

      <Text style={styles.sectionTitle}>Herramientas disponibles</Text>
      <View style={styles.grid}>
        {tools.map((tool, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.card, { borderLeftColor: tool.color }]} 
            onPress={() => navigation.navigate(tool.screen)}
          >
            <View style={styles.cardHeader}>
              <Ionicons name={tool.icon} size={28} color={tool.color} />
              <Text style={[styles.cardTitle, { color: tool.color }]}>{tool.name}</Text>
            </View>
            <Text style={styles.cardDesc}>{tool.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Desarrollado con React Native & Expo</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
  },
  heroImage: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginTop: 10,
  },
  grid: {
    width: '100%',
    gap: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
