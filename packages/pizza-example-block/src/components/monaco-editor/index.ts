import * as monaco from 'monaco-editor';
import assign from 'nano-assign';
import { defineComponent, h } from 'vue';
import './monacoEditor';

export default defineComponent({
  name: 'MonacoEditor',

  props: {
    original: String,
    modelValue: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: 'vs',
    },
    language: String,
    options: Object,
    diffEditor: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    return () => h('div');
  },

  watch: {
    options: {
      deep: true,
      handler(options: Record<string, any>) {
        if (this.editor) {
          const editor = this.getModifiedEditor();
          editor.updateOptions(options);
        }
      },
    },

    modelValue(newValue: string) {
      if (this.editor) {
        const editor = this.getModifiedEditor();
        if (newValue !== editor.getValue())
          editor.setValue(newValue);
      }
    },

    original(newValue: string) {
      if (this.editor && this.diffEditor) {
        const editor = this.getOriginalEditor();
        if (newValue !== editor.getValue())
          editor.setValue(newValue);
      }
    },

    language(newVal: string) {
      if (this.editor) {
        const editor = this.getModifiedEditor();
        this.monaco.editor.setModelLanguage(editor.getModel(), newVal);
      }
    },

    theme(newVal: string) {
      if (this.editor)
        this.monaco.editor.setTheme(newVal);
    },
  },

  mounted() {
    this.monaco = monaco;
    this.$nextTick(() => {
      this.initMonaco(monaco);
    });
  },

  beforeUnmount() {
    this.editor && this.editor.dispose();
  },

  methods: {
    initMonaco(monaco: any) {
      this.$emit('editorWillMount', this.monaco);

      const options = assign(
        {
          value: this.modelValue,
          theme: this.theme,
          language: this.language,
        },
        this.options,
      );

      if (this.diffEditor) {
        this.editor = monaco.editor.createDiffEditor(this.$el, options);
        const originalModel = monaco.editor.createModel(
          this.original,
          this.language,
        );
        const modifiedModel = monaco.editor.createModel(
          this.modelValue,
          this.language,
        );
        this.editor.setModel({
          original: originalModel,
          modified: modifiedModel,
        });
      }
      else {
        this.editor = monaco.editor.create(this.$el, options);
      }

      const editor = this.getModifiedEditor();
      editor.onDidChangeModelContent((event) => {
        const value = editor.getValue();
        if (this.modelValue !== value)
          this.$emit('update:modelValue', value, event);
      });

      this.$emit('editorDidMount', this.editor);
    },

    getEditor() {
      return this.editor;
    },

    getModifiedEditor() {
      return this.diffEditor ? this.editor.getModifiedEditor() : this.editor;
    },

    getOriginalEditor() {
      return this.diffEditor ? this.editor.getOriginalEditor() : this.editor;
    },

    focus() {
      this.editor.focus();
    },
  },
});
