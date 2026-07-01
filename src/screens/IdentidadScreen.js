import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function IdentidadScreen() {
  const [activeTab, setActiveTab] = useState('genero'); // 'genero' | 'edad'
  
  // States for Gender Predictor
  const [genderName, setGenderName] = useState('');
  const [genderResult, setGenderResult] = useState(null);
  const [genderLoading, setGenderLoading] = useState(false);
  const [genderError, setGenderError] = useState('');

  // States for Age Predictor
  const [ageName, setAgeName] = useState('');
  const [ageResult, setAgeResult] = useState(null);
  const [ageLoading, setAgeLoading] = useState(false);
  const [ageError, setAgeError] = useState('');

  // Fetch Gender function
  const fetchGender = async () => {
    if (!genderName.trim()) {
      setGenderError('Por favor ingresa un nombre.');
      return;
    }
    setGenderLoading(true);
    setGenderError('');
    setGenderResult(null);
    try {
      const response = await fetch(`https://api.genderize.io/?name=${encodeURIComponent(genderName.trim())}`);
      const data = await response.json();
      if (data.gender) {
        setGenderResult(data);
      } else {
        setGenderError('No se pudo determinar el género para este nombre.');
      }
    } catch (err) {
      setGenderError('Error al conectar con el servidor.');
    } finally {
      setGenderLoading(false);
    }
  };

  // Fetch Age function
  const fetchAge = async () => {
    if (!ageName.trim()) {
      setAgeError('Por favor ingresa un nombre.');
      return;
    }
    setAgeLoading(true);
    setAgeError('');
    setAgeResult(null);
    try {
      const response = await fetch(`https://api.agify.io/?name=${encodeURIComponent(ageName.trim())}`);
      const data = await response.json();
      if (data.age !== null && data.age !== undefined) {
        setAgeResult(data);
      } else {
        setAgeError('No se pudo estimar la edad para este nombre.');
      }
    } catch (err) {
      setAgeError('Error al conectar con el servidor.');
    } finally {
      setAgeLoading(false);
    }
  };

  // Categorize Age for the avatar and text
  const getAgeDetails = (age) => {
    if (age < 30) {
      return {
        label: 'Joven',
        avatar: require('../../assets/young.png'),
        desc: 'Una etapa llena de energía, aprendizaje y nuevas oportunidades por delante.',
        color: '#f59e0b'
      };
    } else if (age <= 65) {
      return {
        label: 'Adulto',
        avatar: require('../../assets/adult.png'),
        desc: 'Una época de estabilidad, desarrollo profesional y madurez personal.',
        color: '#10b981'
      };
    } else {
      return {
        label: 'Anciano',
        avatar: require('../../assets/elderly.png'),
        desc: 'Un tiempo de sabiduría acumulada, tranquilidad y gozo de lo sembrado.',
        color: '#6366f1'
      };
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'genero' && styles.activeTab]} 
          onPress={() => setActiveTab('genero')}
        >
          <Ionicons name="transgender-outline" size={20} color={activeTab === 'genero' ? '#fff' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'genero' && styles.activeTabText]}>Género</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'edad' && styles.activeTab]} 
          onPress={() => setActiveTab('edad')}
        >
          <Ionicons name="calendar-outline" size={20} color={activeTab === 'edad' ? '#fff' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'edad' && styles.activeTabText]}>Edad</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Gender View */}
        {activeTab === 'genero' && (
          <View style={styles.toolView}>
            <Text style={styles.toolTitle}>Predecir Género</Text>
            <Text style={styles.toolSubtitle}>
              Ingresa un nombre de pila y estimaremos si es de género masculino o femenino.
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Ej. Irma, Juan, Maria..."
              value={genderName}
              onChangeText={setGenderName}
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity style={styles.button} onPress={fetchGender} disabled={genderLoading}>
              {genderLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Predecir</Text>
              )}
            </TouchableOpacity>

            {genderError ? (
              <Text style={styles.errorText}>{genderError}</Text>
            ) : null}

            {genderResult && (
              <View style={[
                styles.resultCard, 
                genderResult.gender === 'male' ? styles.maleCard : styles.femaleCard
              ]}>
                <Ionicons 
                  name={genderResult.gender === 'male' ? 'male' : 'female'} 
                  size={54} 
                  color={genderResult.gender === 'male' ? '#0284c7' : '#db2777'} 
                />
                <Text style={[
                  styles.resultName, 
                  { color: genderResult.gender === 'male' ? '#0369a1' : '#be185d' }
                ]}>
                  {genderResult.name}
                </Text>
                
                <Text style={[
                  styles.genderText,
                  { color: genderResult.gender === 'male' ? '#0c4a6e' : '#831843' }
                ]}>
                  Género estimado: {genderResult.gender === 'male' ? 'MASCULINO' : 'FEMENINO'}
                </Text>
                
                <Text style={[
                  styles.probText,
                  { color: genderResult.gender === 'male' ? '#0369a1' : '#be185d' }
                ]}>
                  Probabilidad: {(genderResult.probability * 100).toFixed(0)}%
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Age View */}
        {activeTab === 'edad' && (
          <View style={styles.toolView}>
            <Text style={styles.toolTitle}>Determinar Edad</Text>
            <Text style={styles.toolSubtitle}>
              Ingresa un nombre de pila y calcularemos la edad promedio y etapa de la vida.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ej. Meelad, Pedro, Sofia..."
              value={ageName}
              onChangeText={setAgeName}
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity style={[styles.button, { backgroundColor: '#0891b2' }]} onPress={fetchAge} disabled={ageLoading}>
              {ageLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Determinar Edad</Text>
              )}
            </TouchableOpacity>

            {ageError ? (
              <Text style={styles.errorText}>{ageError}</Text>
            ) : null}

            {ageResult && (() => {
              const details = getAgeDetails(ageResult.age);
              return (
                <View style={styles.ageResultCard}>
                  <Image source={details.avatar} style={styles.avatarImage} />
                  <Text style={styles.ageName}>{ageResult.name}</Text>
                  
                  <View style={styles.badgeContainer}>
                    <View style={[styles.ageBadge, { backgroundColor: details.color }]}>
                      <Text style={styles.badgeText}>{details.label}</Text>
                    </View>
                    <Text style={styles.ageText}>{ageResult.age} años</Text>
                  </View>
                  
                  <Text style={styles.ageDesc}>{details.desc}</Text>
                </View>
              );
            })()}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    margin: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#4f46e5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  toolView: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  toolTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  toolSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#334155',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  resultCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 10,
  },
  maleCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  femaleCard: {
    backgroundColor: '#fdf2f8',
    borderColor: '#fbcfe8',
  },
  resultName: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 10,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  probText: {
    fontSize: 14,
    marginTop: 4,
  },
  ageResultCard: {
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#d8b4fe',
  },
  ageName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#581c87',
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  ageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  ageText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b0764',
  },
  ageDesc: {
    fontSize: 14,
    color: '#6b21a8',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
});
