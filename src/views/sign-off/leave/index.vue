<template>
  <div>
    <div v-if="!isPDF" class="flex items-center absolute right-4 top-4">
      <AppLocalePicker class="enter-x xl:text-gray-600" :show-text="false" :reload="false" />
    </div>

    <div v-loading="loading" :class="contentClass">
      <!--標題-->
      <div class="text-center">
        <h2 class="title">{{ t('signOff.leave.title') }}</h2>
      </div>

      <!--分隔線-->
      <Divider :class="`${prefixCls}-divider`" />

      <!--請假單訊息-->
      <Description
        :class="`${prefixCls}-description`"
        :column="{ xxl: 4, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }"
        :data="leaveFormData"
        :schema="infoDescSchema"
      />

      <!--請假單內容-->
      <Description
        :class="`${prefixCls}-description`"
        layout="vertical"
        :column="{
          md: detailDescSchema.length,
          sm: detailDescSchema.length - 4,
          xs: detailDescSchema.length - 6,
        }"
        :data="leaveFormData"
        :schema="detailDescSchema"
      />

      <!--簽核意見-->
      <div v-if="showComment">
        <span class="sign-off-comment">{{ t('signOff.leave.comment') }}</span>
        <Textarea
          :class="`${prefixCls}-textarea`"
          v-model:value="comment"
          :disabled="disableComment"
          :placeholder="t('signOff.leave.commentPlaceholder')"
          allow-clear
          :autoSize="{ minRows: 3 }"
        />
      </div>

      <!--按鈕-->
      <div v-if="showButton" class="button">
        <Button class="mr-2" type="primary" @click="handleApprove">{{
          t('signOff.leave.approve')
        }}</Button>
        <Button type="primary" danger @click="handleReject">{{ t('signOff.leave.reject') }}</Button>
      </div>

      <hr v-if="showComment || showButton" />

      <!--簽核歷程-->
      <div class="sign-off-history">
        <h3 class="title">{{ t('signOff.leave.historyTitle') }}</h3>
        <Divider :class="`${prefixCls}-divider`" />
        <BasicTable
          :class="`${prefixCls}-table`"
          :columns="columns"
          :dataSource="leaveFormData?.signOffFlow"
          :bordered="true"
          :showIndexColumn="false"
          :striped="false"
          :canResize="false"
          :pagination="false"
          :rowClassName="rowClassName"
          :ellipsis="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useDesign } from '@/hooks/web/useDesign';
  import { Description } from '@/components/Description';
  import { infoDescSchema, detailDescSchema, columns } from './Leave.data';
  import { onMounted, reactive, ref, unref, watch, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { BasicTable } from '@/components/Table';
  import { AppLocalePicker } from '@/components/Application';
  import { useMessage } from '@/hooks/web/useMessage';
  import { updateDarkTheme } from '@/logics/theme/dark';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { ThemeEnum } from '@/enums/appEnum';
  import { updateHeaderBgColor, updateSidebarBgColor } from '@/logics/theme/updateBackground';
  import { useLocale } from '@/locales/useLocale';
  import type { LocaleType } from '#/config';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Divider, Button, Textarea } from 'ant-design-vue';
  import { getLeaveFormByUUID, leaveApprove, leaveReject } from '@/api/sign-off/leave';
  import { LeaveRequestFormModel, SignNotify, SignStatus } from '@/api/daily/model/leaveModel';

  defineOptions({
    name: 'LeaveSignOff',
    inheritAttrs: false,
  });

  const { prefixCls } = useDesign('leave-sign-off');
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const route = useRoute();
  const { getDarkMode } = useRootSetting();
  const { changeLocale, getLocale } = useLocale();

  const uuid = ref(route.query?.uuid);
  const locale = ref(route.query?.locale);

  //-判斷說是不是為了生成pdf
  const isPDF = ref(route.query?.pdf);

  //-loading
  const loading = ref(false);

  //-body的class
  const contentClass = reactive({});

  //-leave form data
  const leaveFormData = ref<LeaveRequestFormModel>();

  //-是否顯示按鈕
  const showButton = ref(false);

  //-是否顯示comment
  const showComment = ref(false);

  //-是否關閉comment
  const disableComment = ref(false);

  //-comment內容
  const comment = ref('');

  /**
   * @description 獲取請假單內容
   */
  const getLeaveFormDetail = async () => {
    if (typeof uuid.value === 'string') {
      loading.value = true;
      //-取簽核資訊api
      getLeaveFormByUUID(uuid.value)
        .then((res) => {
          leaveFormData.value = res;
          leaveFormData.value?.signOffFlow?.forEach((e) => {
            if (uuid.value === e.uuid) {
              // 顯示按鈕，如果流程狀態=4(簽核中)
              showButton.value = e.status === SignStatus.SignStatusSigning;
              // 顯示簽核意見，如果簽核類型!=4(最後一關的完成後通知)
              showComment.value = e.notify === SignNotify.SignOffPlusNotify;
              // 禁止編輯簽核意見，如果流程狀態!=4(已簽)
              disableComment.value = e.status !== SignStatus.SignStatusSigning;
              // 傳入簽核意見(檢視用)
              comment.value = e.comment!;
            }
          });
        })
        .finally(() => {
          loading.value = false;
          // 渲染完成加上完成class，方便PDF辨識
          contentClass[`${prefixCls}-content-done`] = true;
        });
    }
  };

  /**
   * @description 查詢本關卡level
   */
  const currentLevel = () => {
    let result = -1;
    if (typeof uuid.value === 'string') {
      leaveFormData.value?.signOffFlow?.forEach((e) => {
        if (e.uuid === uuid.value) {
          result = e.level!;
          return;
        }
      });
    }
    return result;
  };

  /**
   * @description 判斷流程該給核准或是駁回class
   * @param record
   * @param _index
   */
  const rowClassName = (record: Recordable<any>, _index: number) => {
    if (record.level === currentLevel()) {
      record.level = `*${record.level}`;
    }
    if (
      record.status === SignStatus.SignStatusApprove ||
      record.status === SignStatus.SignStatusOnlyNotifySuc
    ) {
      return 'approve';
    }

    if (
      record.status === SignStatus.SignStatusReject ||
      record.status === SignStatus.SignStatusOnlyNotifyFail
    ) {
      return 'reject';
    }
    return '';
  };

  /**
   * @description 核准
   */
  const handleApprove = () => {
    if (typeof uuid.value === 'string') {
      loading.value = true;
      leaveApprove(uuid.value, comment.value)
        .then(async () => {
          createMessage.success(t('signOff.leave.approveSucc'));
          await getLeaveFormDetail();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };

  /**
   * @description 駁回
   */
  const handleReject = () => {
    if (typeof uuid.value === 'string') {
      loading.value = true;
      leaveReject(uuid.value, comment.value)
        .then(async () => {
          createMessage.success(t('signOff.leave.rejectSucc'));
          await getLeaveFormDetail();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };

  onMounted(async () => {
    // 如果主題為暗黑主題，強制喚回亮色主題
    if (getDarkMode.value === ThemeEnum.DARK) {
      // setDarkMode(ThemeEnum.LIGHT);
      updateDarkTheme(ThemeEnum.LIGHT);
      updateHeaderBgColor();
      updateSidebarBgColor();
    }
    // 語言切換
    if (!locale.value || locale.value === '') {
      locale.value = 'zh_TW';
    }
    if (unref(getLocale) !== locale.value) {
      await changeLocale(locale.value as LocaleType);
      location.reload();
    } else {
      getLeaveFormDetail();
      //-資料抓取完畢，給body一個class，為了爬蟲用
      contentClass[`${prefixCls}-content`] = true;
    }
  });

  // 修改語言操作
  const currLocale = ref();

  watchEffect(() => {
    currLocale.value = [unref(getLocale)];
  });

  watch(
    () => currLocale.value,
    (v) => {
      location.replace(`${route.path}?uuid=${route.query?.uuid}&locale=${v}`);
    },
  );
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-leave-sign-off';

  .@{prefix-cls} {
    &-content {
      height: 100vh;
      min-height: 0;
      padding: 3em;
      overflow: auto;

      .title {
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 30px;
      }

      .sign-off-comment {
        font-size: 15px;
        font-weight: bold;
      }

      .button {
        padding-top: 0.5em;
      }

      hr {
        margin-top: 20px;
        margin-bottom: 20px;
        border: 0;
        border-top: 1px solid #eee;
      }

      .sign-off-history {
        .title {
          margin: 0;
          font-size: 18px;
        }
      }
    }

    &-description {
      padding-bottom: 20px;

      .ant-descriptions-view {
        border: 1px solid rgb(5 5 5 / 6%) !important;

        .ant-descriptions-row {
          border-bottom: 1px solid rgb(5 5 5 / 6%);

          .ant-descriptions-item-content {
            border-inline-end: 1px solid rgb(5 5 5 / 6%);

            span {
              color: rgb(0 0 0 / 88%);
              font-size: 15px;
            }
          }

          .ant-descriptions-item-label {
            background-color: #f0f0f0 !important;
            border-inline-end: 1px solid rgb(5 5 5 / 6%);
            font-weight: bold;

            span {
              color: black;
              font-size: 15px;
            }
          }
        }
      }
    }

    &-textarea {
      background-color: #fff;

      &:focus {
        box-shadow: 0 0 0 2px rgb(0 155 228 / 11%) !important;
      }

      .ant-input {
        border-color: #d9d9d9;
        color: rgb(0 0 0 / 88%);

        &::placeholder {
          color: #d9d9d9;
        }
      }

      .ant-input[disabled] {
        background-color: rgb(0 0 0 / 4%);
      }
    }

    &-divider {
      height: 3px;
      margin: 0;
      border-radius: 3px;
      background-color: #7cb305;
    }

    &-table {
      font-size: 15px;

      .ant-table-container {
        border-inline-start: 1px solid #f0f0f0 !important;

        .ant-table-content {
          table {
            border-top: 1px solid #f0f0f0 !important;

            .ant-table-thead {
              border-bottom: 1px solid #f0f0f0 !important;

              .ant-table-cell {
                border-bottom: 1px solid #f0f0f0 !important;
                background: #fafafa !important;
                color: black;
                border-inline-end: 1px solid #f0f0f0 !important;
              }
            }

            .ant-table-tbody {
              .ant-table-cell {
                border-inline-end: 1px solid #f0f0f0 !important;
                border-bottom: 1px solid #f0f0f0 !important;
                color: black;

                .ant-table-expanded-row-fixed {
                  .ant-empty-normal {
                    color: rgb(0 0 0 / 25%);
                  }
                }

                .ant-table-expanded-row-fixed::after {
                  border-inline-end: 1px solid #f0f0f0 !important;
                }
              }

              .ant-table-cell,
              .ant-table-cell-row-hover {
                background-color: #fff !important;
              }

              .approve {
                .ant-table-cell,
                .ant-table-cell-row-hover {
                  background-color: #ffc !important;
                }
              }

              .reject {
                .ant-table-cell,
                .ant-table-cell-row-hover {
                  background-color: #fcc !important;
                }
              }
            }
          }
        }
      }

      .ant-table-wrapper {
        padding: 0;
      }

      .ant-table {
        background: #fff;
      }
    }
  }
</style>
