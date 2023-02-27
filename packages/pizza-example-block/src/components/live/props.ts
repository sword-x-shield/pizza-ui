import { ExtractPropTypes, defineProps } from 'vue';

export const liveProps = {
  /**
   * 是否显示
   */
  show: {
    type: Boolean,
    default: false,
  },
  /**
   * 代码字符串，需要 encodeURIComponent
   */
  code: {
    type: String,
    default: '',
  },
  /**
   * 文件名，唯一标识
   */
  fileName: {
    type: String,
    default() {
      return String(new Date().getTime());
    },
  },
};

export type LiveProps = ExtractPropTypes<typeof liveProps>
