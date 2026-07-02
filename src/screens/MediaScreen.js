import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';

export default function MediaScreen() {
  const [activeTab, setActiveTab] = useState('pokemon'); // 'pokemon' | 'wordpress'

  // States for Pokémon
  const [pokemonName, setPokemonName] = useState('pikachu');
  const [pokemonData, setPokemonData] = useState(null);
  const [pokeLoading, setPokeLoading] = useState(false);
  const [pokeError, setPokeError] = useState('');
  const [cryUri, setCryUri] = useState(null);

  // States for WordPress
  const [posts, setPosts] = useState([]);
  const [wpLoading, setWpLoading] = useState(false);
  const [wpError, setWpError] = useState('');

  // Audio player hook – updates automatically when cryUri changes
  const player = useAudioPlayer(cryUri ? { uri: cryUri } : null);

  // Clean HTML from WordPress excerpts
  const cleanExcerpt = (htmlStr) => {
    if (!htmlStr) return '';
    // Strip tags
    let clean = htmlStr.replace(/<[^>]*>/g, '');
    // Decode common entities
    clean = clean.replace(/&#8217;/g, "'");
    clean = clean.replace(/&#8216;/g, "'");
    clean = clean.replace(/&#8220;/g, '"');
    clean = clean.replace(/&#8221;/g, '"');
    clean = clean.replace(/&#8211;/g, '–');
    clean = clean.replace(/&#038;/g, '&');
    clean = clean.replace(/&amp;/g, '&');
    clean = clean.replace(/\[&hellip;\]/g, '...');
    return clean.trim();
  };

  // Fetch Pokemon
  const fetchPokemon = async () => {
    if (!pokemonName.trim()) {
      setPokeError('Por favor ingresa un nombre.');
      return;
    }
    setPokeLoading(true);
    setPokeError('');
    setPokemonData(null);
    setCryUri(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.trim().toLowerCase()}`);
      if (response.status === 404) {
        setPokeError('Pokémon no encontrado. Verifica la ortografía.');
        return;
      }
      const data = await response.json();
      setPokemonData(data);
    } catch (err) {
      setPokeError('Error al conectar con PokeAPI.');
    } finally {
      setPokeLoading(false);
    }
  };

  // Play Pokemon Cry sound
  const playPokemonCry = useCallback(() => {
    if (!pokemonData || !pokemonData.cries || !pokemonData.cries.latest) {
      alert('Este Pokémon no tiene un sonido registrado.');
      return;
    }

    try {
      // Set the cry URI – the useAudioPlayer hook will load it automatically
      setCryUri(pokemonData.cries.latest);
      // Small delay to allow the player to initialize with the new source
      setTimeout(() => {
        if (player) {
          player.seekTo(0);
          player.play();
        }
      }, 300);
    } catch (e) {
      console.log('Error playing cry sound', e);
      alert('No se pudo reproducir el sonido en esta plataforma.');
    }
  }, [pokemonData, player]);

  // Fetch WordPress posts (TechCrunch API)
  const fetchWordPressPosts = async () => {
    setWpLoading(true);
    setWpError('');
    try {
      const response = await fetch('https://api.allorigins.win/raw?url=https://www.eurohoops.net/wp-json/wp/v2/posts?per_page=3');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setWpError('No se pudieron recuperar las noticias.');
      }
    } catch (err) {
      setWpError('Error de red al conectar con WordPress.');
    } finally {
      setWpLoading(false);
    }
  };

  // Initial fetches
  useEffect(() => {
    fetchPokemon();
    fetchWordPressPosts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pokemon' && styles.activeTab]}
          onPress={() => setActiveTab('pokemon')}
        >
          <Ionicons name="logo-octocat" size={20} color={activeTab === 'pokemon' ? '#fff' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'pokemon' && styles.activeTabText]}>Pokémon</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'wordpress' && styles.activeTab]}
          onPress={() => setActiveTab('wordpress')}
        >
          <Ionicons name="logo-wordpress" size={20} color={activeTab === 'wordpress' ? '#fff' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'wordpress' && styles.activeTabText]}>WordPress</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pokémon View */}
        {activeTab === 'pokemon' && (
          <View style={styles.cardView}>
            <Text style={styles.toolTitle}>Buscador Pokémon</Text>
            <Text style={styles.toolSubtitle}>
              Ingresa el nombre de tu Pokémon favorito para ver su ilustración, estadísticas y escuchar su grito.
            </Text>

            <View style={styles.searchBar}>
              <TextInput
                style={styles.input}
                placeholder="Nombre del Pokémon (Ej. pikachu, charizard)"
                value={pokemonName}
                onChangeText={setPokemonName}
                placeholderTextColor="#94a3b8"
              />
              <TouchableOpacity style={styles.searchButton} onPress={fetchPokemon} disabled={pokeLoading}>
                {pokeLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="search" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            {pokeError ? (
              <Text style={styles.errorText}>{pokeError}</Text>
            ) : null}

            {pokeLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#db2777" />
              </View>
            )}

            {pokemonData && !pokeLoading && (
              <View style={styles.pokemonDetailsCard}>
                <Image
                  source={{ uri: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default }}
                  style={styles.pokemonImage}
                  resizeMode="contain"
                />
                
                <Text style={styles.pokemonName}>
                  {pokemonData.name.toUpperCase()}
                </Text>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Experiencia Base:</Text>
                  <Text style={styles.statValue}>{pokemonData.base_experience} XP</Text>
                </View>

                <View style={styles.abilitySection}>
                  <Text style={styles.abilityTitle}>Habilidades:</Text>
                  <View style={styles.abilitiesList}>
                    {pokemonData.abilities.map((item, idx) => (
                      <View key={idx} style={styles.abilityBadge}>
                        <Text style={styles.abilityText}>
                          {item.ability.name.replace('-', ' ')}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {pokemonData.cries && pokemonData.cries.latest && (
                  <TouchableOpacity style={styles.soundButton} onPress={playPokemonCry}>
                    <Ionicons name="volume-medium-outline" size={22} color="#fff" />
                    <Text style={styles.soundButtonText}>Escuchar Grito</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        {/* WordPress View */}
        {activeTab === 'wordpress' && (
          <View style={styles.cardView}>
            <View style={styles.wordpressHeader}>
              <Image 
                source={{ uri: 'https://www.eurohoops.net/wp-content/uploads/2016/09/cropped-favicon-eurohoops-1-192x192.png' }}
                style={styles.wpLogo}
              />
              <View>
                <Text style={styles.wpSiteName}>Eurohoops</Text>
                <Text style={styles.wpSiteDesc}>Noticias de Baloncesto, NBA y Euroliga</Text>
              </View>
            </View>

            <Text style={styles.wpTitle}>Últimas 3 publicaciones</Text>

            {wpLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ea580c" />
                <Text style={styles.loadingText}>Cargando noticias...</Text>
              </View>
            ) : wpError ? (
              <View>
                <Text style={styles.errorText}>{wpError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchWordPressPosts}>
                  <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.postsList}>
                {posts.map((post, index) => (
                  <View key={post.id || index} style={styles.postCard}>
                    <Text style={styles.postTitle}>
                      {cleanExcerpt(post.title.rendered)}
                    </Text>
                    <Text style={styles.postExcerpt} numberOfLines={3}>
                      {cleanExcerpt(post.excerpt.rendered)}
                    </Text>
                    <TouchableOpacity
                      style={styles.postLinkButton}
                      onPress={() => Linking.openURL(post.link)}
                    >
                      <Text style={styles.postLinkText}>Visitar noticia original</Text>
                      <Ionicons name="arrow-forward" size={14} color="#ea580c" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
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
    backgroundColor: '#db2777',
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
  cardView: {
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
    backgroundColor: '#db2777',
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
    paddingVertical: 30,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
  },
  pokemonDetailsCard: {
    alignItems: 'center',
    backgroundColor: '#fffafb',
    borderWidth: 1,
    borderColor: '#fce7f3',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  pokemonImage: {
    width: 160,
    height: 160,
    marginBottom: 15,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#db2777',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
    marginBottom: 15,
  },
  statLabel: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '700',
  },
  abilitySection: {
    width: '100%',
    marginBottom: 20,
  },
  abilityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  abilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  abilityBadge: {
    backgroundColor: '#fbcfe8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  abilityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9d174d',
    textTransform: 'capitalize',
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#db2777',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: '100%',
  },
  soundButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  wordpressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 15,
  },
  wpLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  wpSiteName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ea580c',
  },
  wpSiteDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  wpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 15,
  },
  postsList: {
    gap: 15,
  },
  postCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 20,
    marginBottom: 8,
  },
  postExcerpt: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  postLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  postLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ea580c',
  },
  retryButton: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
