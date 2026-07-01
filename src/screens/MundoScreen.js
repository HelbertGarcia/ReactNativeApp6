import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MundoScreen() {
  const [activeTab, setActiveTab] = useState('universidades'); // 'universidades' | 'clima'

  // States for Universities
  const [country, setCountry] = useState('Dominican Republic');
  const [universities, setUniversities] = useState([]);
  const [uniLoading, setUniLoading] = useState(false);
  const [uniError, setUniError] = useState('');

  // States for Weather
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  // Fetch Universities
  const fetchUniversities = async () => {
    if (!country.trim()) {
      setUniError('Por favor ingresa un país.');
      return;
    }
    setUniLoading(true);
    setUniError('');
    setUniversities([]);
    try {
      const formattedCountry = country.trim().replace(/\s+/g, '+');
      const response = await fetch(`https://adamix.net/proxy.php?country=${formattedCountry}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setUniversities(data);
      } else {
        setUniError('No se encontraron universidades para este país.');
      }
    } catch (err) {
      setUniError('Error al conectar con la API de universidades.');
    } finally {
      setUniLoading(false);
    }
  };

  // Fetch Weather
  const fetchWeather = async () => {
    setWeatherLoading(true);
    setWeatherError('');
    try {
      // Santo Domingo, DR coordinates: 18.4861° N, 69.9312° W
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=18.4861&longitude=-69.9312&current_weather=true`
      );
      const data = await response.json();
      if (data.current_weather) {
        setWeatherData(data.current_weather);
      } else {
        setWeatherError('No se pudo cargar la información del clima.');
      }
    } catch (err) {
      setWeatherError('Error al obtener el clima actual.');
    } finally {
      setWeatherLoading(false);
    }
  };

  // Auto-fetch universities for Dominican Republic and Weather on load
  useEffect(() => {
    fetchUniversities();
    fetchWeather();
  }, []);

  // Map WMO weather codes to readable Spanish descriptors & icons
  const getWeatherDetails = (code) => {
    const defaultIcon = 'cloud-outline';
    if (code === 0) return { label: 'Despejado / Soleado', icon: 'sunny-outline', color: '#f59e0b' };
    if ([1, 2, 3].includes(code)) return { label: 'Parcialmente Nublado', icon: 'cloudy-outline', color: '#64748b' };
    if ([45, 48].includes(code)) return { label: 'Neblina densa', icon: 'eye-off-outline', color: '#94a3b8' };
    if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Llovizna', icon: 'rainy-outline', color: '#38bdf8' };
    if ([61, 63, 65, 66, 67].includes(code)) return { label: 'Lluvia Moderada', icon: 'rainy-outline', color: '#0284c7' };
    if ([71, 73, 75, 77].includes(code)) return { label: 'Nieve', icon: 'snow-outline', color: '#93c5fd' };
    if ([80, 81, 82].includes(code)) return { label: 'Chubascos de lluvia', icon: 'umbrella-outline', color: '#0369a1' };
    if ([95, 96, 99].includes(code)) return { label: 'Tormenta Eléctrica', icon: 'thunderstorm-outline', color: '#4f46e5' };
    return { label: 'Nublado / Variable', icon: defaultIcon, color: '#475569' };
  };

  // Safe open URL helper
  const handleOpenURL = async (url) => {
    let targetUrl = url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `http://${targetUrl}`;
    }
    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      } else {
        alert(`No se puede abrir el sitio: ${targetUrl}`);
      }
    } catch (err) {
      console.log('Error opening link', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'universidades' && styles.activeTab]}
          onPress={() => setActiveTab('universidades')}
        >
          <Ionicons name="business-outline" size={20} color={activeTab === 'universidades' ? '#fff' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'universidades' && styles.activeTabText]}>Universidades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'clima' && styles.activeTab]}
          onPress={() => setActiveTab('clima')}
        >
          <Ionicons name="partly-sunny-outline" size={20} color={activeTab === 'clima' ? '#fff' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'clima' && styles.activeTabText]}>Clima RD</Text>
        </TouchableOpacity>
      </View>

      {/* Universities Content */}
      {activeTab === 'universidades' && (
        <View style={styles.contentView}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.input}
              placeholder="País en inglés (Ej. United States, Canada)"
              value={country}
              onChangeText={setCountry}
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity style={styles.searchButton} onPress={fetchUniversities} disabled={uniLoading}>
              {uniLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="search" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {uniError ? (
            <Text style={styles.errorText}>{uniError}</Text>
          ) : null}

          {uniLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0891b2" />
              <Text style={styles.loadingText}>Buscando universidades...</Text>
            </View>
          ) : (
            <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContent}>
              <Text style={styles.resultsHeader}>
                Universidades de {country === 'Dominican Republic' ? 'República Dominicana' : country} ({universities.length})
              </Text>
              
              {universities.map((uni, index) => (
                <View key={index} style={styles.uniCard}>
                  <View style={styles.uniHeader}>
                    <Ionicons name="school" size={24} color="#0891b2" />
                    <View style={styles.uniInfo}>
                      <Text style={styles.uniName}>{uni.name}</Text>
                      <Text style={styles.uniDomain}>Dominio: {uni.domains ? uni.domains[0] : 'N/D'}</Text>
                    </View>
                  </View>

                  {uni.web_pages && uni.web_pages[0] && (
                    <TouchableOpacity 
                      style={styles.linkButton} 
                      onPress={() => handleOpenURL(uni.web_pages[0])}
                    >
                      <Text style={styles.linkText}>Visitar sitio web</Text>
                      <Ionicons name="open-outline" size={16} color="#0891b2" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Weather Content */}
      {activeTab === 'clima' && (
        <ScrollView contentContainerStyle={styles.weatherScroll}>
          <View style={styles.weatherCard}>
            <Text style={styles.weatherCardTitle}>Clima actual en Santo Domingo</Text>
            <Text style={styles.weatherCountry}>República Dominicana</Text>

            {weatherLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0284c7" />
                <Text style={styles.loadingText}>Obteniendo datos del tiempo...</Text>
              </View>
            ) : weatherError ? (
              <View>
                <Text style={styles.errorText}>{weatherError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchWeather}>
                  <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : weatherData ? (() => {
              const details = getWeatherDetails(weatherData.weathercode);
              return (
                <View style={styles.weatherDetails}>
                  <Ionicons name={details.icon} size={84} color={details.color} style={styles.weatherIcon} />
                  
                  <Text style={styles.tempText}>{weatherData.temperature}°C</Text>
                  <Text style={[styles.descText, { color: details.color }]}>{details.label}</Text>

                  <View style={styles.divider} />

                  <View style={styles.weatherGrid}>
                    <View style={styles.gridItem}>
                      <Ionicons name="speedometer-outline" size={24} color="#64748b" />
                      <Text style={styles.gridLabel}>Viento</Text>
                      <Text style={styles.gridVal}>{weatherData.windspeed} km/h</Text>
                    </View>

                    <View style={styles.gridItem}>
                      <Ionicons name="compass-outline" size={24} color="#64748b" />
                      <Text style={styles.gridLabel}>Dirección</Text>
                      <Text style={styles.gridVal}>{weatherData.winddirection}°</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.weatherTime}>
                    Hora del reporte: {new Date(weatherData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              );
            })() : null}
          </View>
        </ScrollView>
      )}
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
    backgroundColor: '#0891b2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
  },
  contentView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  searchBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#334155',
  },
  searchButton: {
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    borderRadius: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 30,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  uniCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  uniHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  uniInfo: {
    flex: 1,
  },
  uniName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 20,
  },
  uniDomain: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0891b2',
  },
  weatherScroll: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  weatherCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  weatherCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  weatherCountry: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 20,
  },
  weatherDetails: {
    alignItems: 'center',
    width: '100%',
  },
  weatherIcon: {
    marginBottom: 15,
  },
  tempText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0f172a',
  },
  descText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    width: '100%',
    marginVertical: 20,
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  gridItem: {
    alignItems: 'center',
    width: '40%',
  },
  gridLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginTop: 6,
    fontWeight: '600',
  },
  gridVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  weatherTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
