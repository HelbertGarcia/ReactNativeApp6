import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const developerInfo = {
    name: 'Helbert Garcia Espinal',
    role: 'Desarrollador Full Stack & Mobile',
    bio: 'Apasionado por la creación de soluciones móviles y web de alto rendimiento. Experto en React Native, Expo, Node.js y diseño de interfaces de usuario modernas y accesibles. Disponible para contratación freelance y proyectos de desarrollo de software.',
    email: 'helbertg09@gmail.com', // Actualized email
    phone: '+1 (829) 123-4567',        // Placeholder for user's phone
    github: 'https://github.com/helbertg09', // Actualized github
    linkedin: 'https://linkedin.com/in/helbertg09', // Actualized linkedin
    location: 'Santo Domingo, República Dominicana'
  };

  const handleContact = (type, value) => {
    if (type === 'email') {
      Linking.openURL(`mailto:${value}?subject=Oportunidad de Trabajo`);
    } else if (type === 'phone') {
      Linking.openURL(`tel:${value}`);
    } else {
      Linking.openURL(value);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileCard}>
        {/* Profile Avatar */}
        <Image 
          source={require('../../assets/avatar.jpg')} 
          style={styles.avatar} 
          resizeMode="cover"
        />

        <Text style={styles.name}>{developerInfo.name}</Text>
        <Text style={styles.role}>{developerInfo.role}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text style={styles.locationText}>{developerInfo.location}</Text>
        </View>

        <Text style={styles.bio}>{developerInfo.bio}</Text>

        <View style={styles.divider} />

        {/* Contact Links */}
        <Text style={styles.sectionTitle}>Datos de Contacto</Text>
        
        <View style={styles.contactList}>
          {/* Email */}
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => handleContact('email', developerInfo.email)}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="mail" size={20} color="#dc2626" />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Correo Electrónico</Text>
              <Text style={styles.contactValue}>{developerInfo.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => handleContact('phone', developerInfo.phone)}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="call" size={20} color="#16a34a" />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Teléfono / WhatsApp</Text>
              <Text style={styles.contactValue}>{developerInfo.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
          </TouchableOpacity>

          {/* GitHub */}
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => handleContact('link', developerInfo.github)}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#f1f5f9' }]}>
              <Ionicons name="logo-github" size={20} color="#0f172a" />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>GitHub Profile</Text>
              <Text style={styles.contactValue}>github.com/helbertg09</Text>
            </View>
            <Ionicons name="open-outline" size={18} color="#cbd5e1" />
          </TouchableOpacity>

          {/* LinkedIn */}
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => handleContact('link', developerInfo.linkedin)}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="logo-linkedin" size={20} color="#0284c7" />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>LinkedIn Connect</Text>
              <Text style={styles.contactValue}>linkedin.com/in/helbertg09</Text>
            </View>
            <Ionicons name="open-outline" size={18} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.hireButton}
          onPress={() => handleContact('email', developerInfo.email)}
        >
          <Text style={styles.hireButtonText}>Contrátame</Text>
          <Ionicons name="paper-plane" size={18} color="#fff" />
        </TouchableOpacity>
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
  },
  profileCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#059669',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  role: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginTop: 4,
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#64748b',
  },
  bio: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 15,
    paddingHorizontal: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    width: '100%',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  contactList: {
    width: '100%',
    gap: 12,
    marginBottom: 25,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  contactValue: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
    marginTop: 2,
  },
  hireButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
  },
  hireButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
