<template>
  <FormItemRest>
    <Input
      :value="currentName"
      readonly
      :placeholder="'點擊選擇假別'"
      :class="prefixCls"
      :style="disabled ? { cursor: 'not-allowed', width } : { cursor: 'pointer', width }"
      :disabled="disabled"
      @click="openModal(true, { departmentId })"
    >
      <template #suffix>
        <Icon icon="ant-design:close-circle-filled" style="font-size: 14px" @click="clear" />
      </template>
    </Input>
  </FormItemRest>
  <leaveModalVue @register="registerModal" @success="onSuccess" />
</template>

<script lang="ts" setup>
  import { Input, FormItemRest } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { watchEffect, ref, watch } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { LeaveModel } from '@/api/database/leave/model/leaveModel';
  import leaveModalVue from './leaveModal.vue';

  // Don't inherit FormItem disabled、placeholder...
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits(['update:id', 'update:minimum']);

  const { prefixCls } = useDesign('department-user-picker');

  //-modal初始化
  const [registerModal, { openModal }] = useModal();

  /**
   * @description 選擇的假別完整資訊
   */
  const currentId = ref<number>(0);
  const currentName = ref<string>('');
  const currentMinimum = ref<number>();

  export interface Props {
    id?: number;
    width?: string;
    disabled?: boolean;
    departmentId?: number;
    minimum?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    employeeId: 0,
    width: '100%',
  });

  /**
   * @description 當modal選擇成功回傳值
   */
  const onSuccess = (arg: LeaveModel) => {
    currentName.value = arg.name!;
    currentId.value = arg.ID;
    currentMinimum.value = arg.minimum;
  };

  /**
   * @description 清除
   */
  const clear = () => {
    if (props.disabled) {
      return;
    }
    currentName.value = '';
    currentId.value = 0;
    currentMinimum.value = 0;
  };

  /**
   * @description 設置姓名
   */
  const setName = (name: string) => {
    currentName.value = name;
  };

  watchEffect(() => {
    currentId.value = props.employeeId;
  });

  watchEffect(() => {
    currentMinimum.value = props.minimum;
  });

  watch(
    () => currentId.value,
    (v) => {
      emit('update:id', v);
    },
  );

  watch(
    () => currentMinimum.value,
    (v) => {
      emit('update:minimum', v);
    },
  );

  defineExpose({ clear, setName });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-department-user-picker';

  .@{prefix-cls} {
    .ant-input {
      cursor: pointer;
    }

    .ant-input-suffix {
      //color: #bfbfbf;

      .app-iconify {
        margin: 0;
        transition: color 0.3s;
        color: rgb(0 0 0 / 25%);
        cursor: pointer;
      }

      .app-iconify:hover {
        transition: color 0.3s;
        //color: #bfbfbf;
        color: rgb(0 0 0 / 50%);
      }
    }
  }
</style>
