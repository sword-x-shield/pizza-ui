import { ExtractPropTypes, defineProps } from 'vue';

export const liveProps = {
  show: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
    default: '',
  },
};

export type LiveProps = ExtractPropTypes<typeof liveProps>
