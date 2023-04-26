import { Documentation } from 'vue-docgen-api';
import { parseDocblock } from 'vue-docgen-api/dist/utils/getDocblock.js';
import getDoclets from 'vue-docgen-api/dist/utils/getDoclets.js';

export function slotTagHandler(documentation: Documentation, path: any) {
  const slotComments = path.leadingComments.filter(token => token.type === 'CommentBlock' && token.value.includes('@slot')).filter(Boolean);
  // if no doc block return
  if (!slotComments || !slotComments.length) {
    return Promise.resolve();
  }

  for (const slotComment of slotComments) {
    const _getDoclets = (getDoclets as any).default ?? getDoclets;
    const jsDoc = _getDoclets(parseDocblock(slotComment.value));
    if (jsDoc.tags) {
      const slotTag = jsDoc.tags.find((a: any) => a.title === 'slot');
      if (slotTag) {
        const name = typeof slotTag.content === 'string' ? slotTag.content : 'default';
        const slotDescriptor = documentation.getSlotDescriptor(name);
        slotDescriptor.description = jsDoc.description;
        const bindingsTag = jsDoc.tags.filter((t: any) => t.title === 'binding');
        if (bindingsTag) {
          slotDescriptor.bindings = bindingsTag;
        }

        const customTags = jsDoc.tags.filter((t: any) => t.title !== 'binding' && t.title !== 'slot');
        if (customTags.length) {
          const tags = customTags.reduce((pre, item) => {
            pre[item.title] = item;
            return pre;
          }, {} as any);
          slotDescriptor.tags = tags;
        }
      }
    }
  }
  return Promise.resolve();
}
