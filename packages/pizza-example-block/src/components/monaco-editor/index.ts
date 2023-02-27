import assign from 'nano-assign';
import { PropType, defineComponent, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import { Uri, editor } from 'monaco-editor-core';
import { monaco, wire } from './monacoEditor';

type MonacoEditor = typeof monaco

export default defineComponent({
  name: 'MonacoEditor',

  props: {
    /**
     * diffEditor 时的初始绑定值
     */
    original: String,
    /**
     * 绑定值
     */
    modelValue: {
      type: String,
      required: true,
    },
    /**
     * 主题
     */
    theme: {
      type: String,
      default: 'github-light',
    },
    /**
     * 语言 options.language
     */
    language: String,
    /**
     * editor 配置
     */
    options: Object as PropType<editor.IStandaloneEditorConstructionOptions>,
    /**
     * 是否 diff editor
     */
    diffEditor: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['editor-will-mount', 'editor-did-mount', 'update:modelValue'],
  setup(props, { emit, expose }) {
    const editorRef = shallowRef<any>();
    const monacoEditor = shallowRef<MonacoEditor>();
    const instance = getCurrentInstance()!;

    function getModifiedEditor() {
      return props.diffEditor ? editorRef.value!.getModifiedEditor() : editorRef.value;
    }

    function getOriginalEditor() {
      return props.diffEditor ? editorRef.value!.getOriginalEditor() : editorRef.value;
    }

    function initMonaco(monaco: MonacoEditor) {
      emit('editor-will-mount', monaco);

      const options = assign(
        {
          value: props.modelValue,
          theme: props.theme,
          language: props.language,
        },
        props.options,
      );

      if (props.diffEditor) {
        editorRef.value = monaco.editor.createDiffEditor(instance.proxy!.$el, options);
        const originalModel = monaco.editor.createModel(
          props.original!,
          props.language,
        );
        const modifiedModel = monaco.editor.createModel(
          props.modelValue,
          props.language,
        );
        editorRef.value.setModel({
          original: originalModel,
          modified: modifiedModel,
        });
      } else {
        const model = monaco.editor.createModel(props.modelValue, props.language, Uri.parse(`file:///${new Date().getTime()}.vue`));

        editorRef.value = monaco.editor.create(instance.proxy!.$el, {
          ...options,
          model,
        });
      }

      wire(editorRef.value);

      const editor = getModifiedEditor();
      editor.onDidChangeModelContent((event: any) => {
        const value = editor.getValue();
        if (props.modelValue !== value) emit('update:modelValue', value, event);
      });

      emit('editor-did-mount', editorRef.value);
    }

    watch(() => props.options!, (options: editor.IStandaloneEditorConstructionOptions) => {
      if (editorRef.value) {
        const editor = getModifiedEditor();
        editor.updateOptions(options);
      }
    }, {
      deep: true,
    });

    watch(() => props.modelValue, (newValue: string) => {
      if (editorRef.value) {
        const editor = getModifiedEditor();
        if (newValue !== editor.getValue()) editor.setValue(newValue);
      }
    });

    watch(() => props.original, (newValue) => {
      if (editorRef.value && props.diffEditor) {
        const editor = getOriginalEditor();
        if (newValue !== editor.getValue()) editor.setValue(newValue);
      }
    });

    watch(() => props.language, (newValue) => {
      if (editorRef.value) {
        const editor = getModifiedEditor();
        monacoEditor.value!.editor.setModelLanguage(editor.getModel(), newValue!);
      }
    });

    watch(() => props.theme, (newVal) => {
      if (editorRef.value) monacoEditor.value!.editor.setTheme(newVal);
    });

    onMounted(async () => {
      monacoEditor.value = monaco;
      nextTick(() => {
        initMonaco(monacoEditor.value!);
      });
    });

    onBeforeUnmount(() => {
      editorRef.value && editorRef.value.dispose();
    });

    expose({
      getEditor() {
        return editorRef.value;
      },
      getOriginalEditor,
      focus() {
        editorRef.value && editorRef.value.focus();
      },
    });

    return () => h('div');
  },
});
