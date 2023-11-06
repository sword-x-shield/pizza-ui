import { ComponentDoc } from 'vue-docgen-api';
import { toKebabCase } from '../utils';
import templates from './templates';

export * from './utils';

export function getApiTemplate(componentDoc: ComponentDoc | ComponentDoc[], lang) {
  const componentDocList = Array.isArray(componentDoc)
    ? componentDoc
    : [componentDoc];

  const res: string[] = [];

  componentDocList.forEach((item) => {
    const { displayName, props, events, methods, slots, tags } = item;

    const getTmpl = (suffix: 'Props' | 'Events' | 'Methods' | 'Slots', content: string) => {
      if (!content) {
        return '';
      }

      let title = displayName;

      title = tags?.noBrackets
        ? displayName
        : toKebabCase(displayName);
      title = `${title} ${suffix}`;

      if (tags?.version) {
        const version = (tags.version[0] as any)?.description;
        version && (title += ` (${version})`);
      }

      let description = '';
      if (suffix === 'Props' && tags?.[lang]) {
        description = (tags[lang][0] as any)?.description;
      }

      return `### ${title}${description ? `\n${description}` : ''}\n${content}`;
    };

    const propsTmpl = getTmpl(
      'Props',
      templates.props(props || [], { isInterface: false }, lang),
    );
    const eventsTmpl = getTmpl('Events', templates.events(events || [], lang));
    const methodsTmpl = getTmpl(
      'Methods',
      templates.methods(methods || [], lang),
    );
    const slotsTmpl = getTmpl('Slots', templates.slots(slots || [], lang));

    res.push(`\n${propsTmpl}${eventsTmpl}${methodsTmpl}${slotsTmpl}\n`);
  });

  return res.join('\n');
}
