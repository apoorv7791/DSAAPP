import React, { useContext, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useTranslation } from '@/app/context/LanguageContext';
import { LESSON_REGISTRY } from '@/lib/lessonRegistry';
import { LearningTopicId } from '@/lib/learningTopics';

interface LessonScreenProps {
  topicId: LearningTopicId;
}

const LessonScreen: React.FC<LessonScreenProps> = ({ topicId }) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const { t, tArray } = useTranslation();

  const config = useMemo(() => LESSON_REGISTRY[topicId], [topicId]);

  const handleCopy = useCallback(async (text: string) => {
    await Clipboard.setStringAsync(text);
    if (Platform.OS === 'android') {
      ToastAndroid.show(t('common.copied'), ToastAndroid.SHORT);
    } else {
      Alert.alert('', t('common.copied'));
    }
  }, [t]);

  const resolvedContent = useMemo(() => {
    if (!config) return [];

    return config.blocks.map((block) => {
      // 1. Resolve Heading/Title text
      let text = '';
      if (block.key) {
        text = t(`topicContent.${topicId}.${block.key}`);
      } else if (block.staticText) {
        text = block.staticText;
      }

      // 2. Resolve Descriptions or Subheading Paragraphs
      let desc = '';
      if (block.descKey) {
        desc = t(`topicContent.${topicId}.${block.descKey}`);
      } else if (block.staticDesc) {
        desc = block.staticDesc;
      }

      // 3. Resolve block title
      let title = '';
      if (block.titleKey) {
        // Can be absolute or relative lookup
        title = block.titleKey.includes('.') ? t(block.titleKey) : t(`topicContent.${topicId}.${block.titleKey}`);
      } else if (block.staticTitle) {
        title = block.staticTitle;
      }

      // 4. Resolve List items
      let listItems: string[] = [];
      if (block.listKeys) {
        listItems = block.listKeys.map((k) => t(`topicContent.${topicId}.${k}`));
      } else if (block.listItemsKey) {
        listItems = tArray(block.listItemsKey);
      } else if (block.staticItems) {
        listItems = block.staticItems;
      }

      // 5. Resolve Code attributes
      const language = block.languageKey ? t(block.languageKey) : (block.staticLanguage || 'Java');
      const dataType = block.dataTypeKey ? t(block.dataTypeKey) : (block.staticDataType || '');

      return {
        ...block,
        text,
        desc,
        title,
        listItems,
        language,
        dataType
      };
    });
  }, [config, topicId, t, tArray]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    switch (item.type) {
      case 'subheading':
        return (
          <View style={styles.section}>
            <Text style={styles.subHeading}>{item.text || item.title}</Text>
            {item.desc && <Text style={styles.text}>{item.desc}</Text>}
          </View>
        );

      case 'text':
      case 'paragraph':
        return (
          <View style={styles.section}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        );

      case 'list':
        return (
          <View style={styles.section}>
            {item.title && <Text style={styles.subHeading}>{item.title}</Text>}
            {item.listItems.map((point: string, index: number) => (
              <View key={index} style={styles.listRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{point}</Text>
              </View>
            ))}
          </View>
        );

      case 'code':
        return (
          <View style={styles.section}>
            {item.title && <Text style={styles.subHeading}>{item.title}</Text>}
            {item.desc && <Text style={styles.text}>{item.desc}</Text>}

            <View style={styles.codeBox}>
              <View style={styles.codeHeader}>
                <Text style={styles.codeType}>
                  {item.language} {item.dataType ? `• ${item.dataType}` : ''}
                </Text>
                <Pressable onPress={() => handleCopy(item.text)}>
                  <Text style={styles.copy}>{t('common.copy')}</Text>
                </Pressable>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={styles.code}>{item.text}</Text>
              </ScrollView>
            </View>
          </View>
        );

      default:
        return null;
    }
  }, [handleCopy, styles, t]);

  if (!config) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.text}>Topic configuration not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={resolvedContent}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          config.visualizationRoute ? (
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.btn}
                onPress={() => router.push(config.visualizationRoute as any)}
              >
                <Text style={styles.btnText}>{t('common.visualize')}</Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.bg,
    },
    section: {
      marginBottom: 16,
    },
    subHeading: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 6,
      marginTop: 10,
    },
    text: {
      fontSize: 16,
      color: theme.textSecondary,
      lineHeight: 24,
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    bullet: {
      marginRight: 8,
      color: theme.textSecondary,
      fontSize: 16,
    },
    listText: {
      flex: 1,
      fontSize: 16,
      color: theme.textSecondary,
    },
    codeBox: {
      backgroundColor: theme.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      marginTop: 12,
      marginBottom: 8,
    },
    codeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    codeType: {
      color: theme.textSecondary,
      fontSize: 12,
      flex: 1,
    },
    copy: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: '600',
    },
    code: {
      color: theme.mode === 'dark' ? '#fff' : '#000',
      fontFamily: 'monospace',
      fontSize: 13,
      lineHeight: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    btn: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    btnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default LessonScreen;
