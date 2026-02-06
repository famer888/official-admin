import {
  NInput,
  NSelect,
  NCascader,
  NDatePicker,
  NTimePicker,
  NInputNumber,
  NRadioGroup,
  NCheckbox,
  NSwitch,
} from 'naive-ui'
import CustomUpload from '@/components/CustomUpload/index.vue'

export const fieldsMap = {
  NInput: NInput,
  NSelect: NSelect,
  NCascader: NCascader,
  NDatePicker: NDatePicker,
  NTimePicker: NTimePicker,
  NInputNumber: NInputNumber,
  NRadioGroup: NRadioGroup,
  NCheckbox: NCheckbox,
  NSwitch: NSwitch,
  NUpload: CustomUpload,
}
