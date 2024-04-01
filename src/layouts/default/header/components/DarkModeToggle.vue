<template>
  <Tooltip :title="getTitle" placement="bottom" :mouseEnterDelay="0.5">
    <span @click="toggleDarkMode">
      <Icon v-if="getDarkMode !== ThemeEnum.DARK" icon="ion:moon-outline" />
      <Icon v-else icon="ion:sunny-outline" />
    </span>
  </Tooltip>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ThemeEnum } from '@/enums/appEnum';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { updateDarkTheme } from '@/logics/theme/dark';
  import { updateHeaderBgColor, updateSidebarBgColor } from '@/logics/theme/updateBackground';
  import Icon from '@/components/Icon/Icon.vue';

  export default defineComponent({
    name: 'DarkModeToggle',
    components: { Icon, Tooltip },
    setup() {
      const { getDarkMode, setDarkMode } = useRootSetting();
      const { t } = useI18n();
      const getTitle = ref('');

      function toggleDarkMode() {
        const darkMode = getDarkMode.value === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
        setDarkMode(darkMode);
        updateDarkTheme(darkMode);
        updateHeaderBgColor();
        updateSidebarBgColor();
        getTitle.value =
          getDarkMode.value === ThemeEnum.DARK ? t('common.light') : t('common.dark');
      }

      onMounted(() => {
        getTitle.value =
          getDarkMode.value === ThemeEnum.DARK ? t('common.light') : t('common.dark');
      });

      return {
        toggleDarkMode,
        t,
        getDarkMode,
        ThemeEnum,
        getTitle,
      };
    },
  });
</script>
