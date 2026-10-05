
import { useState } from 'react';

import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { useRouter } from 'expo-router';

import { useBudd } from '../context/BuddContext';

export default function CreateScreen() {
  const router = useRouter();

  const { addPost } = useBudd();

  const [text, setText] = useState('');
  const [imageUri, setImageUri] =
    useState<string | null>(null);

  const [publishing, setPublishing] =
    useState(false);

  function cancelar() {
    router.replace('/');
  }

  async function selecionarFoto() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso às suas fotos para escolher uma imagem.',
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (
      !result.canceled &&
      result.assets.length > 0
    ) {
      setImageUri(
        result.assets[0].uri,
      );
    }
  }

  function removerFoto() {
    setImageUri(null);
  }

  function selecionarLocal() {
    Alert.alert(
      'Local',
      'A seleção de local será adicionada posteriormente.',
    );
  }

  function selecionarHumor() {
    Alert.alert(
      'Humor',
      'A opção de humor será adicionada posteriormente.',
    );
  }

  async function publicar() {
    const textoLimpo = text.trim();

    if (
      (textoLimpo.length === 0 &&
        !imageUri) ||
      publishing
    ) {
      return;
    }

    try {
      setPublishing(true);

      console.log(
        'CREATE: chamando addPost()',
      );

      await addPost(
        textoLimpo,
        imageUri,
      );

      console.log(
        'CREATE: publicação concluída',
      );

      router.replace('/');
    } catch (error) {
      console.error(
        'CREATE: erro ao publicar:',
        error,
      );

      const mensagem =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao publicar.';

      Alert.alert(
        'Erro ao publicar',
        mensagem,
      );
    } finally {
      setPublishing(false);
    }
  }

  const podePublicar =
    (text.trim().length > 0 ||
      !!imageUri) &&
    !publishing;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={cancelar}
          style={styles.button}
        >
          <Text style={styles.cancelar}>
            Cancelar
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Criar publicação
        </Text>

        <Pressable
          onPress={publicar}
          style={styles.button}
          disabled={!podePublicar}
        >
          <Text
            style={[
              styles.publicar,
              !podePublicar &&
                styles.publicarDisabled,
            ]}
          >
            {publishing
              ? 'Publicando...'
              : 'Publicar'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* USUÁRIO */}
          <View style={styles.user}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                P
              </Text>
            </View>

            <View>
              <Text style={styles.name}>
                Philip
              </Text>

              <Text style={styles.subtitle}>
                Compartilhando no Budd
              </Text>
            </View>
          </View>

          {/* TEXTO */}
          <TextInput
            style={styles.input}
            placeholder="O que você está pensando?"
            placeholderTextColor="#666"
            multiline
            maxLength={500}
            value={text}
            onChangeText={setText}
            autoFocus={!imageUri}
          />

          <Text style={styles.counter}>
            {text.length}/500
          </Text>

          {/* FOTO */}
          {imageUri ? (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.preview}
              />

              <Pressable
                style={styles.removePhoto}
                onPress={removerFoto}
              >
                <Text style={styles.removePhotoText}>
                  ✕
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.photoArea}>
              <Text style={styles.photoAreaIcon}>
                📷
              </Text>

              <Text style={styles.photoAreaTitle}>
                Adicione uma foto
              </Text>

              <Text style={styles.photoAreaText}>
                Compartilhe um momento,
                lugar ou experiência.
              </Text>

              <Pressable
                style={styles.photoButton}
                onPress={selecionarFoto}
              >
                <Text style={styles.photoButtonText}>
                  Escolher foto
                </Text>
              </Pressable>
            </View>
          )}

          {/* OPÇÕES */}
          <View style={styles.options}>
            <Pressable
              style={styles.option}
              onPress={selecionarFoto}
            >
              <Text style={styles.icon}>
                📷
              </Text>

              <Text style={styles.optionText}>
                Foto
              </Text>
            </Pressable>

            <Pressable
              style={styles.option}
              onPress={selecionarLocal}
            >
              <Text style={styles.icon}>
                📍
              </Text>

              <Text style={styles.optionText}>
                Local
              </Text>
            </Pressable>

            <Pressable
              style={styles.option}
              onPress={selecionarHumor}
            >
              <Text style={styles.icon}>
                😊
              </Text>

              <Text style={styles.optionText}>
                Humor
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
    height: 70,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    minWidth: 80,
  },

  cancelar: {
    color: '#999',
    fontSize: 14,
  },

  title: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },

  publicar: {
    color: '#7CFF00',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },

  publicarDisabled: {
    color: '#444',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  content: {
    padding: 20,
  },

  user: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#7CFF00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
  },

  name: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },

  subtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 3,
  },

  input: {
    minHeight: 150,
    color: '#FFF',
    fontSize: 18,
    lineHeight: 26,
    textAlignVertical: 'top',
  },

  counter: {
    color: '#555',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 5,
  },

  photoArea: {
    minHeight: 190,
    backgroundColor: '#0D0D0D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },

  photoAreaIcon: {
    fontSize: 36,
    marginBottom: 10,
  },

  photoAreaTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  photoAreaText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 250,
    lineHeight: 18,
  },

  photoButton: {
    backgroundColor: '#7CFF00',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },

  photoButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },

  previewContainer: {
    position: 'relative',
    marginTop: 20,
  },

  preview: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: '#111',
  },

  removePhoto: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  removePhotoText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  options: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },

  option: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },

  icon: {
    fontSize: 22,
  },

  optionText: {
    color: '#999',
    fontSize: 12,
    marginTop: 6,
  },
});

