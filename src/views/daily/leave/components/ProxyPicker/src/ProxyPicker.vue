<template>
  <FormItemRest>
    <Input
      :value="currentEmployeeRealName"
      readonly
      :placeholder="'點擊選擇員工'"
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
  <proxyModal @register="registerModal" @success="onSuccess" />
</template>

<script lang="ts" setup>
  import { Input, FormItemRest } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import proxyModal from './proxyModal.vue';
  import { useModal } from '@/components/Modal';
  import { watchEffect, ref, watch } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { EmployeeModel } from '@/api/database/employee/model/employeeModel';

  // Don't inherit FormItem disabled、placeholder...
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits(['update:employeeId', 'update:departmentId']);

  const { prefixCls } = useDesign('department-user-picker');

  //-modal初始化
  const [registerModal, { openModal }] = useModal();

  /**
   * @description 選擇的員工完整資訊
   */
  const currentEmployeeId = ref<number>(0);
  const currentEmployeeRealName = ref<string>('');
  const currentDepartmentId = ref<number>(0);

  export interface Props {
    employeeId?: number;
    width?: string;
    disabled?: boolean;
    departmentId?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    employeeId: 0,
    width: '100%',
    departmentId: 0,
  });

  /**
   * @description 當modal選擇成功回傳值
   */
  const onSuccess = (arg: EmployeeModel) => {
    currentEmployeeRealName.value = arg.realName!;
    currentEmployeeId.value = arg.ID;
    currentDepartmentId.value = arg.departmentId!;
  };

  /**
   * @description 清除
   */
  const clear = () => {
    if (props.disabled) {
      return;
    }
    currentEmployeeRealName.value = '';
    currentEmployeeId.value = 0;
    currentDepartmentId.value = 0;
  };

  /**
   * @description 設置姓名
   */
  const setRealName = (name: string) => {
    currentEmployeeRealName.value = name;
  };

  watchEffect(() => {
    currentEmployeeId.value = props.employeeId;
  });

  watchEffect(() => {
    currentDepartmentId.value = props.departmentId;
  });

  watch(
    () => currentEmployeeId.value,
    (v) => {
      emit('update:employeeId', v);
    },
  );

  watch(
    () => currentDepartmentId.value,
    (v) => {
      emit('update:departmentId', v);
    },
  );

  defineExpose({ clear, setRealName });
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
