import { BasicColumn, FormSchema } from '@/components/Table';
import dayjs from 'dayjs';

export const column: BasicColumn[] = [
  {
    title: '假別',
    customRender: ({ record }) => {
      return record.leave.name;
    },
  },
  {
    title: '生效時間',
    customRender: ({ record }) => {
      return record.effective;
    },
  },
  {
    title: '過期時間',
    customRender: ({ record }) => {
      return record.expired;
    },
  },
  {
    title: '可用天數',
    customRender: ({ record }) => {
      return record.available;
    },
  },
  {
    title: '簽核中天數',
    customRender: ({ record }) => {
      return record.signing;
    },
  },
  {
    title: '已使用天數',
    customRender: ({ record }) => {
      return record.used;
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '年度',
    field: 'year',
    component: 'Select',
    defaultValue: dayjs().format('YYYY'),
    componentProps: {
      options: createSearchSelectOptions(),
    },
    colProps: { span: 8 },
  },
];

function createSearchSelectOptions() {
  const start = dayjs().year();
  const options: { label: string; value: string }[] = [];
  for (let i = start - 5; i <= start; i++) {
    options.push({
      label: String(i),
      value: String(i),
    });
  }
  return options;
}
